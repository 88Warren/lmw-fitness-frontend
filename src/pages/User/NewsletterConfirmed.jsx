import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NewsletterConfirmed = () => {
  useEffect(() => {
    console.log("Newsletter confirmation page loaded.");
    window.scrollTo(0, 0); 
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center py-20 bg-gradient-to-b from-white via-customGray/20 to-customGray/70">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-lg bg-customGray p-8 md:p-12 rounded-2xl border-brightYellow border-2 shadow-lg text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-customWhite mb-8 font-higherJump leading-loose tracking-widest">
          Subscription Confirmed!
        </h2>
        <p className="text-lg text-logoGray font-titillium mb-6">
          Thank you for confirming your subscription to the LMW Fitness newsletter.
          You're all set to receive our latest tips and updates!
        </p>
        <Link
          to="/"
          className="btn-full-colour inline-block mt-4"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NewsletterConfirmed;