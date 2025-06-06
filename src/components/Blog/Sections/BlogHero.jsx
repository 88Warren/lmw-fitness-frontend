import { motion } from "framer-motion";

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

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        delay: 0.2, 
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
    <section className="py-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1
            variants={textVariants}
            className="font-higherJump text-black/80 mb-6 text-4xl font-extrabold leading-loose tracking-wide"
          >
            <span className="l">L</span><span className="m">M</span><span className="w">W</span> Fitness B<span className="l">l</span>og
          </motion.h1>
          
          <motion.p
            variants={textVariants}
            className="font-titillium text-neutral-200 text-m max-w-2xl mx-auto leading-relaxed"
          >
            Unlock your potential and "Live More With" our insights on fitness, movement and well-being.
          </motion.p>

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
