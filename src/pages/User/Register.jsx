import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth'; 

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { register, isLoggedIn } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/'); 
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
        navigate('/profile'); 
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
    <div className="min-h-screen flex items-center justify-center bg-customWhite py-20"> 
      <div className="bg-customGray p-10 rounded-lg shadow-lg max-w-lg w-full border-3 border-brightYellow"> 
        <h2 className="text-3xl font-bold text-center text-customWhite mt-6 pb-14 font-higherJump tracking-widest">Register</h2>
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
              className="mt-1 block w-full px-4 py-3 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-50 focus:border-gray-50 sm:text-m font-titillium"
              placeholder="ifnotnowthenwhen@myself.co.uk"
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
              className="mt-1 block w-full px-4 py-3 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-50 focus:border-gray-50 sm:text-m font-titillium"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block mb-2 text-m text-customWhite font-titillium tracking-wide">
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
            Register
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-logoGray font-titillium">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brightYellow hover:text-hotPink font-titillium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
