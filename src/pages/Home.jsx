import HeroSection from "../components/home/HeroSection";
import Testimonials from "../components/home/Testimonials";
import AboutSection from "../components/home/About";
import ContactForm from "../components/home/ContactForm";
import WaveDivider from "../components/Shared/WaveDivider";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      {/* <WaveDivider fill="#e5e7eb" flip/> */}
      <AboutSection />
      <WaveDivider fill="#111827" />
      <Testimonials />
      <WaveDivider fill="#1f2937" flip />
      {/* <Pricing /> */}
      {/* <WaveDivider fill="#fff" /> */}
      <ContactForm />
    </>
  );
};

export default HomePage;
