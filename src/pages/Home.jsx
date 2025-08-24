import HeroSection from "../components/home/HeroSection";
import AboutSection from "../components/home/About";
import Testimonials from "../components/home/Testimonials";
import Pricing from "../components/home/Pricing";
import ContactForm from "../components/home/ContactForm";
import WaveDivider from "../components/Shared/WaveDivider";

const HomePage = () => {
  const dividerFillLight = "#2a3241"; 
  const dividerFillLight2 = "#cecece";
  const dividerFillLight3 = "#fff";

return (
    <>
      <HeroSection id="Home" />
      <WaveDivider fill={dividerFillLight3} flip />
      <AboutSection id="About" />
      <WaveDivider fill={dividerFillLight} />
      <Testimonials id="Testimonials" />
      <WaveDivider fill={dividerFillLight} flip />
      <Pricing id="Pricing" />
      <WaveDivider fill={dividerFillLight2} />
      <ContactForm id="Contact" />
    </>
  );
};

export default HomePage;
