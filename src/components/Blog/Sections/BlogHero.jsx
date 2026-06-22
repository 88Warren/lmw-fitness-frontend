import { motion } from "framer-motion";
import PropTypes from 'prop-types';

const BlogHero = ({ isAdmin, handleCreateNewBlogClick }) => {
  return (
    <section className="pt-8 pb-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <span className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full bg-limeGreen text-black text-sm font-titillium font-bold tracking-widest uppercase shadow-lg shadow-limeGreen/40">
          <span>📝</span> The Blog
        </span>

        <h1 className="font-titillium text-customGray mb-4 text-4xl md:text-5xl font-extrabold leading-tight tracking-wide">
          LMW Fitness Blog
        </h1>
        <p className="text-lg text-customGray/60 font-titillium max-w-xl mx-auto">
          Tips, workouts, nutrition and mindset — everything you need to stay on track.
        </p>

        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6"
          >
            <button
              onClick={handleCreateNewBlogClick}
              className="btn-primary mt-0 inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Create New Post
            </button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default BlogHero;

BlogHero.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  handleCreateNewBlogClick: PropTypes.func.isRequired,
};
