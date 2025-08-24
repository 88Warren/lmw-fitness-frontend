import { HashLink } from "react-router-hash-link";
import { motion } from "framer-motion";
import DynamicHeading from "../Shared/DynamicHeading";

const About = () => {
  return (
    <section id="About" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <DynamicHeading
            text="Welcome to LMW Fitness"
            className="text-4xl md:text-5xl font-higherJump text-black mb-8 leading-loose"
          />
          <p className="text-lg text-customGray max-w-3xl mx-auto mb-8">
            Hi, I&apos;m Laura, and I&apos;m passionate about helping you achieve your
            health and fitness goals. Whether you want to feel stronger, move
            better or regain confidence, 
            <br />
            I&apos;m here to support you every step of
            the way.
            <br />
            I&apos;m really excited that you&apos;re visiting my site, as I have loads of
            ways to help you get fit!
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
            My Mission
          </h3>
          <p className="text-lg text-customGray leading-relaxed">
            My motto is:
            <span className="font-bold text-limeGreen text-justify">
              {" "}
              &lsquo;If not now, then when?&rsquo;{" "}
            </span>
            & I believe fitness should be accessible to everyone, however busy
            life gets.
            <br className="hidden md:block" />
            I want to help you achieve a new, fitter, healthier way of life. With structured programs and
            expert coaching, I can support you into developing sustainable
            habits that fit into your lifestyle.
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
              Expertise & Experience
            </h4>
            <p className="text-lg text-customGray text-justify leading-relaxed mb-4">
              As a qualified personal trainer and an ex-British Army physical
              training instructor, I have years of hands-on coaching
              experience and I know what works.</p>
              <br className="hidden md:block" />
             <p className="text-lg text-customGray text-justify leading-relaxed"> 
              I&apos;ve tested countless fitness methods and created proven, time-efficient programs to
              deliver real results. And of course, I have the relevant
              certificates and qualifications to back this up.
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
              Flexible & Accessible
            </h4>
            <p className="text-lg text-customGray text-justify leading-relaxed">
              My 30-Day Fat Loss Program is designed for people with busy
              lifestyles. Work out at home or in the gym – you just need
              commitment and a positive mindset! I offer quality, effective
              fat loss programmes for beginners and the more advanced. They
              are available online and you will be sent a daily video, every
              day, for 30 days, to enable you to exercise wherever you choose.
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
            Start Your Journey Today!
          </h3>
          <p className="text-lg mb-8 text-center">
            If you want to be challenged, lose weight & tone up in a tailored & 
            focused session, LMW Fitness is for you.
            <br className="hidden md:block" />
            Join others who have transformed their health with LMW
            Fitness & take the first step towards a fitter, stronger you.
          </p>
          <div className="text-center">
            <HashLink 
              to="/#Pricing"
              className="btn-primary px-6 md:px-8 py-3 text-lg border border-customGray/30"
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
