import HeroSection from "../components/home/HeroSection";
import Testimonials from "../components/home/Testimonials";
import AboutSection from "../components/home/About";
import ContactForm from "../components/home/ContactForm";

const HomePage = () => {
  return (
    <>
      <HeroSection data-oid="mqf53x1" />
      <AboutSection data-oid="o3pm3yp" />
      <Testimonials data-oid="mh6n1.8" />
      {/* <Pricing /> */}
      <ContactForm data-oid="cop1zak" />
    </>
  );
};

export default HomePage;
