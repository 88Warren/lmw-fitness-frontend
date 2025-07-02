import { createContext, useState, useEffect, useCallback } from "react";
import { BACKEND_URL } from "../utils/config";
import axios from "axios";
import { showToast } from '../utils/toastUtil';
import LoadingAndErrorDisplay from '../components/Shared/Errors/LoadingAndErrorDisplay'; 
import PropTypes from 'prop-types';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialLoadError, setInitialLoadError] = useState(null);

  const storeAuthData = useCallback((newToken, userData) => {
    localStorage.setItem("jwtToken", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    setIsLoggedIn(true);
    setIsAdmin(userData.role === "admin");
    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
  }, []);

  const clearAuthData = useCallback(() => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
    delete axios.defaults.headers.common["Authorization"];
  }, []);

  useEffect(() => {
    const loadAuth = async () => { 
      setLoading(true);
      setInitialLoadError(null);
      const storedToken = localStorage.getItem("jwtToken");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          storeAuthData(storedToken, userData);
        } catch (e) {
          console.error("Failed to parse user data from local storage:", e);
          clearAuthData();
          showToast("error", "Your session data is corrupted. Please log in again.");
          setInitialLoadError("Session data corrupted. Please log in again."); 
        }
      }
      setLoading(false);
    };
    loadAuth();
  }, [storeAuthData, clearAuthData]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/login`, {
        email,
        password,
      });
      const { token, user } = response.data;
      storeAuthData(token, user);
      showToast("success", "Login successful!");
      return { success: true, message: "Login successful!" };
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.error || error.message,
      );
      clearAuthData();
      const errorMessage = error.response?.data?.error || "Login failed. Please check your credentials.";
      showToast("error", `${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (email, password) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/register`, {
        email,
        password,
      });
      const { token, user } = response.data;
      storeAuthData(token, user);
      showToast("success", "Registration successful! You are now logged in.");
      return {
        success: true,
        message: "Registration successful! You are now logged in.",
      };
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data?.error || error.message,
      );
      clearAuthData();
      const errorMessage = error.response?.data?.error || "Registration failed.";
      showToast("error", `${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    clearAuthData();
    showToast("success", "You have been successfully logged out.");
    return { success: true, message: "Logged out successfully." };
  };

  const authContextValue = {
    user,
    token,
    isLoggedIn,
    isAdmin,
    loading,
    login,
    register,
    logout,
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