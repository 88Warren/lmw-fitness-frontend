import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { InputField } from "../../controllers/forms/formFields";
import { BACKEND_URL } from "../../utils/config";
import { showToast } from "../../utils/toastUtil";
import { ToastContainer } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams(); 
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  const [loadingToken, setLoadingToken] = useState(true); 

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsValidToken(false);
        setLoadingToken(false);
        showToast("error", "No reset token provided.");
        return;
      }

      try {
        const response = await fetch(`${BACKEND_URL}/api/verify-reset-token`, {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          const data = await response.json();
          showToast("error", data.error || "Invalid or expired password reset link.");
          setIsValidToken(false);
        }
      } catch (error) {
        console.error("Error verifying reset token:", error);
        showToast("error", "Network error during token verification.");
        setIsValidToken(false);
      } finally {
        setLoadingToken(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (password !== confirmPassword) {
      showToast("error", "Passwords do not match.");
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

    // if (password.length < 8) { 
    //     showToast("warn", "Password must be at least 8 characters long.");
    //     setIsSubmitting(false);
    //     return;
    // }

    try {
      const response = await fetch(`${BACKEND_URL}/api/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("success", data.message);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        const errorMessage = data.error || "Failed to reset password. Please try again.";
        showToast("error", errorMessage);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      showToast("error", "Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-customGray p-4">
        <p className="text-xl font-titillium text-customWhite">Verifying reset link...</p>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20 bg-gradient-to-b from-white via-customGray/20 to-customGray/70">
        <div className="max-w-lg bg-customGray p-8 md:p-12 rounded-2xl border-brightYellow border-2 shadow-lg">
          <h2 className="text-3xl md:text-4xl font-bold text-customWhite mb-8 font-higherJump text-center leading-loose tracking-widest">
            Inva<span className="l">l</span>id <span className="l">L</span>ink
          </h2>
          <p className="text-center text-logoGray font-titillium">
            The password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link
            to="/forgot-password"
            className="btn-full-colour w-full inline-block text-center mb-2"
          >
            Request New Link
          </Link>
          <p className="mt-1 text-center text-sm text-logoGray font-titillium">
              Back to{" "}
            <Link
                to="/login"
                className="font-medium text-brightYellow hover:text-hotPink font-titillium"
                >
                Login
            </Link>
        </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-20 bg-gradient-to-b from-white via-customGray/20 to-customGray/70">
      <div className="max-w-md bg-customGray p-8 md:p-12 rounded-2xl border-brightYellow border-2 shadow-lg">
        <h2 className="text-3xl md:text-4xl font-bold text-customWhite mb-12 font-higherJump text-center leading-loose tracking-widest">
          Set Ne<span className="w">w</span> Pass<span className="w">w</span>ord
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="New Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <InputField
            label="Confirm New Password"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <button
            type="submit"
            className="btn-full-colour w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
            <p className="mt-1 text-center text-sm text-logoGray font-titillium">
            Back to{" "}
            <Link
                to="/login"
                className="font-medium text-brightYellow hover:text-hotPink font-titillium"
            >
                Back to Login
            </Link>
            </p>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ResetPassword;