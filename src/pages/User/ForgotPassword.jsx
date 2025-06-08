import { useState } from "react";
import { Link } from "react-router-dom";
import { InputField } from "../../controllers/forms/formFields";
import { BACKEND_URL } from "../../utils/config";
import { showToast } from "../../utils/toastUtil";
import { ToastContainer } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!email) {
      showToast("warn", "Please enter your email address.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("success", data.message);
        setRequestSent(true); 
      } else {
        const errorMessage = data.error || "Failed to send password reset email. Please try again.";
        showToast("error", errorMessage);
      }
    } catch (error) {
      console.error("Error requesting password reset:", error);
      showToast("error", "Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 bg-gradient-to-b from-white via-customGray/20 to-customGray/70">
      <div className="max-w-lg bg-customGray p-8 md:p-12 rounded-2xl border-brightYellow border-2 shadow-lg">
        <h2 className="text-3xl md:text-4xl font-bold text-customWhite mb-8 font-higherJump text-center leading-loose tracking-widest">
          Forgot Pass<span className="w">w</span>ord
        </h2>
        

        {requestSent ? (
          <div className="text-center text-logoGray font-titillium">
            <p className="mb-4 leading-relaxed">
              If an account with that email exists, we've sent you an email with instructions to reset your password. 
              <br /> 
              Please check your inbox (and spam folder).
            </p>
            <Link
              to="/login"
              className="text-brightYellow hover:text-hotPink font-titillium font-medium"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">   
          <p className="text-md text-center text-logoGray font-titillium mb-8">
            Enter your email address and we'll send you a link to reset your password.
          </p>
            <InputField
              label="Email Address"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
            />

            <button
              type="submit"
              className="btn-full-colour w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>

            <p className="mt-1 text-center text-sm text-logoGray font-titillium">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-medium text-brightYellow hover:text-hotPink font-titillium"
              >
                Login here
              </Link>
            </p>
          </form>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;