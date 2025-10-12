import { HashLink } from "react-router-hash-link";
import { motion } from "framer-motion";
import DynamicHeading from "../Shared/DynamicHeading";

const About = () => {
  return (
    <section id="About" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <DynamicHeading
            text="About Your Online Personal Trainer"
            className="text-4xl md:text-5xl font-higherJump text-black/80 mb-8 leading-loose"
          />
          <p className="text-lg text-customGray max-w-5xl mx-auto mb-8">
            Hi, I&apos;m Laura, your dedicated <strong>online personal trainer UK</strong> and certified <strong>fitness coach</strong>. I&apos;m passionate about helping busy women achieve their
            health and fitness goals through personalised <strong>home workouts</strong> and online fitness coaching. 
            <br />
            <br />
            Whether you want to feel stronger, lose weight or regain confidence!
            I&apos;m here to support you every step of
            the way with proven <strong>online personal training</strong> programs.
            <br />
            <br />
            I&apos;m really excited that you&apos;re visiting my site, as I have loads of
            effective ways to help you get fit from the comfort of your own home!
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="p-8 bg-white border border-brightYellow rounded-xl mb-16"
        >
          <h3 className="text-3xl font-bold text-customGray mb-6 text-center">
            My Mission as Your Online Fitness Coach
          </h3>
          <p className="text-lg text-customGray leading-relaxed text-center">
            My motto is:
            <span className="font-bold text-limeGreen text-justify">
              {" "}
              &lsquo;If not now, then when?&rsquo;{" "}
            </span>
            & I believe <strong>fitness</strong> should be accessible to everyone, however busy
            life gets.
            <br className="hidden md:block" />
            As a <strong>personal trainer UK</strong> based, I want to help you achieve a new, fitter, healthier way of life. With structured <strong>home workout programs</strong> and
            expert <strong>online fitness coaching</strong>, I can support you in developing sustainable
            habits that fit perfectly into your busy lifestyle.
          </p>
        </motion.div>

        {/* Why Choose Me? */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="p-8 bg-white border border-brightYellow rounded-xl"
          >
            <h4 className="text-2xl font-bold text-customGray text-center mb-4">
              Certified Personal Trainer & Fitness Expert
            </h4>
            <p className="text-lg text-customGray text-justify leading-relaxed mb-4">
              As a qualified <strong>personal trainer UK</strong> certified and an ex-British Army physical
              training instructor, I have years of hands-on <strong>personal training </strong>
              experience and I know what works for busy women.</p>
              <br className="hidden md:block" />
             <p className="text-lg text-customGray text-justify leading-relaxed"> 
              I&apos;ve tested countless <strong>fitness</strong> methods and created proven, time-efficient <strong>fitness programs</strong> to
              deliver real results. As your dedicated <strong>fitness coach</strong>, I have all the relevant
              certificates and qualifications to guide you safely and effectively.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="p-8 bg-white border border-brightYellow rounded-xl" 
          >
            <h4 className="text-2xl font-bold text-customGray text-center mb-4">
              Online Personal Training That Fits Your Lifestyle
            </h4>
            <p className="text-lg text-customGray text-justify leading-relaxed">
              My 30 day <strong>online fitness programs</strong> are designed for people with busy
              lifestyles. Work out at home with my <strong>home workout plans</strong> – you just need
              commitment and a positive mindset! I offer quality, effective
              <strong> weight loss workout plans</strong> for beginners and the more advanced. My <strong>online personal training </strong>
              programs are available 24/7 and you receive daily guidance to enable you to exercise wherever you choose,
              making fitness truly accessible.
            </p>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-limeGreen via-brightYellow to-hotPink text-white p-12 rounded-2xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl"
        >
          <h3 className="text-3xl font-bold mb-6 text-center">
            Start Your Online Personal Training Journey Today!
          </h3>
          <p className="text-lg mb-8 text-center">
            If you want to be challenged, lose weight & tone up with personalised <strong>home workouts</strong> and 
            expert <strong>online fitness coaching</strong>, LMW Fitness is for you.
            <br className="hidden md:block" />
            Join other busy women who have transformed their health with my proven <strong>online personal training</strong> programs
            & take the first step towards a fitter, stronger you with your dedicated <strong>fitness coach</strong>.
          </p>
          <div className="text-center">
            <HashLink 
              to="/#Pricing"
              className="btn-primary border border-customGray/30"
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
