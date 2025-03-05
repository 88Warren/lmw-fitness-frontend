import React, { useEffect, useState, useMemo } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaBars, FaTimes, FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import { getCookie } from '../../utils/fetchCookie';

const Navbar = () => {
  const handleClick = () => {
    window.scrollTo(0, 0);
    closeMobileMenu();
  };

  const [activeSection, setActiveSection] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const token = getCookie('access_token');
  const isLoggedIn = !!token;

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userId = currentUser ? currentUser.id : null;

  const sections = useMemo(() => document.querySelectorAll('section'), []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Change when scrolled 50px down
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
  };

  const navLink = (section) =>
    section === activeSection
      ? 'font-titillium font-bold py-2 px-6 mr-2 text-xl text-customGray rounded bg-gradient-to-r from-limeGreen via-brightYellow to-hotPink'
      : 'font-titillium py-2 px-6 text-xl text-white rounded hover:bg-brightYellow hover:text-customGray';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-customGray opacity-80 shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between">
          <div className="flex items-center">
            <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center">
              <h1 className="lmw">
                <span className="l pr-1.5">L</span>
                <span className="m pr-1.5">M</span>
                <span className="w pr-4">W</span>
                <span className='fitness'>fitness</span>
              </h1>
            </Link>
            <div className="hidden md:flex items-center">
              {['Home', 'About', 'Testimonials', 'Pricing', 'Contact'].map((section) => (
                <button key={section} onClick={() => scrollToSection(section)} className={navLink(section)}>
                  {section.replace(/([A-Z])/g, ' $1').trim()}
                </button>
              ))}
              <NavLink to="/blogs" onClick={handleClick} className={navLink('Blog')}>Blog</NavLink>
            </div>
          </div>

          {/* Social Icons */}    
          <div className="hidden md:flex space-x-4 justify-center items-center">
            <a href="#" className="text-limeGreen" aria-label="Facebook">
              <FaFacebook className="text-2xl" />
            </a>
            <a href="#" className="text-brightYellow" aria-label="Instagram">
              <FaInstagram className="text-2xl" />
            </a>
            <a href="#" className="text-hotPink" aria-label="TikTok">
              <FaTiktok className="text-2xl" />
            </a>
          </div>

          <div className="md:hidden flex items-center">
            <button className="text-customGray focus:outline-none" onClick={() => setIsMenuOpen((prev) => !prev)}>
              {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>
      <div
        className={`md:hidden font-titillium text-center text-customGray transform transition-opacity ${isMenuOpen ? 'block opacity-100' : 'hidden opacity-0'}`}
      >
        {['Home', 'About', 'Testimonials', 'Pricing', 'Contact'].map((section) => (
          <button key={section} onClick={() => { scrollToSection(section); setIsMenuOpen(false); }} className="hamburger-nav-bar">
            {section.replace(/([A-Z])/g, ' $1').trim()}
          </button>
        ))}
        <NavLink to="/blogs" onClick={handleClick} className="block py-2 px-4 rounded hover:bg-lightGray transition-colors mx-auto w-fit">Blog</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
