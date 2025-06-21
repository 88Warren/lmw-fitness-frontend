import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PaymentSuccess = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      console.log('Payment successful! Session ID:', sessionId);
    }
  }, [sessionId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white via-white to-limeGreen p-6"
    >
      <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-lg w-full">
        <svg
          className="w-24 h-24 text-limeGreen mx-auto mb-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Payment Successful!</h2>
        <p className="text-lg text-gray-600 mb-6">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        {sessionId && (
          <p className="text-sm text-gray-500 mb-6">
            Order Reference: <span className="font-semibold">{sessionId}</span>
          </p>
        )}
        <Link
          to="/"
          className="btn-primary inline-block px-8 py-3 rounded-md text-lg transition duration-300 ease-in-out"
        >
          Back to Home
        </Link>
      </div>
    </motion.div>
  );
};

export default PaymentSuccess;