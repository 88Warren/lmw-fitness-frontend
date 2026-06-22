import { useState } from "react";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../../utils/config";
import { showToast } from "../../utils/toastUtil";
import { ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import { FiMail, FiArrowLeft, FiCheckCircle } from "react-icons/fi";

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: (email || "").trim().toLowerCase() }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("success", data.message);
        setRequestSent(true);
      } else {
        showToast("error", data.error || "Failed to send reset email. Please try again.");
      }
    } catch (error) {
      console.error("Error requesting password reset:", error);
      showToast("error", "Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-white via-pink-50 to-yellow-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Back link */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-customGray/50 hover:text-hotPink transition-colors duration-200 mb-6 font-titillium"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>

        {requestSent ? (
          /* ── Success state ── */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-16 h-16 rounded-full bg-limeGreen/15 flex items-center justify-center mx-auto mb-5"
            >
              <FiCheckCircle className="w-8 h-8 text-limeGreen" />
            </motion.div>
            <h1 className="text-2xl font-bold font-titillium text-customGray tracking-wide mb-3">
              Check your inbox
            </h1>
            <p className="text-sm text-customGray/60 font-titillium leading-relaxed mb-8">
              If an account with that email exists, we&apos;ve sent a reset link. Please check your inbox and spam folder.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-linear-to-r from-limeGreen via-brightYellow to-hotPink text-black font-bold font-titillium text-sm hover:shadow-lg hover:shadow-hotPink/20 transition-all duration-300 no-underline"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          /* ── Form state ── */
          <>
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold font-titillium text-customGray tracking-wide">
                Forgot your password?
              </h1>
              <p className="text-sm text-customGray/50 font-titillium mt-1">
                No worries — we&apos;ll send you a reset link.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="forgot-email"
                    className="block text-sm font-semibold text-customGray font-titillium mb-1.5"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                    <input
                      id="forgot-email"
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm text-customGray placeholder-gray-300 focus:outline-none focus:border-hotPink focus:ring-1 focus:ring-hotPink font-titillium bg-white transition-colors duration-200"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.99 } : {}}
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3.5 rounded-xl font-bold font-titillium text-sm flex items-center justify-center gap-2 transition-all duration-300 mt-2 ${
                    isSubmitting
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-linear-to-r from-limeGreen via-brightYellow to-hotPink text-black hover:shadow-lg hover:shadow-hotPink/20"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </motion.button>
              </form>

              <p className="mt-5 text-center text-sm text-customGray/50 font-titillium">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-hotPink hover:text-limeGreen transition-colors duration-200"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </>
        )}
      </motion.div>

      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
