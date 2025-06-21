import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from "../components/home/HeroSection";
import AboutSection from "../components/home/About";
import Testimonials from "../components/home/Testimonials";
import Pricing from "../components/home/Pricing";
import ContactForm from "../components/home/ContactForm";
import WaveDivider from "../components/Shared/WaveDivider";

const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.substring(1);
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);
  
  return (
    <>
      <HeroSection />
      <AboutSection />
      <WaveDivider fill="#2a3241" />
      <Testimonials />
      <WaveDivider fill="#2a3241" flip />
      <Pricing />
      <WaveDivider fill="#cecece" flip />
      <ContactForm />
    </>
  );
};

export default HomePage;
