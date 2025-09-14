import { HashLink } from "react-router-hash-link";
import { motion } from "framer-motion";
import { BACKEND_URL } from "../../utils/config";
import DynamicHeading from "../Shared/DynamicHeading";

const placeholderImages = [
  `${BACKEND_URL}/images/LMW_fitness_1.jpg`,
  `${BACKEND_URL}/images/LMW_fitness_5.jpg`,
  `${BACKEND_URL}/images/LMW_fitness_2.jpg`,
  `${BACKEND_URL}/images/LMW_fitness_4.jpg`,
  `${BACKEND_URL}/images/LMW_fitness_Hero_Image3.jpg`,
  `${BACKEND_URL}/images/LMW_fitness_frog.jpg`,
  `${BACKEND_URL}/images/LMW_fitness_Tattoo.png`,
];

const HeroSection = () => {
  return (
    <section
      id="Home"
      className="min-h-screen flex items-center px-4 md:px-0 bg-gradient-to-br from-customGray to-logoGray"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-6 items-center pt-24">
        {/* Left: Headline, CTA, Newsletter */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="max-w-2xl mx-auto px-0 md:px-8"
        >
          <div className="text-center p-2 md:p-4">
            <DynamicHeading
              text="Get fit on your schedule"
              className="font-higherJump mb-2 text-4xl md:text-5xl font-extrabold leading-loose tracking-wide text-white"
            />
            <HashLink to="/#Pricing" className="btn-primary inline-block md:w-3/4">
              Start Training Today
            </HashLink>
          </div>
        </motion.div>

        {/* Right: Compact 2x2 Image Grid with Varied Borders */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="relative w-full max-w-md mx-auto aspect-square hidden lg:block"
        >
          <div className="grid grid-cols-1 grid-rows-1 gap-5 absolute inset-0 p-2">
            {/* Top left: Large rectangle with L-shaped green border */}
            <div className="relative flex items-end justify-end p-4">
              <img
                src={placeholderImages[0]}
                alt="Fitness"
                className="w-full h-full rounded-2xl object-cover"
              />
              {/* Top Left Border */}
              <div className="absolute left-0 bottom-0 w-1 h-2/3 md:right-7 bg-limeGreen rounded-t-lg"></div>
              {/* Top right border */}
              <div className="absolute top-10 right-1.5 w-3/4 h-1 bg-brightYellow rounded-bl-lg"></div>
              <div className="absolute top-10 right-1.5 h-1/3 w-1 bg-brightYellow rounded-bl-lg"></div>
              {/* Bottom left border */}
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
