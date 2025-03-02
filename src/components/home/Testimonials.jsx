import React from 'react'

const Testimonials = () => {
  return (
    <>
      {/* What You Offer */}
      <section id="Testimonials" className="py-16 px-6 bg-customGray">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-higherJump text-black mb-20"><span className="w">W</span>hat <span className="text-brightYellow">M</span>y c<span className="l">l</span>ients say...</h2>
          <p className="text-lg text-white leading-loose">
          <span className="l font-bold text-5xl">"</span>I’ve tried all sorts of training plans over the years, but with Laura’s plan, I can see massive changes in my body shape and my mental state, feeling more positive and knowing that for once I’ve found a plan that is working. 
            Laura is energetic, fun & committed and has lots of experience with diets and exercise. I highly recommend her to anyone wanting to improve their Fitness & lose weight. 
            <br />Thank you Laura, for all your help. This is one plan I will be sticking to!
            <br /><span className="l font-bold text-5xl text-right">"</span>
          </p>
          <p className="text-lg text-white leading-relaxed text-right mt-2">
          <span className="m">M</span>ichelle
          </p>
          <button className="btn-primary mt-10 w-48">
            Start Your Journey Today
          </button>
        </div>
      </section>
    </>
  )
}

export default Testimonials;