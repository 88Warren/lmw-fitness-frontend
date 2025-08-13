import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import axios from 'axios';
import { BACKEND_URL } from '../../utils/config';
import { showToast } from '../../utils/toastUtil';

const PaymentSuccess = () => {
  const location = useLocation();
  const sessionId = new URLSearchParams(location.search).get('session_id');
  const { clearCart } = useCart(); 
  const [authLink, setAuthLink] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!sessionId) {
      console.error('No session ID found in URL');
      setErrorMessage('No session ID found. This may not be a valid payment success page.');
      setIsLoading(false);
      return;
    }

    console.log('Payment successful! Session ID:', sessionId);
    clearCart();

const fetchAuthLink = async (retryCount = 0) => {
  try {
    setIsLoading(true);
    setErrorMessage('');

    const response = await axios.post(`${BACKEND_URL}/api/get-workout-link`, { sessionId });
    
    // Check if the response is a 202 status and handle it as a processing state
    if (response.status === 202) {
      if (retryCount < 5) { // Increased retry count for robustness
        console.log(`Workout link still being prepared, retrying in 3 seconds... (Attempt ${retryCount + 1})`);
        showToast('info', response.data.message || 'Your workout link is being prepared...');
        setTimeout(() => fetchAuthLink(retryCount + 1), 3000);
      } else {
        setErrorMessage('Workout link is still being prepared. Please check your email.');
        showToast('info', 'Your workout link will be sent to your email shortly.');
        setIsLoading(false);
      }
      return; 
    }

    const { workoutLink } = response.data;
    if (workoutLink) {
      setAuthLink(workoutLink);
      showToast('success', 'Your secure workout link is ready!');
    } else {
      // This is a safety net for an unexpected response
      throw new Error('Invalid workout link received from server');
    }
  } catch (error) {
    console.error('Failed to get workout link:', error);
    
    // Handle specific server errors
    if (error.response) {
      if (error.response.status === 404) {
        showToast('error', 'Workout link not ready yet. Please check your email in a few minutes.');
      } else if (error.response.status === 202) {
        // Handle 202 status from catch block (in case axios doesn't catch it)
        if (retryCount < 5) {
          console.log(`Workout link still being prepared, retrying in 3 seconds... (Attempt ${retryCount + 1})`);
          showToast('info', error.response.data.message || 'Your workout link is being prepared...');
          setTimeout(() => fetchAuthLink(retryCount + 1), 3000);
          return;
        } else {
          setErrorMessage('Workout link is still being prepared. Please check your email.');
          showToast('info', 'Your workout link will be sent to your email shortly.');
        }
      } else {
        showToast('error', 'Failed to retrieve your workout link. Please check your email or contact support.');
      }
    } else {
      // Handle network or other errors
      showToast('error', 'An unexpected error occurred. Please check your email.');
    }
    setErrorMessage(error.message);
  } finally {
    setIsLoading(false);
  }
};

    fetchAuthLink();
  }, [sessionId, clearCart]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-customGray/30 to-white"
    >
      <div className="bg-customGray p-8 rounded-lg text-center max-w-lg w-full border-brightYellow border-2">
        <h2 className="font-higherJump text-3xl md:text-4xl font-bold text-customWhite mb-8 leading-loose tracking-widest">
          Pay<span className="m">m</span>ent Successfu<span className="l">l</span>
        </h2>
        <p className="text-lg text-customWhite mb-6">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        
        {isLoading ? (
          <div className="mb-6">
            <p className="text-customWhite mb-4">Setting up your workout access...</p>
            <p className="text-sm text-customWhite mb-4">This may take a few moments as we create your account and prepare your workout materials.</p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brightYellow"></div>
            </div>
          </div>
        ) : errorMessage ? (
          <div className="mb-6">
            <p className="text-red-400 mb-4">
              {errorMessage.includes('being prepared') 
                ? 'Your workout link is being prepared.'
                : 'There was an issue generating your workout link.'}
            </p>
            <p className="text-sm text-customWhite mb-4">
              {errorMessage.includes('being prepared')
                ? 'This is normal for new purchases. Please check your email in a few minutes.'
                : `Error: ${errorMessage}`}
            </p>
            <p className="text-customWhite">
              Please check your email for a link to your workout, or contact support if you need assistance.
            </p>
          </div>
        ) : authLink ? (
          <div className="mb-6">
            <p className="text-lg text-customWhite mb-4">Click below to access your workout:</p>
            <a
              href={authLink}
              className="btn-full-colour inline-block px-8 py-3 rounded-md transition duration-300 ease-in-out"
              target="_blank"
              rel="noopener noreferrer"
            >
              Access Your Workout
            </a>
          </div>
        ) : (
          <div className="mb-6">
            <p className="text-customWhite mb-4">
              Your payment has been processed successfully!
            </p>
            <p className="text-sm text-customWhite">
              We&apos;re setting up your workout access. You&apos;ll receive an email with your secure workout link shortly.
            </p>
          </div>
        )}
        
        <Link
          to="/"
          className="btn-full-colour w-full inline-block px-8 py-3 rounded-md transition duration-300 ease-in-out mt-4"
        >
          Back to Home
        </Link>
      </div>
    </motion.div>
  );
};

export default PaymentSuccess;