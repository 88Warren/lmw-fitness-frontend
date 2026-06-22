import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { BACKEND_URL } from "../../utils/config";
import { showToast } from "../../utils/toastUtil";
import { ToastContainer } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isLoggedIn, loadingAuth, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loadingAuth && isLoggedIn) {
      if (user && user.mustChangePassword) {
        navigate("/change-password-first-login");
      } else if (user && user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    }
  }, [isLoggedIn, navigate, loadingAuth, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!email || !password) {
      showToast("warn", "Please enter both email and password.");
      setIsSubmitting(false);
      return;
    }

    const result = await login(email, password);

    if (result.success) {
      showToast("success", result.message);
      setTimeout(() => {
        if (result.user && result.user.mustChangePassword) {
          navigate("/change-password-first-login");
        } else if (result.user && result.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/profile");
        }
      }, 100);
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

      {/* Left — form panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-linear-to-br from-white via-pink-50 to-yellow-50 px-8 py-20 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold font-titillium text-customGray tracking-wide">
              Welcome back
            </h1>
            <p className="text-sm text-customGray/50 font-titillium mt-1">
              Sign in to access your programmes
            </p>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-8">
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              method="post"
              action="#"
              name="loginForm"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-sm font-semibold text-customGray font-titillium mb-1.5"
                >
                  Email address
                </label>
                <input
                  id="login-email"
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
                  htmlFor="login-password"
                  className="block text-sm font-semibold text-customGray font-titillium mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
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
              </div>

              {/* Forgot password */}
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-xs text-customGray/50 hover:text-hotPink font-titillium transition-colors duration-200"
                >
                  Forgot your password?
                </Link>
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
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Right — frog image */}
      <div className="hidden md:block w-1/2">
        <img
          src={`${BACKEND_URL}/images/LMW_fitness_frog.jpg`}
          alt="Fitness motivation"
          className="w-full h-full object-cover"
        />
      </div>

      <ToastContainer />
    </div>
  );
};

export default LoginPage;
