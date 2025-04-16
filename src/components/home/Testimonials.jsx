import React from 'react'
import { HashLink } from 'react-router-hash-link';


const Testimonials = () => {
  return (
    <>
      {/* What You Offer */}
      <section id="Testimonials" className="py-16 px-6 bg-customGray">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-higherJump text-black mb-12 md:mb-20"><span className="w">W</span>hat <span className="text-brightYellow">M</span>y c<span className="l">l</span>ients say...</h2>
          <p className="text-lg text-white leading-relaxed md:leading-loose">
          <span className="l font-bold text-4xl md:text-5xl">"</span>I’ve tried all sorts of training plans over the years, but with Laura’s plan, I can see massive changes in my body shape and my mental state, feeling more positive and knowing that for once I’ve found a plan that is working. 
            <br className="hidden md:block"/>Laura is energetic, fun & committed and has lots of experience with diets and exercise. I highly recommend her to anyone wanting to improve their Fitness & lose weight. 
            <br className="hidden md:block"/>Thank you Laura, for all your help. This is one plan I will be sticking to!
            <br className="hidden md:block"/><span className="l font-bold text-4xl md:text-5xl text-right mt-2">"</span>
          </p>
          <p className="text-lg text-white leading-relaxed text-right mt-2">
          <span className="m font-higherJump">M</span>ichelle
          </p>
          <button className="btn-primary mt-8 md:mt-10 w-full sm:w-auto">
            <HashLink to="/#Contact" >
              Start Your Journey Today
            </HashLink>
          </button>
        </div>
      </section>
    </>
  )
}

export default Testimonials;