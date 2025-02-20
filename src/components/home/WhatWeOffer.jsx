import React from 'react'

const WhatWeOffer = () => {
  return (
    <>
      {/* What You Offer */}
      <section id="WhatWeOffer" className="py-16 px-6 bg-customGray">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-higherJump text-black mb-20"><span className="w">W</span>hat <span className="w"> W</span>e Offer</h2>
          <p className="text-lg text-white leading-loose">
            Struggling to find time for fitness? Our <em>personalized 1-on-1 coaching</em> and <em>custom training programs</em> are designed for busy professionals like you.  
            No generic workouts—just <em>tailored plans</em> that fit your lifestyle, help you shed weight, and boost your confidence.  
          </p>
          <p className="text-lg text-white leading-relaxed mt-4">
            This is more than just fitness—<em>it's about feeling strong, energized, and unstoppable</em> every day.
          </p>
          <button className="btn-primary mt-20 w-48">
            Start Your Journey Today
          </button>
        </div>
      </section>
    </>
  )
}

export default WhatWeOffer