import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { InputField } from "../../controllers/forms/formFields";
import useAuth from "../../hooks/useAuth";
import { BACKEND_URL } from "../../utils/config";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { register, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const registerInputClassName =
    "mt-1 block w-full px-4 py-3 border border-gray-400 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-white focus:border-white focus:border-2 sm:text-m font-titillium bg-gray-700 text-white"

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    const result = await register(email, password);

    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } else {
      setError(result.error);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-customWhite p-4">
        <p className="text-xl font-titillium text-customGray">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-customWhite">
      {/* Left Side - Image */}
      <div className="w-1/2 bg-customDarkBackground flex items-center justify-center">
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
                className={registerInputClassName}
                placeholder="youareawesome@example.co.uk"
                required
              />
            <InputField
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={registerInputClassName}
              placeholder="••••••••"
              required
            />
            <InputField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={registerInputClassName}
              placeholder="••••••••"
              required
            />

            {error && (
              <div className="text-hotPink text-sm font-titillium text-center">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="text-limeGreen text-sm font-titillium text-center">
                {successMessage}
              </div>
            )}

            <button type="submit" className="btn-full-colour w-full">
              Register
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
    </div>
  );
};

export default RegisterPage;
