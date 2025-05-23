import HeroSection from "../components/home/HeroSection";
import Testimonials from "../components/home/Testimonials";
import AboutSection from "../components/home/About";
import ContactForm from "../components/home/ContactForm"

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <Testimonials />
      {/* <Pricing /> */}
      <ContactForm />
    </>
  )
}

export default HomePage;