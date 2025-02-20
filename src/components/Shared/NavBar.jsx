import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Change when scrolled 50px down
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('section');
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
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLink = (section) =>
    section === activeSection
      ? 'font-titillium py-2 px-6 mr-2 text-xl text-customGray rounded bg-gradient-to-r from-limeGreen via-brightYellow to-hotPink'
      : 'font-titillium py-2 px-6 text-xl text-white rounded hover:bg-brightYellow hover:text-customGray';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-customGray opacity-80 shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between">
          <div className="flex items-center">
            <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center">
              <h1 className="lmw">
                <span className="l">L</span>
                <span className="m">M</span>
                <span className="w">W</span>
                <span className='fitness'>fitness</span>
              </h1>
            </Link>
            <div className="hidden md:flex items-center">
              {['Home', 'WhatWeOffer', 'Pricing', 'Contact'].map((section) => (
                <button key={section} onClick={() => scrollToSection(section)} className={navLink(section)}>
                  {section.replace(/([A-Z])/g, ' $1').trim()}
                </button>
              ))}
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <button className="text-customGray focus:outline-none" onClick={() => setIsMenuOpen((prev) => !prev)}>
              {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>
      <div
        className={`md:hidden font-titillium text-center text-customGray transform transition-opacity ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
      >
        {['heroSection', 'whatIOffer', 'pricing', 'testimonials', 'about', 'contact'].map((section) => (
          <button key={section} onClick={() => { scrollToSection(section); setIsMenuOpen(false); }} className="hamburger-nav-bar">
            {section.replace(/([A-Z])/g, ' $1').trim()}
          </button>
        ))}
      </div>

       {/* Social Icons
       <div className="flex space-x-4">
        <a href="#" className="text-limeGreen" aria-label="Facebook">
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 8 19">
                <path fillRule="evenodd" d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z" clipRule="evenodd"/>
            </svg>
        </a>
        <a href="#" className="text-brightYellow" aria-label="Twitter">
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 17">
                <path fillRule="evenodd" d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z" clipRule="evenodd"/>
            </svg>
        </a>
        <a href="#" className="text-hotPink" aria-label="GitHub">
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clipRule="evenodd"/>
            </svg>
        </a>
      </div> */}
    </nav>
  );
};

export default Navbar;
