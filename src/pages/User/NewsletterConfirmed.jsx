import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NewsletterConfirmed = () => {
  useEffect(() => {
    console.log("Newsletter confirmation page loaded.");
    window.scrollTo(0, 0); 
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-20 px-4 sm:px-6 md:px-8 bg-gradient-to-b from-customGray/30 to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-lg bg-customGray p-8 md:p-12 rounded-2xl border-brightYellow border-2 shadow-lg text-center"
      >
        <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-center text-customWhite mb-8 font-higherJump leading-loose tracking-widest">
          Subscription Confir<span className="m">m</span>ed
        </h2>
        <p className="text-md md:text-lg text-customWhite font-titillium mb-4 md:mb-6">
          Thank you for confirming your subscription to the LMW Fitness newsletter.
          You're all set to receive our latest tips and updates.
        </p>
        <Link
          to="/"
          className="btn-full-colour w-full inline-block mt-4"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NewsletterConfirmed;