import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { InputField } from "../../controllers/forms/formFields";
import useAuth from '../../hooks/useAuth';
import { showToast } from '../../utils/toastUtil';
import { ToastContainer } from 'react-toastify';
import { BACKEND_URL } from '../../utils/config';
import axios from 'axios';

const ChangePasswordFirstLoginPage = () => {
  // console.log("ChangePasswordFirstLoginPage rendering");
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isLoggedIn, loading, logout, token, updateUser } = useAuth();
  const navigate = useNavigate();

  const [newPasswordInputError, setNewPasswordInputError] = useState(false);
  const [confirmNewPasswordInputError, setConfirmNewPasswordInputError] = useState(false);
  const [passwordMismatchError, setPasswordMismatchError] = useState(false);
  const [passwordComplexityMessage, setPasswordComplexityMessage] = useState('');

  // console.log("User state:", { user, isLoggedIn, loading, token });

  useEffect(() => {
    if (!loading && isLoggedIn && user && !user.mustChangePassword) {
      navigate("/profile");
    }
  }, [isLoggedIn, navigate, user?.mustChangePassword, loading]);

  const handleSubmit = async (e) => {
    // console.log("handleSubmit called");
    e.preventDefault();
    // console.log("Form submitted, setting isSubmitting to true");
    setIsSubmitting(true);
    setNewPasswordInputError(false);
    setConfirmNewPasswordInputError(false);
    setPasswordMismatchError(false);
    setPasswordComplexityMessage('');

    let hasError = false;

    if (!newPassword) {
      setNewPasswordInputError(true);
      hasError = true;
    }
    if (!confirmNewPassword) {
      setConfirmNewPasswordInputError(true);
      hasError = true;
    }
    if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) {
      setPasswordMismatchError(true);
      hasError = true;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (newPassword && !passwordRegex.test(newPassword)) {
      let errorMessage = [];
      if (newPassword.length < 8) {
        errorMessage.push("at least 8 characters long");
      }
      if (!/[A-Z]/.test(newPassword)) {
        errorMessage.push("contain at least one capital letter");
      }
      if (!/[!@#$%^&*]/.test(newPassword)) {
        errorMessage.push("contain at least one special character (!@#$%^&*)");
      }
      setPasswordComplexityMessage("Password must: " + errorMessage.join(", "));
      hasError = true;
    }
    
    if (hasError) {
      showToast("warn", "Please correct the errors in the form.");
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("About to call set-first-time-password endpoint");
      console.log("Token from context:", token);
      
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

      // console.log("API response:", response.data);
      
      if (response.data.message) {
        showToast("success", response.data.message);
        logout(); 
        setTimeout(() => {
          navigate("/login");
        }, 1500); 
      }
    } catch (error) {
      console.error("Error setting password:", error);
      const errorMessage = error.response?.data?.error || "Failed to set password. Please try again.";
      showToast("error", errorMessage);
    }  finally {    
        setIsSubmitting(false);
    }
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
     <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-customGray/30 to-white"
    >
      <div className="bg-customGray p-8 mt-10 rounded-lg max-w-lg w-full border-brightYellow border-2">
        <h2 className="font-higherJump text-3xl md:text-4xl text-center font-bold text-customWhite mb-8 leading-loose tracking-widest">
            Set Your Pass<span className="w">w</span>ord
        </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
              <InputField
                label="New Password"
                type="password"
                name="newPassword"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setNewPasswordInputError(false);
                  setPasswordMismatchError(false); 
                  setPasswordComplexityMessage(''); 
                }}
                placeholder="••••••••"
                required
                className={`${newPasswordInputError || passwordMismatchError || passwordComplexityMessage ? 'border-red-500' : ''}`}
              />
              {newPasswordInputError && <p className="text-red-500 text-sm mt-1">New password cannot be empty.</p>}
              {passwordComplexityMessage && <p className="text-red-500 text-sm mt-1">{passwordComplexityMessage}</p>}
              <InputField
                label="Confirm New Password"
                type="password"
                name="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => {
                  setConfirmNewPassword(e.target.value);
                  setConfirmNewPasswordInputError(false);
                  setPasswordMismatchError(false); 
                }}
                placeholder="••••••••"
                required
                className={`${confirmNewPasswordInputError || passwordMismatchError ? 'border-red-500' : ''}`}
              />
              {confirmNewPasswordInputError && <p className="text-red-500 text-sm mt-1">Confirm password cannot be empty.</p>}
              {passwordMismatchError && <p className="text-red-500 text-sm mt-1">Passwords do not match.</p>}
            <button 
              type="submit" 
              className="btn-full-colour w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Setting Password..." : "Set Password"}
            </button>
          </form>
        </div>
      <ToastContainer />
  </motion.div>
  );
};

export default ChangePasswordFirstLoginPage;
