import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes, FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [sections, setSections] = useState([]);

  useEffect(() => {
    const sectionElements = Array.from(document.querySelectorAll('section'));
    setSections(sectionElements);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25); 
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => sections.forEach((section) => observer.unobserve(section));
  }, [sections]);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const navLink = (section) =>
    section === activeSection
      ? 'font-titillium font-bold py-2 px-4 md:px-6 mr-2 text-lg md:text-xl text-customGray rounded bg-gradient-to-r from-limeGreen via-brightYellow to-hotPink'
      : 'font-titillium py-2 px-4 md:px-6 text-lg md:text-xl text-white rounded hover:bg-brightYellow hover:text-customGray';

  return (
  <>
    {/* Navbar */}
    <nav className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center transition-all duration-300 ${isScrolled ? 'bg-customGray opacity-80 shadow-md' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto w-full flex justify-between px-6 md:px-10">
          <div className="flex items-center">
            <NavLink to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center">
              {/* <div className="flex items-end relative top-2"> */}
                <h1 className="lmw items-end pt-10 text-lg md:text-xl">
                  <span className="l pr-1">L</span>
                  <span className="m pr-1">M</span>
                  <span className="w pr-2">W</span>
                  <span className='fitness'>fitness</span>
                </h1>
              {/* </div> */}
            </NavLink>

             {/* Desktop Navigation */}
             <div className="hidden lg:flex items-center space-x-6 ml-6 md:ml-8">
              {['Home', 'About', 'Testimonials', 'Contact'].map((section) => (
                <button key={section} onClick={() => scrollToSection(section)} className={navLink(section)}>
                  {section.replace(/([A-Z])/g, ' $1').trim()}
                </button>
              ))}
            </div>
          </div>

          {/* Social Icons */}
          <div className="hidden lg:flex items-center space-x-3 md:space-x-4 justify-center">
            <NavLink to="https://www.facebook.com/profile.php?id=61573194721199" target="_blank" className="text-limeGreen socials" aria-label="Facebook">
              <FaFacebook className="text-xl md:text-2xl" />
            </NavLink>
            
            <NavLink to="https://www.instagram.com/lmw__fitness/" target="_blank" className="text-brightYellow socials" aria-label="Instagram">
              <FaInstagram className="text-xl md:text-2xl" />
            </NavLink>

            <NavLink to="https://www.tiktok.com/en/" target="_blank" className="text-hotPink socials" aria-label="TikTok">
              <FaTiktok className="text-xl md:text-2xl" />
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white focus:outline-none p-2 rounded-lg transition-all duration-300 z-50"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? <FaTimes className="text-3xl" /> : <FaBars className="text-3xl" />}
          </button>
        </div>
      </nav>

      {/* Side Navbar (Mobile Menu) */}
      <aside
        className={`fixed top-0 left-0 w-3/4 max-w-xs h-full bg-customGray/90 backdrop-blur-md shadow-lg z-40 transform transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col items-center mt-24 space-y-4">
          {['Home', 'About', 'Testimonials', 'Contact'].map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className="text-white text-lg font-titillium py-2 hover:bg-brightYellow hover:text-customGray transition-all rounded-lg w-3/4 text-center"
            >
              {section.replace(/([A-Z])/g, ' $1').trim()}
            </button>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Navbar;