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
        data-oid=":.mfoxo"
      >
        <p className="text-xl font-titillium text-gray-700" data-oid=".l6vgym">
          Redirecting...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-customWhite" data-oid="ck8y.gc">
      {/* Left Side - Login Card */}
      <div
        className="w-1/2 bg-customGray flex items-center justify-center p-8"
        data-oid="q0n.yk9"
      >
        <div className="w-full max-w-md" data-oid="z8-et8m">
          <h2
            className="text-3xl font-bold text-center text-customWhite mb-8 font-higherJump tracking-widest"
            data-oid="di.8xar"
          >
            <span className="l" data-oid="df1i3cd">
              L
            </span>
            ogin
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            data-oid="w3klv7o"
          >
            <div data-oid="ex4vel2">
              <label
                htmlFor="email"
                className="block mb-2 text-m text-customWhite font-titillium tracking-wide"
                data-oid="4bp6a4_"
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
                data-oid="r5.dkrf"
              />
            </div>
            <div data-oid="mj8kxhg">
              <label
                htmlFor="password"
                className="block mb-2 text-m text-customWhite font-titillium tracking-wide"
                data-oid="993mgn5"
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
                data-oid="93:g2o8"
              />
            </div>

            <div className="text-right mt-2" data-oid=".1lna5.">
              <Link
                to="/forgot-password"
                className="text-sm text-logoGray hover:text-brightYellow font-titillium"
                data-oid="xwz5odc"
              >
                Forgot Password?
              </Link>
            </div>

            {error && (
              <div
                className="text-hotPink text-sm font-titillium text-center"
                data-oid="pzwpi3v"
              >
                {error}
              </div>
            )}
            {successMessage && (
              <div
                className="text-limeGreen text-sm font-titillium text-center"
                data-oid="s2k1v9y"
              >
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              className="btn-full-colour w-full"
              data-oid="w-g4m6g"
            >
              Login
            </button>
          </form>
          <p
            className="mt-6 text-center text-sm text-logoGray font-titillium"
            data-oid="-g141nc"
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-brightYellow hover:text-hotPink font-titillium"
              data-oid="qd9:ccb"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div
        className="w-1/2 bg-customDarkBackground flex items-center justify-center"
        data-oid="0vgiw8h"
      >
        <img
          src="/images/login-page-example-cube-factory.png.webp"
          alt="Fitness motivation"
          className="w-full h-full object-cover"
          data-oid="7uifs.c"
        />
      </div>
    </div>
  );
};

export default LoginPage;

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-customDarkBackground py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
//       {/* Optional: Subtle geometric pattern background for the whole page */}
//       <div className="absolute inset-0 z-0 opacity-5" style={{ backgroundImage: 'url(/images/geometric-pattern.svg)', backgroundSize: 'cover' }}></div>

//       <div className="relative z-10 flex flex-col md:flex-row max-w-6xl w-full rounded-xl overflow-hidden
//                     border-3 border-brightYellow shadow-2xl shadow-brightYellow/30">

//         {/* Left Section: Login Card */}
//         <div className="w-full md:w-1/2 p-10 lg:p-14 bg-customGray flex flex-col justify-center
//                       rounded-l-xl md:rounded-r-none transition-all duration-300 transform hover:scale-[1.01]"> {/* Added hover transform */}
//           <h2 className="text-4xl font-bold text-center text-customWhite pb-8 font-higherJump tracking-widest relative">
//             <span className="l text-brightYellow">W</span>elcome!
//             {/* Optional: Add a subtle glow/underline effect for the welcome title */}
//             <span className="absolute bottom-4 left-1/2 -translate-x-1/2 w-20 h-1 bg-hotPink rounded-full opacity-70 blur-sm"></span>
//           </h2>
//           <p className="text-center text-customWhite text-lg font-titillium mb-8">
//             Log in to your account
//           </p>
// form
// email
// password
// forgot password
//             </div>

// error
// success
// button - submit

//           {/* Social Logins */}
//           <div className="mt-8 text-center">
//             <p className="text-logoGray text-sm mb-4 font-titillium">Or sign in with</p>
//             <div className="flex justify-center space-x-4">
//               <button className="flex items-center justify-center w-12 h-12 rounded-full bg-socialBlue text-white hover:opacity-80 transition-opacity">
//                 <i className="fab fa-google text-xl"></i> {/* Font Awesome for Google icon */}
//               </button>
//               <button className="flex items-center justify-center w-12 h-12 rounded-full bg-socialFacebook text-white hover:opacity-80 transition-opacity">
//                 <i className="fab fa-facebook-f text-xl"></i> {/* Font Awesome for Facebook icon */}
//               </button>
//               <button className="flex items-center justify-center w-12 h-12 rounded-full bg-socialTwitter text-white hover:opacity-80 transition-opacity">
//                 <i className="fab fa-twitter text-xl"></i> {/* Font Awesome for Twitter icon */}
//               </button>
//             </div>
//           </div>

// dont have account
// register

//         {/* Right Section: Cube Factory Image with overlap and gradient */}
//         <div className="relative w-full md:w-1/2 bg-customDarkBackground flex items-center justify-center
//                       rounded-r-xl md:rounded-l-none md:ml-[-50px] lg:ml-[-100px] xl:ml-[-150px] z-0"> {/* Negative margin for overlap */}
//           <img
//             src="/images/login-page-example-cube-factory.png.webp" // Update path to your image
//             alt="Cube Factory"
//             className="w-full h-full object-cover rounded-r-xl opacity-80" // Reduced opacity for blend
//           />
//           {/* Gradient Overlay for soft transition */}
//           <div className="absolute inset-0 bg-gradient-to-r from-customGray via-customGray/50 to-transparent"></div>
//           {/* You might adjust the gradient direction based on where the overlap is */}
//         </div>
//       </div>
//     </div>
//   );
// };
