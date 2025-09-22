import { createContext, useState, useEffect, useCallback } from "react";
import { BACKEND_URL } from "../utils/config";
import api from "../utils/api";
import { showToast } from "../utils/toastUtil";
import LoadingAndErrorDisplay from "../components/Shared/Errors/LoadingAndErrorDisplay";
import { isTokenExpired, getTimeUntilExpiry } from "../utils/tokenUtils";
import PropTypes from "prop-types";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialLoadError, setInitialLoadError] = useState(null);

  const fetchUserProfile = useCallback(async (authToken) => {
    try {
      // console.log("AuthContext: Fetching fresh user profile from backend");
      const response = await api.get(`${BACKEND_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      // console.log("AuthContext: Fresh profile data received:", response.data);
      return response.data;
    } catch (error) {
      console.error("AuthContext: Failed to fetch user profile:", error);
      throw error;
    }
  }, []);

  const updateUser = useCallback(
    async (updatedUserData) => {
      if (!updatedUserData) {
        try {
          if (!token) {
            // console.warn("AuthContext: Cannot fetch user data - no token available");
            return;
          }
          // console.log("AuthContext: Fetching fresh user data from backend");
          const freshUserData = await fetchUserProfile(token);
          // console.log("AuthContext: Fresh user data received:", freshUserData);
          localStorage.setItem("user", JSON.stringify(freshUserData));
          setUser(freshUserData);
          setIsAdmin(freshUserData.role === "admin");
        } catch (error) {
          console.error("AuthContext: Failed to fetch fresh user data:", error);
        }
      } else {
        // console.log("AuthContext: Updating user data:", updatedUserData);
        localStorage.setItem("user", JSON.stringify(updatedUserData));
        setUser(updatedUserData);
        setIsAdmin(updatedUserData.role === "admin");
      }
    },
    [token, fetchUserProfile]
  );

  const storeAuthData = useCallback((newToken, userData) => {
    // console.log("AuthContext: Storing auth data:", { token: newToken, user: userData });
    localStorage.setItem("jwtToken", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    setIsLoggedIn(true);
    setIsAdmin(userData.role === "admin");
    api.setAuthToken(newToken);
  }, []);

  const clearAuthData = useCallback(() => {
    // console.log("AuthContext: Clearing auth data");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
    api.removeAuthToken();
  }, []);

  const refreshAuthToken = useCallback(async () => {
    try {
      if (!token) {
        throw new Error('No token available for refresh');
      }
      
      // console.log("AuthContext: Refreshing auth token");
      const response = await api.refreshToken();
      const { token: newToken, user: userData } = response.data;
      
      storeAuthData(newToken, userData);
      showToast("success", "Session refreshed successfully");
      return { success: true, token: newToken, user: userData };
    } catch (error) {
      console.error("AuthContext: Token refresh failed:", error);
      clearAuthData();
      showToast("error", "Session expired. Please log in again.");
      return { success: false, error: error.message };
    }
  }, [token, storeAuthData, clearAuthData]);

  useEffect(() => {
    const loadAuth = async () => {
      // console.log("AuthContext: Loading authentication state");
      setLoading(true);
      setInitialLoadError(null);
      const storedToken = localStorage.getItem("jwtToken");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          // console.log("AuthContext: Found stored user data:", userData);

          // Check if token is expired
          if (isTokenExpired(storedToken)) {
            // console.log("AuthContext: Stored token is expired, clearing auth data");
            clearAuthData();
            setInitialLoadError("Your session has expired. Please log in again.");
            setLoading(false);
            return;
          }

          setToken(storedToken);
          setIsLoggedIn(true);
          setIsAdmin(userData.role === "admin");
          api.setAuthToken(storedToken);

          try {
            const freshUserData = await fetchUserProfile(storedToken);
            // console.log("AuthContext: Using fresh profile data:", freshUserData);
            setUser(freshUserData);
            localStorage.setItem("user", JSON.stringify(freshUserData));
          } catch (error) {
            // console.warn("AuthContext: Failed to fetch fresh profile, using stored data:", error);
            
            if (
              error.status === 401 ||
              error.status === 403 ||
              error.message?.includes('expired') ||
              error.message?.includes('invalid')
            ) {
              // console.log("AuthContext: Profile fetch returned auth error, clearing stored data");
              clearAuthData();
              setInitialLoadError(
                "Your session has expired. Please log in again."
              );
              setLoading(false);
              return;
            }
            
            // For other errors, use stored data but still set user as logged in
            setUser(userData);
          }
        } catch (e) {
          console.error(
            "AuthContext: Failed to parse user data from local storage:",
            e
          );
          clearAuthData();
          showToast(
            "error",
            "Your session data is corrupted. Please log in again."
          );
          setInitialLoadError("Session data corrupted. Please log in again.");
        }
      } else {
        // console.log("AuthContext: No stored authentication found");
      }
      setLoading(false);
    };
    loadAuth();
  }, [fetchUserProfile, clearAuthData]);

  // Set up automatic token refresh
  useEffect(() => {
    if (!token || !isLoggedIn) return;

    const checkTokenExpiry = () => {
      if (isTokenExpired(token)) {
        // console.log("AuthContext: Token expired, attempting refresh");
        refreshAuthToken();
        return;
      }

      const timeUntilExpiry = getTimeUntilExpiry(token);
      if (timeUntilExpiry && timeUntilExpiry < 5 * 60 * 1000) { // 5 minutes
        // console.log("AuthContext: Token expiring soon, refreshing proactively");
        refreshAuthToken();
      }
    };

    // Check immediately
    checkTokenExpiry();

    // Set up interval to check every 5 minutes
    const interval = setInterval(checkTokenExpiry, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [token, isLoggedIn, refreshAuthToken]);

  const login = async (email, password) => {
    try {
      // console.log("AuthContext: Attempting login for:", email);
      const response = await api.post(`${BACKEND_URL}/api/login`, {
        email,
        password,
      });
      const { token, user } = response.data;
      // console.log("AuthContext: Login successful, user data:", user);

      storeAuthData(token, user);

      try {
        const freshUserData = await fetchUserProfile(token);
        // console.log("AuthContext: Updated user data after login:", freshUserData);
        updateUser(freshUserData);
      } catch {
        // console.warn("AuthContext: Failed to fetch profile after login, using login data");
      }

      showToast("success", "Login successful!");
      return { success: true, message: "Login successful!", user: user };
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.error || error.message
      );
      clearAuthData();
      const errorMessage =
        error.response?.data?.error ||
        "Login failed. Please check your credentials.";
      showToast("error", `${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (email, password) => {
    try {
      // console.log("AuthContext: Attempting registration for:", email);
      const response = await api.post(`${BACKEND_URL}/api/register`, {
        email,
        password,
      });
      const { token, user } = response.data;
      // console.log("AuthContext: Registration successful, user data:", user);
      // console.log("AuthContext: MustChangePassword value:", user.mustChangePassword);
      storeAuthData(token, user);
      showToast("success", "Registration successful! You are now logged in.");
      return {
        success: true,
        message: "Registration successful! You are now logged in.",
        user: user,
      };
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data?.error || error.message
      );
      clearAuthData();
      const errorMessage =
        error.response?.data?.error || "Registration failed.";
      showToast("error", `${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    // console.log("AuthContext: Logging out");
    clearAuthData();
    showToast("success", "You have been successfully logged out.");
    return { success: true, message: "Logged out successfully." };
  };

  const changePassword = async (
    oldPassword,
    newPassword,
    confirmNewPassword
  ) => {
    try {
      if (!token) {
        showToast("error", "Not authenticated. Please log in.");
        return { success: false, error: "Not authenticated." };
      }

      const response = await api.put(
        `${BACKEND_URL}/api/change-password-first-login`,
        {
          oldPassword,
          newPassword,
          confirmNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      try {
        const freshUserData = await fetchUserProfile(token);
        // console.log("AuthContext: Updated user data after password change:", freshUserData);
        updateUser(freshUserData);
      } catch {
        // console.warn("AuthContext: Failed to fetch profile after password change");
        const updatedUser = { ...user, mustChangePassword: false };
        updateUser(updatedUser);
      }
      showToast("success", response.data.message);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error(
        "Change password failed:",
        error.response?.data?.error || error.message
      );
      const errorMessage =
        error.response?.data?.error || "Failed to change password.";
      showToast("error", `${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  };

  const authContextValue = {
    user,
    updateUser,
    token,
    isLoggedIn,
    isAdmin,
    loading,
    loadingAuth: loading,
    login,
    register,
    logout,
    changePassword,
    storeAuthData,
    clearAuthData,
    fetchUserProfile,
    refreshAuthToken,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <LoadingAndErrorDisplay loading={true} />
      </div>
    );
  }

  if (initialLoadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <LoadingAndErrorDisplay error={initialLoadError} />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
