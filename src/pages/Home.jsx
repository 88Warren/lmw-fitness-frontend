import React from "react";
import { Link } from 'react-router-dom'
import logo from '../assets/images/LMW_fitness_NavBar_Logo.png'

import HeroSection from "../components/home/HeroSection";
import WhatIOffer from "../components/home/WhatIOffer";
import Pricing from "../components/home/Pricing";
import Testimonials from "../components/home/Testimonials";
import AboutSection from "../components/home/AboutMe";
import ContactForm from "../components/home/ContactForm"

const HomePage = () => {
  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <>
    <section className="max-w-7xl mx-auto py-20">

      <HeroSection />
      <WhatIOffer />
      <Pricing />
      <Testimonials />
      <AboutSection />
      <ContactForm />

    </section>
    
    {/* hero section */}
      <section className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          <div className="col-span-1 bg-gradient-to-br from-hotPink to-brightYellow text-white p-8 flex flex-col justify-center">
            <h1 className="font-titillium text-4xl font-semibold leading-tight">Unlock Fitness</h1>
            <p className="font-titillium tracking-wider mt-4 text-lg">Discover local Gyms, Classes, Clubs and Activities!</p>
          </div>
          <div className="col-span-1 relative">
          <div className="absolute inset-0 bg-cover bg-center bg-opacity-40" style={{ backgroundImage: 'url("")' }}></div>
            <img src={logo} alt="Fitness Locator Logo" className="relative z-10 mx-auto" />
          </div>
        </div>
      </section>

      {/* About section */}
      <section className="max-w-7xl md:max-w-5xl mx-auto py-8">
        <div className="title-section">
          <h1 className="h1-primary">Find Your Next Fitness Adventure</h1>
        </div>
        <div>
          <p className="font-titillium mt-4 text-lg text-justify leading-loose tracking-wide text-customGray">Looking for fitness activities nearby? Whether it’s a gym, personal trainer, local club, or the perfect spot for a run, Fitness Locator makes it easy to find options in your area. Our user-friendly search and interactive map help you explore local venues, read reviews, access pricing, contact details and links to their websites. With everything in one place, you can easily find what suits you, making fitness more accessible and helping you stay motivated as you begin your journey.</p>
        </div>
      </section>

      {/* Banner section */}
      <section className="max-w-7xl mx-auto bg-limeGreen/65 text-white py-12 text-center">
          <h1 className="text-3xl font-semibold">Join our ever growing number of users to find your next fitness journey</h1>
          <p className="font-titillium mt-4 text-lg">From gyms to personal trainers, sports clubs and outdoor activities - Discover 10,000+ fitness options across the UK</p>
          <Link to="/activities/locator" onClick={handleClick} className="btn-primary mt-6 inline-block px-6 py-3 bg-limeGreen text-white font-semibold rounded-lg">Search</Link>
      </section>

      {/* How to section */}
      <section className="max-w-7xl md:max-w-5xl mx-auto py-8">
        <div className="title-section">
          <h1 className="h1-primary">How to use Fitness Locator</h1>
        </div>
        <div className="mt-8 space-y-8">
          <div>
            <h2 className="h2-primary">Stap 1: Search for Fitness Options</h2>
            <p className="p-primary">Simply enter your location (postcode or city) in the search bar to find fitness-related activities near you, including gyms, personal trainers, fitness clubs and outdoor workout spots.</p>
          </div>
          <div>
            <h2 className="h2-primary">Step 2: Filter Your Results</h2>
            <p className="p-primary">Use our filter options to narrow down your search by type of activity, distance or facility. Whether you’re looking for a gym with specific equipment, a personal trainer, or a local running trail, we’ve got you covered.</p>
          </div>
          <div>
            <h2 className="h2-primary">Step 3: Explore with the Map</h2>
            <p className="p-primary">Our interactive map gives you a visual overview of the fitness options available in your area. Zoom in and out to see more details, or click on a location for more information.</p>
          </div>
          <div>
            <h2 className="h2-primary">Step 4: Review and Compare</h2>
            <p className="p-primary">Check out ratings, reviews, and facility details to help you choose the best option for your needs. See what others have said and make an informed decision about where you want to work out.</p>
          </div>
          <div>
            <h2 className="h2-primary">Step 5: Get in Touch</h2>
            <p className="p-primary">Once you’ve found a spot that fits, you can easily access contact information, pricing details, and links to websites or booking pages. Reach out directly or sign up to get started on your fitness journey!</p>
          </div>
          <div>
            <h2 className="h2-primary">Step 6: Stay Motivated</h2>
            <p className="p-primary">With your new fitness options at your fingertips, it’s easier than ever to find something that keeps you moving and motivated. Fitness Locator helps you maintain momentum and achieve your fitness goals, no matter where you are.</p>
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage;