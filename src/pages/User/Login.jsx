import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { InputField } from "../../controllers/forms/formFields";
import useAuth from "../../hooks/useAuth";
import { BACKEND_URL } from "../../utils/config";
import { showToast } from "../../utils/toastUtil"; 
import { ToastContainer } from "react-toastify";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();  

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/profile");
    }
  }, [isLoggedIn, navigate]);

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
        navigate("/profile");
      }, 1500);
    } else {
      showToast("error", `${result.error}`);
    }
    setIsSubmitting(false);
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-xl font-titillium text-gray-700">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Card */}
      <div className="w-1/2 bg-customGray flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-customWhite mb-8 font-higherJump tracking-widest">
            <span className="l">L</span>
            ogin
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

            <div className="text-right mt-2">
              <Link
                to="/forgot-password"
                className="text-sm text-logoGray hover:text-brightYellow font-titillium"
              >
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="btn-full-colour w-full dark:bg-yellow-400" disabled={isSubmitting}>
              {isSubmitting ? "Logging In..." : "Login"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-logoGray font-titillium">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-brightYellow hover:text-hotPink font-titillium"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="w-1/2 flex items-center justify-center">
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
