import React from 'react'
import { HashLink } from 'react-router-hash-link';

const About = () => {
  return (
    <>
    <section id="About" className="py-16 px-6 bg-gray-100">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-higherJump text-black mb-10 leading-loose">
        <span className="w">W</span>elco<span className="m">M</span>e to <br></br>
        "<span className="l">L</span>ive <span className="m">M</span>ore <span className="w">W</span>ith fitness"!
        </h2>
        <p className="text-lg text-customGray max-w-3xl mx-auto mb-10">
          Hi, I’m Laura, and I’m passionate about helping you achieve your health and fitness goals. 
          Whether you want to feel stronger, move better or regain confidence, I’m here to support you every step of the way.<br></br>
          I'm really excited that you're visiting my site, as I have loads of ways to help you get fit!
        </p>

        {/* Images Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* <img src={fitnessImage} alt="Fitness Training" className="rounded-lg shadow-lg w-full" />
          <img src={coachImage} alt="Personal Coaching" className="rounded-lg shadow-lg w-full" /> */}
        </div>

        {/* Mission Statement */}
        <div className="bg-white p-8 rounded-lg shadow-md mb-12">
          <h3 className="text-3xl font-bold text-black mb-4">My Mission</h3>
          <p className="text-lg text-customGray">
          My motto is: 
          <span className="font-bold text-limeGreen"> 'If not now, then when?' </span>& I believe fitness should be accessible to everyone, however busy life gets.
            <br></br>I want to help you achieve a new, fitter, healthier way of life.
            With structured programs and expert coaching, I can support you into developing sustainable habits that fit into your lifestyle.
          </p>
        </div>

        {/* Why Choose Me? */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-2xl font-bold text-black mb-4">Expertise & Experience</h4>
            <p className="text-lg text-customGray">
              As a qualified personal trainer and an ex-British Army physical training instructor, I have years of hands-on coaching experience and I know what works. 
              <br></br>I’ve tested countless fitness methods and created proven, time-efficient programs to deliver real results.
              And of course, I have the relevant certificates and qualifications to back this up.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-2xl font-bold text-black mb-4">Flexible & Accessible</h4>
            <p className="text-lg text-customGray">
              My 30-Day Fat Loss Program is designed for people with busy lifestyles. No gym required – just commitment and a positive mindset!
              I offer quality, effective fat loss programmes for beginners and the more advanced.
              They are available online and you will be sent a daily video, every day, for 30 days to enable you to exercise in the comfort of your own home.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-limeGreen via-brightYellow to-hotPink text-white p-10 rounded-lg shadow-lg">
          <h3 className="text-3xl font-bold mb-4">Start Your Journey Today!</h3>
          <p className="text-lg mb-6">
            If you want to be challenged, lose weight & tone up in a tailored, focused session, LMW Fitness is for you.  
            <br></br>Join others who have transformed their health with LMW Fitness & take the first step towards a fitter, stronger you.
          </p>
          <button className="btn-primary px-8 py-3 text-lg">
            <HashLink to="/#Contact">            
              Get Started
            </HashLink>    
          </button>
        </div>

      </div>
    </section>
  </>
  )
}

export default About