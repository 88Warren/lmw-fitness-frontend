import HeroSection from "../components/home/HeroSection";
import Testimonials from "../components/home/Testimonials";
import AboutSection from "../components/home/About";
import ContactForm from "../components/home/ContactForm";
import WaveDivider from "../components/Shared/WaveDivider";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <WaveDivider fill="#2a3241" />
      <Testimonials />
      <WaveDivider fill="#2a3241" flip />
      {/* <Pricing /> */}
      {/* <WaveDivider fill="#fff" /> */}
      <ContactForm />
    </>
  );
};

export default HomePage;
