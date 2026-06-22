import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { BACKEND_URL } from "../../utils/config";
import { showToast } from "../../utils/toastUtil";
import { ToastContainer } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import useAnalytics from "../../hooks/useAnalytics";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);
  const { register, isLoggedIn, loadingAuth, user } = useAuth();
  const navigate = useNavigate();
  const { trackSignup } = useAnalytics();

  useEffect(() => {
    if (!loadingAuth && isLoggedIn && !justRegistered) {
      if (user && user.mustChangePassword) {
        navigate("/change-password-first-login");
      } else {
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

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=[{\]};:'",<.>/?\\|`~])(?=.{8,})/;
    if (!passwordRegex.test(password)) {
      showToast(
        "warn",
        "Password must be at least 8 characters, contain one capital letter and one special character."
      );
      setIsSubmitting(false);
      return;
    }

    setJustRegistered(true);
    const result = await register((email || "").trim().toLowerCase(), password);

    if (result.success) {
      trackSignup("email");
      showToast("success", result.message);
      if (result.user && result.user.mustChangePassword) {
        navigate("/change-password-first-login");
      } else {
        navigate("/profile");
      }
    } else {
      showToast("error", `${result.error}`);
    }
    setIsSubmitting(false);
  };

  if (loadingAuth || isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <p className="text-lg font-titillium text-customGray/60">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">

      {/* Left — frog image */}
      <div className="hidden md:block w-1/2">
        <img
          src={`${BACKEND_URL}/images/LMW_fitness_frogs.jpg`}
          alt="Fitness motivation"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right — form panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-linear-to-bl from-white via-yellow-50 to-pink-50 px-8 py-20 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold font-titillium text-customGray tracking-wide">
              Create your account
            </h1>
            <p className="text-sm text-customGray/50 font-titillium mt-1">
              Join LMW Fitness and start your journey
            </p>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-8">
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              method="post"
              action="#"
              name="registerForm"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="register-email"
                  className="block text-sm font-semibold text-customGray font-titillium mb-1.5"
                >
                  Email address
                </label>
                <input
                  id="register-email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-customGray placeholder-gray-300 focus:outline-none focus:border-hotPink focus:ring-1 focus:ring-hotPink font-titillium bg-white transition-colors duration-200"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="register-password"
                  className="block text-sm font-semibold text-customGray font-titillium mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    className="w-full px-4 py-3 pr-11 border border-gray-200 rounded-lg text-sm text-customGray placeholder-gray-300 focus:outline-none focus:border-hotPink focus:ring-1 focus:ring-hotPink font-titillium bg-white transition-colors duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-hotPink transition-colors duration-200"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-customGray/40 font-titillium mt-1.5">
                  Min. 8 characters, one capital letter and one special character
                </p>
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="register-confirm-password"
                  className="block text-sm font-semibold text-customGray font-titillium mb-1.5"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="register-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    className="w-full px-4 py-3 pr-11 border border-gray-200 rounded-lg text-sm text-customGray placeholder-gray-300 focus:outline-none focus:border-hotPink focus:ring-1 focus:ring-hotPink font-titillium bg-white transition-colors duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-hotPink transition-colors duration-200"
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
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
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </motion.button>
            </form>

            <p className="mt-5 text-center text-sm text-customGray/50 font-titillium">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-hotPink hover:text-limeGreen transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default RegisterPage;
