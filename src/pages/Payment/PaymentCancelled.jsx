import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DynamicHeading from '../../components/Shared/DynamicHeading';

const PaymentCancelled = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="flex flex-col items-center justify-center min-h-screen bg-customGray/30 p-6"
    >
      <div className="bg-customGray p-8 rounded-lg text-center max-w-lg w-full border-brightYellow border-2">
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
        <DynamicHeading
          text="Payment Cancelled"
          className="font-higherJump text-3xl md:text-4xl font-bold text-customWhite mb-8 leading-loose tracking-widest"
        />
        <p className="text-lg text-customWhite mb-6">
          Your payment was cancelled. <br/>
          You can try again or return to the home page.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4"> 
          <Link
            to="/cart" 
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