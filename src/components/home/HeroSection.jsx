import { HashLink } from "react-router-hash-link";
import { motion } from "framer-motion";
import { BACKEND_URL } from "../../utils/config";

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
      className="min-h-screen flex items-center px-4 md:px-0 bg-white"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-6 items-center pt-24 pb-12">
        {/* Left: Headline, sub-text, CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto px-0 md:px-8"
        >
          <div className="text-center p-2 md:p-4">
            {/* Eyebrow label */}
            <span className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full bg-hotPink text-white text-sm font-titillium font-bold tracking-widest uppercase shadow-lg shadow-hotPink/30">
              <span>🏋️</span> Online Personal Training
            </span>

            <h2 className="font-titillium mb-4 text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-wide text-customGray">
              Get fit on your schedule
            </h2>

            <p className="text-lg text-customGray/70 font-titillium mb-8 max-w-md mx-auto leading-relaxed">
              Proven 30-day programmes for busy women. Work out at home on your terms.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <HashLink to="/#Pricing" className="btn-primary mt-0 inline-block sm:w-auto px-8 py-3 text-base">
                Start Training Today
              </HashLink>
              <HashLink
                to="/#About"
                className="inline-block px-8 py-3 text-base font-titillium font-semibold text-customGray border-2 border-customGray/20 rounded-lg hover:border-brightYellow transition-colors duration-300"
              >
                Learn More
              </HashLink>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              <div className="flex items-center gap-2 text-sm text-customGray/60 font-titillium">
                <span className="text-limeGreen font-bold text-base">✔</span> Certified PT
              </div>
              <div className="flex items-center gap-2 text-sm text-customGray/60 font-titillium">
                <span className="text-limeGreen font-bold text-base">✔</span> Ex-Army PTI
              </div>
              <div className="flex items-center gap-2 text-sm text-customGray/60 font-titillium">
                <span className="text-limeGreen font-bold text-base">✔</span> 30-Day Programmes
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Hero image with accent borders */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative w-full max-w-md mx-auto aspect-square hidden lg:block"
        >
          <div className="absolute inset-0 p-2">
            <div className="relative w-full h-full">
              <img
                src={placeholderImages[0]}
                alt="LMW Fitness personal training"
                className="w-full h-full rounded-3xl object-cover shadow-2xl"
              />
              {/* Accent corner — top right yellow */}
              <div className="absolute -top-3 -right-3 w-16 h-16 rounded-tr-3xl border-t-4 border-r-4 border-brightYellow"></div>
              {/* Accent corner — bottom left green */}
              <div className="absolute -bottom-3 -left-3 w-16 h-16 rounded-bl-3xl border-b-4 border-l-4 border-limeGreen"></div>
              {/* Floating badge */}
              <div className="absolute -bottom-5 right-6 bg-white rounded-2xl shadow-xl px-5 py-3 flex items-center gap-3 border border-gray-100">
                <span className="text-2xl">💪</span>
                <div>
                  <p className="text-xs text-customGray/50 font-titillium">Programme length</p>
                  <p className="text-sm font-bold text-customGray font-titillium">30 Days</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
