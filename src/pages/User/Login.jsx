import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { InputField } from "../../controllers/forms/formFields";
import useAuth from "../../hooks/useAuth";
import { BACKEND_URL } from "../../utils/config";
import { showToast } from "../../utils/toastUtil"; 
import { ToastContainer } from "react-toastify";
import DynamicHeading from "../../components/Shared/DynamicHeading";
import { Eye, EyeOff } from "lucide-react";

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

    // console.log('Login result:', result);
    // console.log('User from login:', result.user);
    // console.log('Purchased programs:', result.user?.purchasedPrograms);

    if (result.success) {
      showToast("success", result.message);
      // Allow password managers to detect successful login before redirect
      setTimeout(() => {
        if (result.user && result.user.mustChangePassword) {
          navigate("/change-password-first-login");
        } else {
          navigate("/profile");
        }
      }, 100); // Reduced timeout to allow password manager detection
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
    <div className="flex flex-col md:flex-row h-full md:min-h-screen">
      {/* Left Side - Login Card */}
      <div className="w-full md:w-1/2 bg-customGray flex items-start md:items-center justify-center p-14 md:p-8 pt-30 md:pt-8">
        <div className="w-full max-w-md">
          <DynamicHeading
            text="Login"
            className="text-3xl font-bold text-center text-customWhite mb-8 font-higherJump tracking-widest"
          />

          <form onSubmit={handleSubmit} className="space-y-6" method="post" action="#" name="loginForm">
            <InputField
              label="Email Address"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              autoComplete="email"
              required
            />
            <div className="relative">
              <InputField
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 translate-y-1/4 text-logoGray hover:text-brightYellow"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-logoGray hover:text-brightYellow font-titillium"
              >
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="btn-full-colour w-full" disabled={isSubmitting}>
              {isSubmitting ? "Logging In..." : "Login"}
            </button>
          </form>
          {/* <p className="mt-6 text-center text-sm text-logoGray font-titillium">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-brightYellow hover:text-hotPink font-titillium"
            >
              Register here
            </Link>
          </p> */}
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden md:flex w-1/2 items-center justify-center">
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
