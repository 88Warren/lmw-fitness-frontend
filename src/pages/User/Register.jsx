import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { InputField } from "../../controllers/forms/formFields";
import useAuth from "../../hooks/useAuth";
import { BACKEND_URL } from "../../utils/config";
import { showToast } from "../../utils/toastUtil";
import { ToastContainer } from "react-toastify";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);   
  const { register, isLoggedIn, loadingAuth, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if user was already logged in when component mounted (not from fresh registration)
    if (!loadingAuth && isLoggedIn && !justRegistered) {
      // console.log("Register useEffect - User data:", user);
      // console.log("Register useEffect - Must change password:", user?.mustChangePassword);
      
      if (user && user.mustChangePassword) {
        // console.log("Register useEffect - Redirecting to change password");
        navigate("/change-password-first-login");
      } else {
        // console.log("Register useEffect - Redirecting to profile");
        navigate("/profile");
      }
    }
  }, [isLoggedIn, navigate, loadingAuth, user, justRegistered]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!email || !password || !confirmPassword) {
      showToast("warn", "Please fill in all fields.");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      showToast("warn", "Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!passwordRegex.test(password)) {
      showToast(
        "warn",
        "Password must be at least 8 characters long, contain at least one capital letter, and one special character (!@#$%^&*)."
      );
      setIsSubmitting(false);
      return;
    }

    setJustRegistered(true);
    const result = await register(email, password);

    if (result.success) {
      // console.log("Registration result:", result);
      // console.log("User data:", result.user);
      // console.log("Must change password:", result.user?.mustChangePassword);
      
      showToast("success", result.message);
      
      // Navigate immediately based on the registration result
      if (result.user && result.user.mustChangePassword) {
        // console.log("Redirecting to change password page");
        navigate("/change-password-first-login");
      } else {
        // console.log("Redirecting to profile page");
        navigate("/profile");
      }
    } else {
      showToast("error", `${result.error}`);
    }
    setIsSubmitting(false);
  };

  if (loadingAuth || isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <p className="text-xl font-titillium text-brightYellow">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-customWhite">
      {/* Left Side - Image */}
      <div className="w-1/2 flex items-center justify-center">
        <img
          src={`${BACKEND_URL}/images/LMW_fitness_frogs.jpg`}
          alt="Fitness motivation"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Register Card */}
      <div className="w-1/2 bg-customGray flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-customWhite m-8 font-higherJump tracking-widest">
            Register
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
                label="Email Address"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
              />
            <InputField
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <InputField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <button type="submit" className="btn-full-colour w-full" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-logoGray font-titillium">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-brightYellow hover:text-hotPink font-titillium"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer /> 
    </div>
  );
};

export default RegisterPage;
