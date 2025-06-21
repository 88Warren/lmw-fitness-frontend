import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PaymentCancelled = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white via-white to-hotPink p-6"
    >
      <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-lg w-full">
        <svg
          className="w-24 h-24 text-hotPink mx-auto mb-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Payment Cancelled</h2>
        <p className="text-lg text-gray-600 mb-6">
          Your payment was not completed. You can try again or return to the home page.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4"> 
          <Link
            to="/#Pricing" 
            className="btn-full-colour inline-block px-8 py-3 rounded-md text-lg transition duration-300 ease-in-out"
          >
            Try Again
          </Link>
          <Link
            to="/"
            className="btn-primary inline-block px-8 py-3 rounded-md text-lg transition duration-300 ease-in-out"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentCancelled;