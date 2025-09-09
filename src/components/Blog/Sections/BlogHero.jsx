import { motion } from "framer-motion";
import PropTypes from 'prop-types';
import DynamicHeading from "../../Shared/DynamicHeading";

const BlogHero = ({ isAdmin, handleCreateNewBlogClick }) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: "easeOut" 
      } 
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        duration: 0.5, 
        delay: 0.4, 
        ease: "easeOut" 
      } 
    },
  };

  return (
    <section>
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <DynamicHeading
            text="LMW Fitness blog"
            className="font-higherJump text-customWhite mb-6 text-4xl font-extrabold leading-loose tracking-wide"
          />

          {isAdmin && (
            <motion.div variants={buttonVariants}>
              <button
                onClick={handleCreateNewBlogClick}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Create New Post</span>
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default BlogHero;

BlogHero.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  handleCreateNewBlogClick: PropTypes.func.isRequired,
};