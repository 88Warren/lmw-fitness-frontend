import React from 'react'

const HeroSection = () => {
  return (
    <>
      {/* hero section */}
      <section id="Home" className='h-screen flex items-center'
        style={{ 
          backgroundImage: 'url("/images/LMW_fitness_Hero_Image3.jpg")',
          backgroundSize: 'cover',        
          backgroundPosition: 'center top', 
          backgroundRepeat: 'no-repeat',
        }}>
        <div className="max-w-7xl mx-auto px-8">
            <div className="text-white text-center bg-black/40 p-8 rounded-xl shadow-lg">
              <h1 className="font-higherJump text-5xl font-bold leading-loose">
                Get <span className="m">Fit</span> on Your <br></br> Schedu<span className="l">l</span>e
              </h1>
              <p className="font-titillium text-2xl mt-4 tracking-wide leading-loose">
              Online personal training tailored just for you. <br />
              </p>
              <button className="btn-primary">
              Get Started Today
              </button>
            </div>
          </div>
      </section>
    </>
  )
}

export default HeroSection;