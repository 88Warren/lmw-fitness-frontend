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
      className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-customGray/30 to-white"
    >
      <div className="bg-customGray p-8 rounded-lg text-center max-w-lg w-full border-brightYellow border-2">
        <h2 className="font-higherJump text-3xl md:text-4xl font-bold text-customWhite mb-8 leading-loose tracking-widest">
          Pay<span className="m">m</span>ent Successfu<span className="l">l</span>
        </h2>
        <p className="text-lg text-customWhite mb-6">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        {sessionId && (
          <p className="text-sm text-gray-500 mb-6">
            Order Reference: <span className="font-semibold">{sessionId}</span>
          </p>
        )}
        <Link
          to="/"
          className="btn-full-colour w-full inline-block px-8 py-3 rounded-md transition duration-300 ease-in-out"
        >
          Back to Home
        </Link>
      </div>
    </motion.div>
  );
};

export default PaymentSuccess;