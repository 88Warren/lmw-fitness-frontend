import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiXCircle, FiShoppingCart, FiHome } from 'react-icons/fi';

const PaymentCancelled = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-white via-pink-50 to-yellow-50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        {/* Icon + heading */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-hotPink/10 flex items-center justify-center mx-auto mb-5"
          >
            <FiXCircle className="w-10 h-10 text-hotPink" />
          </motion.div>
          <h1 className="font-titillium font-bold text-3xl md:text-4xl text-customGray tracking-wide">
            Payment Cancelled
          </h1>
          <p className="text-customGray/60 font-titillium mt-2">
            No worries — nothing has been charged.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-8 text-center">
          <p className="text-customGray/70 font-titillium text-sm leading-relaxed mb-8">
            Your payment was cancelled. Your basket is still saved — you can head back and try again whenever you&apos;re ready.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/cart"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-limeGreen via-brightYellow to-hotPink text-black font-bold font-titillium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-hotPink/20 no-underline"
            >
              <FiShoppingCart className="w-4 h-4" />
              Back to Basket
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-customGray font-bold font-titillium rounded-xl hover:border-brightYellow transition-colors duration-200 no-underline"
            >
              <FiHome className="w-4 h-4" />
              Return to Home
            </Link>
          </div>
        </div>

        {/* Support note */}
        <p className="text-center text-xs text-customGray/40 font-titillium mt-5">
          Having trouble?{' '}
          <Link to="/#Contact" className="text-hotPink hover:text-limeGreen transition-colors duration-200 underline">
            Contact us
          </Link>{' '}
          and we&apos;ll help sort it out.
        </p>
      </motion.div>
    </div>
  );
};

export default PaymentCancelled;
