import { HashLink } from "react-router-hash-link";
import { motion } from "framer-motion";

const About = () => {
  return (
    <section id="About" className="py-24 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full bg-brightYellow text-black text-sm font-titillium font-bold tracking-widest uppercase shadow-lg shadow-brightYellow/40">
            <span>💪</span> About Me
          </span>
          {/* <h2 className="text-4xl md:text-5xl font-titillium text-customGray mb-8 leading-tight">
            About Your Online Personal Trainer
          </h2> */}
          <p className="text-lg text-customGray/70 max-w-3xl mx-auto leading-relaxed font-titillium">
            Hi, I&apos;m Laura, your dedicated <strong className="text-customGray font-semibold">online personal trainer UK</strong> and certified <strong className="text-customGray font-semibold">fitness coach</strong>. I&apos;m passionate about helping busy women achieve their
            health and fitness goals through personalised <strong className="text-customGray font-semibold">home workouts</strong> and online fitness coaching.
          </p>
          <p className="text-lg text-customGray/70 max-w-3xl mx-auto leading-relaxed font-titillium mt-4">
            Whether you want to feel stronger, lose weight or regain confidence — I&apos;m here to support you every step of the way.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative p-8 md:p-12 bg-white rounded-2xl shadow-sm border border-gray-100 mb-16 overflow-hidden"
        >
          {/* Decorative accent */}
          <div className="absolute top-0 left-0 w-1.5 h-full bg-linear-to-b from-limeGreen via-brightYellow to-hotPink rounded-l-2xl"></div>
          <h3 className="text-2xl md:text-3xl font-bold text-customGray mb-4 text-center font-titillium">
            My Mission as Your Online Fitness Coach
          </h3>
          <p className="text-lg text-customGray/70 leading-relaxed text-center font-titillium">
            My motto is:{" "}
            <span className="font-bold text-limeGreen">
              &lsquo;If not now, then when?&rsquo;
            </span>{" "}
            I believe <strong className="text-customGray font-semibold">fitness</strong> should be accessible to everyone, however busy life gets.
            With structured <strong className="text-customGray font-semibold">home workout programs</strong> and expert <strong className="text-customGray font-semibold">online fitness coaching</strong>, I can help you build sustainable habits that fit your lifestyle.
          </p>
        </motion.div>

        {/* Why Choose Me — feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-5">
              <span className="text-2xl">🏅</span>
            </div>
            <h4 className="text-xl font-bold text-customGray mb-3 font-titillium">
              Certified Personal Trainer & Fitness Expert
            </h4>
            <p className="text-base text-customGray/70 leading-relaxed font-titillium">
              As a qualified <strong className="text-customGray font-semibold">personal trainer UK</strong> certified and an ex-British Army physical training instructor, I have years of hands-on experience and know what works for busy women.
              I&apos;ve tested countless <strong className="text-customGray font-semibold">fitness</strong> methods and created proven, time-efficient programmes to deliver real results.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center mb-5">
              <span className="text-2xl">🏠</span>
            </div>
            <h4 className="text-xl font-bold text-customGray mb-3 font-titillium">
              Online Personal Training That Fits Your Lifestyle
            </h4>
            <p className="text-base text-customGray/70 leading-relaxed font-titillium">
              My 30-day <strong className="text-customGray font-semibold">online fitness programs</strong> are designed for people with busy lifestyles. Work out at home — you just need commitment and a positive mindset. Available 24/7 with daily guidance, making fitness truly accessible.
            </p>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="relative bg-customGray rounded-2xl p-10 md:p-14 text-center overflow-hidden"
        >
          {/* Subtle colour accents */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-hotPink/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-limeGreen/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none"></div>

          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white font-titillium relative z-10">
            Start Your Online Personal Training Journey Today
          </h3>
          <p className="text-base md:text-lg mb-8 text-white/70 max-w-2xl mx-auto font-titillium relative z-10">
            Join other busy women who have transformed their health with proven <strong className="text-white font-semibold">online personal training</strong> programmes. Take the first step towards a fitter, stronger you.
          </p>
          <div className="relative z-10">
            <HashLink 
              to="/#Pricing"
              className="btn-primary inline-block"
            >
              Get Started Today
            </HashLink>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
