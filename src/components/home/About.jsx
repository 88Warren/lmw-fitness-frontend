import { HashLink } from "react-router-hash-link";

const About = () => {
  return (
    <>
      <section id="About" className="py-16 px-6 bg-gray-100" data-oid="kag9azk">
        <div className="max-w-5xl mx-auto text-center" data-oid="dig9jjk">
          <h2
            className="text-3xl md:text-4xl font-higherJump text-black mb-8 leading-relaxed md:leading-loose"
            data-oid="gml0a63"
          >
            <span className="w" data-oid="0x_d.gw">
              W
            </span>
            elco
            <span className="m" data-oid="1z2ulfm">
              M
            </span>
            e to <br className="hidden md:block" data-oid="_8ighn:"></br>"
            <span className="l" data-oid="i5vy_om">
              L
            </span>
            ive{" "}
            <span className="m" data-oid="wqeabsv">
              M
            </span>
            ore{" "}
            <span className="w" data-oid="1.s-rln">
              W
            </span>
            ith fitness"!
          </h2>
          <p
            className="text-lg text-customGray max-w-3xl mx-auto mb-8"
            data-oid="7bd9gcl"
          >
            Hi, I’m Laura, and I’m passionate about helping you achieve your
            health and fitness goals. Whether you want to feel stronger, move
            better or regain confidence, I’m here to support you every step of
            the way.<br data-oid="dk39e0v"></br>
            I'm really excited that you're visiting my site, as I have loads of
            ways to help you get fit!
          </p>

          {/* Images Section */}
          <div
            className="grid grid-col-1 md:grid-cols-2 gap-6 mb-12"
            data-oid="_skuf.2"
          >
            {/* <img src={fitnessImage} alt="Fitness Training" className="rounded-lg shadow-lg w-full" />
                 <img src={coachImage} alt="Personal Coaching" className="rounded-lg shadow-lg w-full" /> */}
          </div>

          {/* Mission Statement */}
          <div
            className="bg-white p-6 rounded-lg shadow-md mb-12"
            data-oid="s5x9tv8"
          >
            <h3
              className="text-2xl md:text-3xl font-bold text-black mb-4"
              data-oid="vv10ru:"
            >
              My Mission
            </h3>
            <p className="text-lg text-customGray" data-oid="pgrghyn">
              My motto is:
              <span className="font-bold text-limeGreen" data-oid="2r3g9oj">
                {" "}
                'If not now, then when?'{" "}
              </span>
              & I believe fitness should be accessible to everyone, however busy
              life gets.
              <br className="hidden md:block" data-oid="dto9b9-"></br>I want to
              help you achieve a new, fitter, healthier way of life. With
              structured programs and expert coaching, I can support you into
              developing sustainable habits that fit into your lifestyle.
            </p>
          </div>

          {/* Why Choose Me? */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
            data-oid="fz6s6mg"
          >
            <div
              className="bg-white p-6 rounded-lg shadow-md"
              data-oid="p02crtp"
            >
              <h4
                className="text-xl md:text-2xl font-bold text-black mb-4"
                data-oid="dhv2mh8"
              >
                Expertise & Experience
              </h4>
              <p className="text-lg text-customGray" data-oid="irm51z2">
                As a qualified personal trainer and an ex-British Army physical
                training instructor, I have years of hands-on coaching
                experience and I know what works.
                <br className="hidden md:block" data-oid="645dhuj"></br>I’ve
                tested countless fitness methods and created proven,
                time-efficient programs to deliver real results. And of course,
                I have the relevant certificates and qualifications to back this
                up.
              </p>
            </div>
            <div
              className="bg-white p-6 rounded-lg shadow-md"
              data-oid="8fgak.:"
            >
              <h4
                className="text-xl md:text-2xl font-bold text-black mb-4"
                data-oid="0f.ju71"
              >
                Flexible & Accessible
              </h4>
              <p className="text-lg text-customGray" data-oid="4immv3q">
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
            data-oid="3veb:rv"
          >
            <h3
              className="text-2xl md:text-3xl font-bold mb-4"
              data-oid="0e77odm"
            >
              Start Your Journey Today!
            </h3>
            <p className="text-lg mb-6" data-oid="y1upwh-">
              If you want to be challenged, lose weight & tone up in a tailored,
              focused session, LMW Fitness is for you.
              <br data-oid="satd-y0"></br>Join others who have transformed their
              health with LMW Fitness & take the first step towards a fitter,
              stronger you.
            </p>
            <button
              className="btn-primary px-6 md:px-8 py-3 text-lg"
              data-oid="6am-xoq"
            >
              <HashLink to="/#Contact" data-oid="mzj-kzp">
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
