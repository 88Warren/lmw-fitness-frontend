import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { InputField } from "../../controllers/forms/formFields";
import useAuth from '../../hooks/useAuth';
import { showToast } from '../../utils/toastUtil';
import { ToastContainer } from 'react-toastify';

const ChangePasswordFirstLoginPage = () => {
  console.log("ChangePasswordFirstLoginPage rendering"); // Debug log
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isLoggedIn, loading, changePassword, logout } = useAuth();
  const navigate = useNavigate();

  console.log("User state:", { user, isLoggedIn, loading }); // Debug log

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate("/login");
    }
    if (!loading && isLoggedIn && user && !user.mustChangePassword) {
      navigate("/profile");
    }
  }, [isLoggedIn, navigate, user?.mustChangePassword, loading]);

  const handleSubmit = async (e) => {
    console.log("handleSubmit called"); // Debug log
    e.preventDefault();
    console.log("Form submitted, setting isSubmitting to true"); // Debug log
    setIsSubmitting(true);

    if (!oldPassword || !newPassword || !confirmNewPassword) {
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

    console.log("About to call changePassword function"); // Debug log
    const result = await changePassword(oldPassword, newPassword, confirmNewPassword);
    console.log("changePassword result:", result); // Debug log

    if (result.success) {
      showToast("success", result.message);
      console.log("Result:", result);
      setTimeout(() => {
        window.location.href = "/profile"; 
      }, 1500);
    } else {
      showToast("error", `${result.error}`);
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
          Change Your Password
        </h2>
        <p className="text-center text-logoGray mb-6">
          Please set a new secure password to continue.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="oldPassword" className="block text-logoGray text-sm font-titillium mb-2">Current Password</label>
            <input
              label="Current Password"
              type="password"
              name="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Your current password"
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-limeGreen"
            />
          </div>
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
            {isSubmitting ? "Changing Password..." : "Change Password"}
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
