import { HashLink } from "react-router-hash-link";
import { motion } from "framer-motion";
import { BACKEND_URL } from "../../utils/config";

const placeholderImages = [
  `${BACKEND_URL}/images/LMW_fitness_1.jpg`,
  `${BACKEND_URL}/images/LMW_fitness_5.jpg`,
  `${BACKEND_URL}/images/LMW_fitness_2.jpg`,
  `${BACKEND_URL}/images/LMW_fitness_4.jpg`,
  `${BACKEND_URL}/images/LMW_fitness_Hero_Image3.jpg`,
  `${BACKEND_URL}/images/LMW_fitness_frog.jpg`
];

const HeroSection = () => {
  return (
    <section
      id="Home"
      className="min-h-screen flex items-center px-4 md:px-0 bg-gradient-to-br from-white via-customGray/80 to-customGray"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-6 items-center py-16">
        {/* Left: Headline, CTA, Newsletter */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="max-w-2xl mx-auto px-0 md:px-8"
        >
          <div className="text-center p-2 md:p-4">
            <h1 className="font-higherJump text-black/70 mb-10 text-4xl md:text-5xl font-extrabold leading-loose tracking-wide">
              Get <span className="text-brightYellow">Fit</span> On Your Schedu<span className="l">l</span>e
            </h1>
            <p className="font-titillium text-logoGray font-bold text-lg md:text-xl mt-4 tracking-wide leading-relaxed">
              Tailored online personal training designed for you
            </p>
            <HashLink to="/#Contact" className="btn-primary mt-6 inline-block md:w-3/4 md:mt-10">
              Start Training Today
            </HashLink>
          </div>
        </motion.div>

        {/* Right: Compact 2x2 Image Grid with Varied Borders */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="relative w-full max-w-md mx-auto aspect-square"
        >
          <div className="grid grid-cols-2 grid-rows-2 gap-5 absolute inset-0 p-2">
            {/* Top left: Large rectangle with L-shaped green border */}
            <div className="relative flex items-end justify-end p-4">
              <img
                src={placeholderImages[5]}
                alt="Fitness"
                className="w-36 h-28 md:min-w-56 md:h-40 rounded-2xl object-cover"
              />
              {/* Border - Left */}
              <div className="absolute left-0 bottom-0 w-1 h-2/3 md:right-7 bg-limeGreen rounded-t-lg"></div>
            </div>

            {/* Top right: Small rectangle with yellow top+right border (touching) */}
            <div className="relative flex items-end justify-start">
              <img
                src={placeholderImages[0]}
                alt="Fitness"
                className="w-32 h-24 md:w-40 md:h-32 rounded-2xl object-center"
              />
              {/* Top border */}
              <div className="absolute top-10 right-1.5 w-3/4 h-1 bg-brightYellow rounded-bl-lg"></div>
              {/* Right border - connected to top border */}
              <div className="absolute top-10 right-1.5 h-1/3 w-1 bg-brightYellow rounded-bl-lg"></div>
            </div>

            {/* Bottom left: Circle with pink L-shaped corner */}
            <div className="relative flex items-start justify-end p-2.5">
              <img
                src={placeholderImages[2]}
                alt="Fitness"
                className="w-24 h-24 md:w-34 md:h-34 rounded-full object-center"
              />
            </div>

            {/* Bottom right: No border */}
            <div className="flex items-start justify-start p-5">
              <img
                src={placeholderImages[4]}
                alt="Fitness"
                className="w-32 h-28 md:w-44 md:h-40 rounded-2xl object-center"
              />
              <div className="absolute bottom-6 right-5 w-6 h-1 bg-hotPink rounded-r-lg"></div>
              <div className="absolute bottom-6 right-5 w-1 h-10 bg-hotPink rounded-t-lg"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
