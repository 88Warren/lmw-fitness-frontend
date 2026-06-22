import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import api from '../../utils/api';
import { BACKEND_URL } from '../../utils/config';
import { showToast } from '../../utils/toastUtil';
import DynamicHeading from '../../components/Shared/DynamicHeading';
import useAnalytics from '../../hooks/useAnalytics';
import { FiCheckCircle, FiExternalLink, FiMail } from 'react-icons/fi';

const PaymentSuccess = () => {
  const location = useLocation();
  const sessionId = new URLSearchParams(location.search).get('session_id');
  const { clearCart } = useCart();
  const [authLink, setAuthLink] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [purchasedProductNames, setPurchasedProductNames] = useState([]);
  const { trackPaymentSuccess } = useAnalytics();

  useEffect(() => {
    if (!sessionId) {
      console.error('No session ID found in URL');
      setErrorMessage('No session ID found. This may not be a valid payment success page.');
      setIsLoading(false);
      return;
    }

    clearCart();

    const fetchAuthLink = async (retryCount = 0) => {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const response = await api.post(`${BACKEND_URL}/api/get-workout-link`, { sessionId });

        if (response.status === 202) {
          if (retryCount < 5) {
            showToast('info', response.data.message || 'Your workout link is being prepared...');
            setTimeout(() => fetchAuthLink(retryCount + 1), 3000);
          } else {
            setErrorMessage('Workout link is still being prepared. Please check your email.');
            showToast('info', 'Your workout link will be sent to your email shortly.');
            setIsLoading(false);
          }
          return;
        }

        const { workoutLink, productNames } = response.data;
        if (workoutLink) {
          setAuthLink(workoutLink);
          if (productNames && Array.isArray(productNames)) {
            setPurchasedProductNames(productNames);
            productNames.forEach(productName => {
              const planType = productName.includes('beginner') ? 'Beginner Programme'
                : productName.includes('advanced') ? 'Advanced Programme'
                : 'Fitness Programme';
              trackPaymentSuccess(planType, 0, sessionId);
            });
          }
          showToast('success', 'Your secure workout link is ready!');
        } else {
          throw new Error('Invalid workout link received from server');
        }
      } catch (error) {
        console.error('Failed to get workout link:', error);
        if (error.response) {
          if (error.response.status === 404) {
            showToast('error', 'Workout link not ready yet. Please check your email in a few minutes.');
          } else if (error.response.status === 202) {
            if (retryCount < 5) {
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
          showToast('error', 'An unexpected error occurred. Please check your email.');
        }
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthLink();
  }, [sessionId, clearCart]);

  const getAccessMessage = () => {
    const hasBeginner = purchasedProductNames.includes('beginner-programme');
    const hasAdvanced = purchasedProductNames.includes('advanced-programme');
    if (hasBeginner && hasAdvanced) return 'Access your Beginner and Advanced Programme and create your profile';
    if (hasBeginner) return 'Access your Beginner Programme and create your profile';
    if (hasAdvanced) return 'Access your Advanced Programme and create your profile';
    return 'Access your workout and create your profile';
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-white via-pink-50 to-yellow-50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        {/* Success icon + heading */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-limeGreen/15 flex items-center justify-center mx-auto mb-5"
          >
            <FiCheckCircle className="w-10 h-10 text-limeGreen" />
          </motion.div>
          <DynamicHeading
            text="Payment Successful"
            className="font-titillium font-bold text-3xl md:text-4xl text-customGray tracking-wide"
          />
          <p className="text-customGray/60 font-titillium mt-2">
            Thank you! Your order has been placed successfully.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-8">

          {/* Loading state */}
          {isLoading && (
            <div className="text-center py-4">
              <div className="flex justify-center mb-4">
                <div className="w-10 h-10 rounded-full border-2 border-gray-100 border-t-hotPink animate-spin" />
              </div>
              <p className="font-semibold text-customGray font-titillium mb-2">
                Setting up your workout access&hellip;
              </p>
              <p className="text-sm text-customGray/50 font-titillium">
                This may take a few moments while we prepare your materials.
              </p>
            </div>
          )}

          {/* Error / email fallback state */}
          {!isLoading && errorMessage && (
            <div className="text-center py-2">
              <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center mx-auto mb-4">
                <FiMail className="w-6 h-6 text-brightYellow" />
              </div>
              <p className="font-semibold text-customGray font-titillium mb-2">
                {errorMessage.includes('being prepared')
                  ? 'Your link is on its way'
                  : 'Check your inbox'}
              </p>
              <p className="text-sm text-customGray/60 font-titillium leading-relaxed">
                {errorMessage.includes('being prepared')
                  ? "This is normal for new purchases. Your workout link will arrive in your email within a few minutes."
                  : "We couldn't generate your link right now. Please check your email or contact support."}
              </p>
              <Link
                to="/"
                className="btn-primary inline-block mt-6 no-underline"
              >
                Back to Home
              </Link>
            </div>
          )}

          {/* Access link ready */}
          {!isLoading && !errorMessage && authLink && (
            <div className="text-center py-2">
              <div className="inline-flex items-center gap-2 bg-limeGreen/10 border border-limeGreen/30 text-customGray text-sm font-titillium font-semibold px-4 py-2 rounded-full mb-6">
                <span className="w-2 h-2 rounded-full bg-limeGreen animate-pulse" />
                Your programme is ready
              </div>
              <p className="text-customGray/70 font-titillium text-sm leading-relaxed mb-6">
                {getAccessMessage()}
              </p>
              <a
                href={authLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-full-colour inline-flex items-center gap-2 no-underline"
              >
                <FiExternalLink className="w-4 h-4" />
                Access Your Workout
              </a>
            </div>
          )}

          {/* Processing — no link yet, no error */}
          {!isLoading && !errorMessage && !authLink && (
            <div className="text-center py-2">
              <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center mx-auto mb-4">
                <FiMail className="w-6 h-6 text-brightYellow" />
              </div>
              <p className="font-semibold text-customGray font-titillium mb-2">
                Payment processed!
              </p>
              <p className="text-sm text-customGray/60 font-titillium leading-relaxed">
                We&apos;re setting up your access now. You&apos;ll receive a secure link by email shortly.
              </p>
              <Link to="/" className="btn-primary inline-block mt-6 no-underline">
                Back to Home
              </Link>
            </div>
          )}
        </div>

        {/* Support note */}
        <p className="text-center text-xs text-customGray/40 font-titillium mt-5">
          Questions? Get in touch via the{' '}
          <Link to="/#Contact" className="text-hotPink hover:text-limeGreen transition-colors duration-200 underline">
            contact form
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
