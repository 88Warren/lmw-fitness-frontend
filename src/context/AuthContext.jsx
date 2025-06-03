import { createContext, useState, useEffect, useCallback } from "react";
import { BACKEND_URL } from "../utils/config";
import axios from "axios";

// Create the Auth Context
export const AuthContext = createContext(null);

// Create the Auth Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores user object {id, email, role}
  const [token, setToken] = useState(null); // Stores JWT token
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true); // To indicate if initial loading (from local storage) is done

  // Function to store token and user data in local storage
  const storeAuthData = useCallback((newToken, userData) => {
    localStorage.setItem("jwtToken", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    setIsLoggedIn(true);
    setIsAdmin(userData.role === "admin");
    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`; // Set default Authorization header
  }, []);

  // Function to remove token and user data from local storage
  const clearAuthData = useCallback(() => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
    delete axios.defaults.headers.common["Authorization"]; // Remove Authorization header
  }, []);

  // Effect to load auth data from local storage on initial mount
  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Basic validation for token expiration (optional, can be more robust)
        // You might send the token to backend to validate if it's still active
        // For simplicity, we assume if it's stored, it's valid for now.
        // A real app would send it to a /validate or /profile endpoint.
        storeAuthData(storedToken, userData);
      } catch (e) {
        console.error("Failed to parse user data from local storage:", e);
        clearAuthData(); // Clear invalid data
      }
    }
    setLoading(false); // Finished loading
  }, [storeAuthData, clearAuthData]);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/login`, {
        email,
        password,
      });
      const { token, user } = response.data;
      storeAuthData(token, user);
      return { success: true, message: "Login successful!" };
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.error || error.message,
      );
      clearAuthData();
      return {
        success: false,
        error:
          error.response?.data?.error ||
          "Login failed. Please check your credentials.",
      };
    }
  };

  // Register function
  const register = async (email, password) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/register`, {
        email,
        password,
      });
      const { token, user } = response.data;
      storeAuthData(token, user);
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
      return {
        success: false,
        error: error.response?.data?.error || "Registration failed.",
      };
    }
  };

  // Logout function
  const logout = () => {
    clearAuthData();
    // You might want to invalidate the token on the backend too for security
    // But for JWT, simply deleting it client-side is often sufficient for practical purposes.
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
    // You could render a loading spinner or splash screen here
    return <div data-oid="knl6uzq">Loading authentication...</div>;
  }

  return (
    <AuthContext.Provider value={authContextValue} data-oid="sft1_q_">
      {children}
    </AuthContext.Provider>
  );
};
