import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { register, isLoggedIn } = useAuth();
  const navigate = useNavigate();

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
      <div
        className="min-h-screen flex items-center justify-center bg-customWhite p-4"
        data-oid="u7td7:d"
      >
        <p
          className="text-xl font-titillium text-customGray"
          data-oid="a2ozd22"
        >
          Redirecting...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-customWhite" data-oid="gg5z5bs">
      {/* Left Side - Image */}
      <div
        className="w-1/2 bg-customDarkBackground flex items-center justify-center"
        data-oid="v-5m9kq"
      >
        <img
          src="/images/login-page-example-cube-factory.png.webp"
          alt="Fitness motivation"
          className="w-full h-full object-cover"
          data-oid="gn71s8."
        />
      </div>

      {/* Right Side - Register Card */}
      <div
        className="w-1/2 bg-customGray flex items-center justify-center p-8"
        data-oid="rf1uxh-"
      >
        <div className="w-full max-w-md" data-oid="t2uo.:9">
          <h2
            className="text-3xl font-bold text-center text-customWhite mb-8 font-higherJump tracking-widest"
            data-oid="dkw:6qs"
          >
            <span className="r" data-oid="-l:day:">
              R
            </span>
            egister
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            data-oid="vbhwonq"
          >
            <div data-oid="iymnty6">
              <label
                htmlFor="email"
                className="block mb-2 text-m text-customWhite font-titillium tracking-wide"
                data-oid="u8wmjmz"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-400 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-white focus:border-white focus:border-2 sm:text-m font-titillium bg-gray-700 text-white"
                placeholder="ifnotnowthenwhen@myself.co.uk"
                data-oid=":wgqlra"
              />
            </div>
            <div data-oid="::s5qbc">
              <label
                htmlFor="password"
                className="block mb-2 text-m text-customWhite font-titillium tracking-wide"
                data-oid="7o8j:8g"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-400 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-white focus:border-white focus:border-2 sm:text-m font-titillium bg-gray-700 text-white"
                placeholder="••••••••"
                data-oid="o_rzxps"
              />
            </div>
            <div data-oid="b42643s">
              <label
                htmlFor="confirmPassword"
                className="block mb-2 text-m text-customWhite font-titillium tracking-wide"
                data-oid="9t0kx-r"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-400 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-white focus:border-white focus:border-2 sm:text-m font-titillium bg-gray-700 text-white"
                placeholder="••••••••"
                data-oid="cbby02v"
              />
            </div>

            {error && (
              <div
                className="text-hotPink text-sm font-titillium text-center"
                data-oid="yeuh-7y"
              >
                {error}
              </div>
            )}
            {successMessage && (
              <div
                className="text-limeGreen text-sm font-titillium text-center"
                data-oid="sbyj97p"
              >
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              className="btn-full-colour w-full"
              data-oid="y:r6cpe"
            >
              Register
            </button>
          </form>
          <p
            className="mt-6 text-center text-sm text-logoGray font-titillium"
            data-oid="y5fwrux"
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-brightYellow hover:text-hotPink font-titillium"
              data-oid="kc8fbv9"
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
