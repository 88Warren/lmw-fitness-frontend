import HeroSection from "../components/home/HeroSection";
import AboutSection from "../components/home/About";
import Testimonials from "../components/home/Testimonials";
import Pricing from "../components/home/Pricing";
import ContactForm from "../components/home/ContactForm";

const HomePage = () => {
  return (
    <>
      <HeroSection id="Home" />
      <AboutSection id="About" />
      <Testimonials id="Testimonials" />
      <Pricing id="Pricing" />
      <ContactForm id="Contact" />
    </>
  );
};

export default HomePage;
