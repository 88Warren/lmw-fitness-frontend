import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from "../components/home/HeroSection";
import AboutSection from "../components/home/About";
import Testimonials from "../components/home/Testimonials";
import Pricing from "../components/home/Pricing";
import ContactForm from "../components/home/ContactForm";
import WaveDivider from "../components/Shared/WaveDivider";
import useTheme from "../hooks/useTheme";

const HomePage = () => {
  const location = useLocation();
  const [theme] = useTheme();

  const dividerFillLight = "#2a3241"; 
  const dividerFillLight2 = "#cecece";
  const dividerFillLight3 = "#fff";
  const dividerFillDark = "#000";
  const dividerFillDark2 = "#2a3241";

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
      <HeroSection id="Home" />
      <WaveDivider fill={theme === 'dark' ? dividerFillDark : dividerFillLight3} flip />
      <AboutSection id="About" />
      <WaveDivider fill={theme === 'dark' ? dividerFillDark2 : dividerFillLight} />
      <Testimonials id="Testimonials" />
      <WaveDivider fill={theme === 'dark' ? dividerFillDark2 : dividerFillLight} flip />
      <Pricing id="Pricing" />
      <WaveDivider fill={theme === 'dark' ? dividerFillDark : dividerFillLight2} />
      <ContactForm id="Contact" />
    </>
  );
};

export default HomePage;
