import React from "react";

import HeroSection from "../components/home/HeroSection";
import Testimonials from "../components/home/Testimonials";
import Pricing from "../components/home/Pricing";
import AboutSection from "../components/home/AboutMe";
import ContactForm from "../components/home/ContactForm"

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <Testimonials />
      <Pricing />
      <ContactForm />
    </>
  )
}

export default HomePage;