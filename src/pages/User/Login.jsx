import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { login, isLoggedIn } = useAuth(); 
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/profile'); 
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
        navigate('/'); 
      }, 1500);
    } else {
      setError(result.error);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-xl font-titillium text-gray-700">Redirecting...</p>
      </div>
    );
  }

return (
    <div className="min-h-screen flex items-center justify-center bg-customWhite py-20"> 
      <div className="bg-customGray p-12 rounded-lg shadow-lg max-w-lg w-full border-3 border-brightYellow"> 
        <h2 className="text-3xl font-bold text-center text-customWhite mt-6 pb-14 font-higherJump tracking-widest"><span className="l">L</span>ogin</h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="email" className="block mb-2 text-m text-customWhite font-titillium tracking-wide">
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
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-m text-customWhite font-titillium tracking-wide">
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
            />
          </div>

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

          <button
            type="submit"
            className="btn-full-colour w-full"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-logoGray font-titillium">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-brightYellow hover:text-hotPink font-titillium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
