import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { showToast } from '../../utils/toastUtil';
import { ToastContainer } from 'react-toastify';
import { BACKEND_URL } from '../../utils/config';
import axios from 'axios';

const ChangePasswordFirstLoginPage = () => {
  console.log("ChangePasswordFirstLoginPage rendering"); // Debug log
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isLoggedIn, loading, logout, token } = useAuth();
  const navigate = useNavigate();

  console.log("User state:", { user, isLoggedIn, loading, token }); // Debug log

  useEffect(() => {
    if (!loading && isLoggedIn && user && !user.mustChangePassword) {
      navigate("/profile");
    }
  }, [isLoggedIn, navigate, user?.mustChangePassword, loading]);

  const handleSubmit = async (e) => {
    console.log("handleSubmit called"); // Debug log
    e.preventDefault();
    console.log("Form submitted, setting isSubmitting to true"); // Debug log
    setIsSubmitting(true);

    if (!newPassword || !confirmNewPassword) {
      console.log("Validation failed: missing fields"); // Debug log
      showToast("warn", "Please fill in all fields.");
      setIsSubmitting(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      console.log("Validation failed: passwords don't match"); // Debug log
      showToast("warn", "New passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!passwordRegex.test(newPassword)) {
      console.log("Validation failed: password complexity"); // Debug log
      
      // More specific error messages
      let errorMessage = "Password must meet the following requirements: ";
      const errors = [];
      
      if (newPassword.length < 8) {
        errors.push("at least 8 characters long");
      }
      if (!/[A-Z]/.test(newPassword)) {
        errors.push("contain at least one capital letter");
      }
      if (!/[!@#$%^&*]/.test(newPassword)) {
        errors.push("contain at least one special character (!@#$%^&*)");
      }
      
      errorMessage += errors.join(", ");
      
      console.log("Showing toast with error:", errorMessage); // Debug log
      showToast("warn", errorMessage);
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("About to call set-first-time-password endpoint"); // Debug log
      console.log("Token from context:", token); // Debug log
      
      if (!token) {
        showToast("error", "Authentication token not found. Please log in again.");
        setIsSubmitting(false);
        return;
      }

      const response = await axios.post(
        `${BACKEND_URL}/api/set-first-time-password`,
        {
          newPassword,
          confirmNewPassword
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("API response:", response.data); // Debug log
      
      if (response.data.message) {
        showToast("success", response.data.message);
        setTimeout(() => {
          window.location.href = "/profile"; 
        }, 1500);
      }
    } catch (error) {
      console.error("Error setting password:", error);
      const errorMessage = error.response?.data?.error || "Failed to set password. Please try again.";
      showToast("error", errorMessage);
    }
    
    setIsSubmitting(false);
  };

  if (loading || !isLoggedIn || (user && !user.mustChangePassword)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <p className="text-xl font-titillium text-brightYellow">
          Loading or redirecting...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full border border-limeGreen text-white">
        <h2 className="text-3xl font-bold text-center text-brightYellow mb-6 font-higherJump">
          Set Your Password
        </h2>
        <p className="text-center text-logoGray mb-6">
          Welcome! Please set a secure password to access your workout program.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="newPassword" className="block text-logoGray text-sm font-titillium mb-2">New Password</label>
            <input
              label="New Password"
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-limeGreen"
            />
            <p className="text-xs text-logoGray mt-1">
              Must be at least 8 characters with 1 capital letter and 1 special character (!@#$%^&*)
            </p>
          </div>
          <div>
            <label htmlFor="confirmNewPassword" className="block text-logoGray text-sm font-titillium mb-2">Confirm New Password</label>
            <input
              label="Confirm New Password"
              type="password"
              name="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-limeGreen"
            />
          </div>
          <button 
            type="submit" 
            className="btn-full-colour w-full" 
            disabled={isSubmitting}
            onClick={() => console.log("Button clicked!")} // Debug click handler
          >
            {isSubmitting ? "Setting Password..." : "Set Password"}
          </button>
        </form>
        <button
          onClick={logout}
          className="btn-cancel w-full mt-4"
        >
          Logout
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ChangePasswordFirstLoginPage;
