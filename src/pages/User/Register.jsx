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
    <div
      className="min-h-screen flex items-center justify-center bg-customWhite py-20"
      data-oid="gg5z5bs"
    >
      <div
        className="bg-customGray p-10 rounded-lg shadow-lg max-w-lg w-full border-3 border-brightYellow"
        data-oid="82ymmxn"
      >
        <h2
          className="text-3xl font-bold text-center text-customWhite mt-6 pb-14 font-higherJump tracking-widest"
          data-oid="dkw:6qs"
        >
          Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8" data-oid="vbhwonq">
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
              className="mt-1 block w-full px-4 py-3 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-50 focus:border-gray-50 sm:text-m font-titillium"
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
              className="mt-1 block w-full px-4 py-3 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-50 focus:border-gray-50 sm:text-m font-titillium"
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
              className="mt-1 block w-full px-4 py-3 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-50 focus:border-gray-50 sm:text-m font-titillium"
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
  );
};

export default RegisterPage;

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-customDarkBackground py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
//       {/* Optional: Subtle geometric pattern background for the whole page */}
//       <div className="absolute inset-0 z-0 opacity-5" style={{ backgroundImage: 'url(/images/geometric-pattern.svg)', backgroundSize: 'cover' }}></div>

//       <div className="relative z-10 flex flex-col md:flex-row-reverse max-w-6xl w-full rounded-xl overflow-hidden
//                     border-3 border-brightYellow shadow-2xl shadow-brightYellow/30">

//         {/* Left Section: Cube Factory Image with overlap and gradient */}
//         <div className="relative w-full md:w-1/2 bg-customDarkBackground flex items-center justify-center
//                       rounded-l-xl md:rounded-r-none md:mr-[-50px] lg:mr-[-100px] xl:mr-[-150px] z-0"> {/* Negative margin for overlap */}
//           <img
//             src="/images/login-page-example-cube-factory.png.webp" // Update path to your image
//             alt="Cube Factory"
//             className="w-full h-full object-cover rounded-l-xl opacity-80" // Reduced opacity for blend
//           />
//           {/* Gradient Overlay for soft transition */}
//           <div className="absolute inset-0 bg-gradient-to-l from-customGray via-customGray/50 to-transparent"></div>
//           {/* You might adjust the gradient direction based on where the overlap is */}
//         </div>

//         {/* Right Section: Register Card */}
//         <div className="w-full md:w-1/2 p-10 lg:p-14 bg-customGray flex flex-col justify-center
//                       rounded-r-xl md:rounded-l-none transition-all duration-300 transform hover:scale-[1.01]"> {/* Added hover transform */}
//           <h2 className="text-4xl font-bold text-center text-customWhite pb-8 font-higherJump tracking-widest relative">
//             <span className="l text-brightYellow">J</span>oin Us!
//             {/* Optional: Add a subtle glow/underline effect for the welcome title */}
//             <span className="absolute bottom-4 left-1/2 -translate-x-1/2 w-20 h-1 bg-hotPink rounded-full opacity-70 blur-sm"></span>
//           </h2>
//           <p className="text-center text-customWhite text-lg font-titillium mb-8">
//             Create your account
//           </p>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label htmlFor="email" className="block mb-2 text-m text-customWhite font-titillium tracking-wide">
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="mt-1 block w-full px-4 py-3 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-brightYellow focus:border-brightYellow focus:border-2 sm:text-m font-titillium bg-gray-700 text-white"
//                 placeholder="ifnotnowthenwhen@myself.co.uk"
//               />
//             </div>
//             <div>
//               <label htmlFor="password" className="block mb-2 text-m text-customWhite font-titillium tracking-wide">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="mt-1 block w-full px-4 py-3 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-brightYellow focus:border-brightYellow focus:border-2 sm:text-m font-titillium bg-gray-700 text-white"
//                 placeholder="••••••••"
//               />
//             </div>
//             <div>
//               <label htmlFor="confirmPassword" className="block mb-2 text-m text-customWhite font-titillium tracking-wide">
//                 Confirm Password
//               </label>
//               <input
//                 type="password"
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 required
//                 className="mt-1 block w-full px-4 py-3 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-brightYellow focus:border-brightYellow focus:border-2 sm:text-m font-titillium bg-gray-700 text-white"
//                 placeholder="••••••••"
//               />
//             </div>

//             {error && (
//               <div className="text-hotPink text-sm font-titillium text-center">
//                 {error}
//               </div>
//             )}
//             {successMessage && (
//               <div className="text-limeGreen text-sm font-titillium text-center">
//                 {successMessage}
//               </div>
//             )}

//             <button
//               type="submit"
//               className="w-full py-3 text-lg font-bold rounded-md transition-colors duration-300
//                          bg-brightYellow text-customGray hover:bg-hotPink hover:text-customWhite"
//             >
//               Register
//             </button>
//           </form>

//           {/* Social Logins */}
//           <div className="mt-8 text-center">
//             <p className="text-logoGray text-sm mb-4 font-titillium">Or register with</p>
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

//           <p className="mt-8 text-center text-sm text-logoGray font-titillium">
//             Already have an account?{' '}
//             <Link to="/login" className="font-medium text-brightYellow hover:text-hotPink font-titillium underline">
//               Login here
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;
