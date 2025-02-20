import React from "react";

import HeroSection from "../components/home/HeroSection";
import WhatIOffer from "../components/home/WhatWeOffer";
import Pricing from "../components/home/Pricing";
// import Testimonials from "../components/home/Testimonials";
// import AboutSection from "../components/home/AboutMe";
import ContactForm from "../components/home/ContactForm"

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <WhatIOffer />
      <Pricing />
      {/* <Testimonials id="testimonials" /> */}
      {/* <AboutSection id="aboutSection" /> */}
      <ContactForm />
    </>
  )
}

export default HomePage;