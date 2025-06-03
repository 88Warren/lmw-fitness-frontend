import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
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
    setError(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    const result = await login(email, password);

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
        className="min-h-screen flex items-center justify-center bg-gray-100 p-4"
        data-oid="gh3wa80"
      >
        <p className="text-xl font-titillium text-gray-700" data-oid="gm1jt:x">
          Redirecting...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-customWhite" data-oid="z-0qiq4">
      {/* Left Side - Login Card */}
      <div
        className="w-1/2 bg-customGray flex items-center justify-center p-8"
        data-oid="rf1uxh-"
      >
        <div className="w-full max-w-md" data-oid="t2uo.:9">
          <h2
            className="text-3xl font-bold text-center text-customWhite mb-8 font-higherJump tracking-widest"
            data-oid="j..d3i:"
          >
            <span className="l" data-oid="-l:day:">
              L
            </span>
            ogin
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            data-oid="86c2oa."
          >
            <div data-oid="6oq.3xm">
              <label
                htmlFor="email"
                className="block mb-2 text-m text-customWhite font-titillium tracking-wide"
                data-oid="ey.dk1p"
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
                placeholder="youareawesome@myself.co.uk"
                data-oid="hnrbohq"
              />
            </div>
            <div data-oid="7nmy9om">
              <label
                htmlFor="password"
                className="block mb-2 text-m text-customWhite font-titillium tracking-wide"
                data-oid="5i2.djr"
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
                data-oid="my.dyup"
              />
            </div>

            <div className="text-right mt-2" data-oid="j75iqkp">
              <Link
                to="/forgot-password"
                className="text-sm text-logoGray hover:text-brightYellow font-titillium"
                data-oid="p2-_a37"
              >
                Forgot Password?
              </Link>
            </div>

            {error && (
              <div
                className="text-hotPink text-sm font-titillium text-center"
                data-oid="6mm367q"
              >
                {error}
              </div>
            )}
            {successMessage && (
              <div
                className="text-limeGreen text-sm font-titillium text-center"
                data-oid="b8-8xw7"
              >
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              className="btn-full-colour w-full"
              data-oid="cltohw:"
            >
              Login
            </button>
          </form>
          <p
            className="mt-6 text-center text-sm text-logoGray font-titillium"
            data-oid="hxgo8l."
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-brightYellow hover:text-hotPink font-titillium"
              data-oid="pi._s5."
            >
              Register here
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image */}
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
    </div>
  );
};

export default LoginPage;
