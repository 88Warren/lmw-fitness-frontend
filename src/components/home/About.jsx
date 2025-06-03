import { HashLink } from "react-router-hash-link";

const About = () => {
  return (
    <>
      <section id="About" className="py-16 px-6 bg-gray-100" data-oid="uzqdx-8">
        <div className="max-w-5xl mx-auto text-center" data-oid="3m530f_">
          <h2
            className="text-3xl md:text-4xl font-higherJump text-black mb-8 leading-relaxed md:leading-loose"
            data-oid=":-ufe88"
          >
            <span className="w" data-oid="gdw:vwf">
              W
            </span>
            elco
            <span className="m" data-oid="ay40c_1">
              M
            </span>
            e to <br className="hidden md:block" data-oid="23fglcr"></br>"
            <span className="l" data-oid="6u5opcs">
              L
            </span>
            ive{" "}
            <span className="m" data-oid="9s65vap">
              M
            </span>
            ore{" "}
            <span className="w" data-oid="-nff7do">
              W
            </span>
            ith fitness"!
          </h2>
          <p
            className="text-lg text-customGray max-w-3xl mx-auto mb-8"
            data-oid="dxm0wyu"
          >
            Hi, I’m Laura, and I’m passionate about helping you achieve your
            health and fitness goals. Whether you want to feel stronger, move
            better or regain confidence, I’m here to support you every step of
            the way.<br data-oid="o4h_jgr"></br>
            I'm really excited that you're visiting my site, as I have loads of
            ways to help you get fit!
          </p>

          {/* Images Section */}
          <div
            className="grid grid-col-1 md:grid-cols-2 gap-6 mb-12"
            data-oid="k9gklb."
          >
            {/* <img src={fitnessImage} alt="Fitness Training" className="rounded-lg shadow-lg w-full" />
              <img src={coachImage} alt="Personal Coaching" className="rounded-lg shadow-lg w-full" /> */}
          </div>

          {/* Mission Statement */}
          <div
            className="bg-white p-6 rounded-lg shadow-md mb-12"
            data-oid="jyip5sq"
          >
            <h3
              className="text-2xl md:text-3xl font-bold text-black mb-4"
              data-oid="_pqm2l0"
            >
              My Mission
            </h3>
            <p className="text-lg text-customGray" data-oid="17w-gq1">
              My motto is:
              <span className="font-bold text-limeGreen" data-oid="73-6dn:">
                {" "}
                'If not now, then when?'{" "}
              </span>
              & I believe fitness should be accessible to everyone, however busy
              life gets.
              <br className="hidden md:block" data-oid="gbwc2_w"></br>I want to
              help you achieve a new, fitter, healthier way of life. With
              structured programs and expert coaching, I can support you into
              developing sustainable habits that fit into your lifestyle.
            </p>
          </div>

          {/* Why Choose Me? */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
            data-oid="cz86g32"
          >
            <div
              className="bg-white p-6 rounded-lg shadow-md"
              data-oid="5hau1v4"
            >
              <h4
                className="text-xl md:text-2xl font-bold text-black mb-4"
                data-oid="ojt6j9w"
              >
                Expertise & Experience
              </h4>
              <p className="text-lg text-customGray" data-oid="pt5gkcl">
                As a qualified personal trainer and an ex-British Army physical
                training instructor, I have years of hands-on coaching
                experience and I know what works.
                <br className="hidden md:block" data-oid="9_bi2_e"></br>I’ve
                tested countless fitness methods and created proven,
                time-efficient programs to deliver real results. And of course,
                I have the relevant certificates and qualifications to back this
                up.
              </p>
            </div>
            <div
              className="bg-white p-6 rounded-lg shadow-md"
              data-oid="i_of-.j"
            >
              <h4
                className="text-xl md:text-2xl font-bold text-black mb-4"
                data-oid="sp9xg:7"
              >
                Flexible & Accessible
              </h4>
              <p className="text-lg text-customGray" data-oid="-54ewuy">
                My 30-Day Fat Loss Program is designed for people with busy
                lifestyles. Can do at home or in the gym – you just need
                commitment and a positive mindset! I offer quality, effective
                fat loss programmes for beginners and the more advanced. They
                are available online and you will be sent a daily video, every
                day, for 30 days to enable you to exercise in the comfort of
                your own home.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div
            className="bg-gradient-to-r from-limeGreen via-brightYellow to-hotPink text-white p-10 rounded-lg shadow-lg"
            data-oid="xkpp0hp"
          >
            <h3
              className="text-2xl md:text-3xl font-bold mb-4"
              data-oid="lx1t-37"
            >
              Start Your Journey Today!
            </h3>
            <p className="text-lg mb-6" data-oid="3c9uc1h">
              If you want to be challenged, lose weight & tone up in a tailored,
              focused session, LMW Fitness is for you.
              <br data-oid="j01qrv-"></br>Join others who have transformed their
              health with LMW Fitness & take the first step towards a fitter,
              stronger you.
            </p>
            <button
              className="btn-primary px-6 md:px-8 py-3 text-lg"
              data-oid="-bz:qtb"
            >
              <HashLink to="/#Contact" data-oid="mn17.c.">
                Get Started
              </HashLink>
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
