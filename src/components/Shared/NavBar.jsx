import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaFacebook,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import { useCart } from '../../context/CartContext'; 

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sections, setSections] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const { cartItemCount } = useCart();

  useEffect(() => {
    if (location.hash === "" && location.pathname !== "/") { 
      window.scrollTo(0, 0);
    } else if (location.hash !== "") { 
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.pathname, location.hash]);

  useEffect(() => {
      const sectionElements = Array.from(
        document.querySelectorAll("section[id]")
      );
      setSections(sectionElements);
  }, [location.pathname]);

  useEffect(() => {
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 0);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

useEffect(() => {
  if (location.pathname !== "/" || sections.length === 0) return;
  const observer = new IntersectionObserver(
    (entries) => {
      let topMostVisible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

      if (topMostVisible) {
        setActiveSection(topMostVisible.target.id);
      }
    },
    { threshold: 0.4 }
  );
  sections.forEach((section) => observer.observe(section));
  return () => sections.forEach((section) => observer.unobserve(section));
}, [sections, location.pathname]);

  const handleNavLinkClick = (e, sectionId, path) => {
    e.preventDefault(); 

    if (location.pathname !== "/") {
      navigate(`/${path ? path : ''}#${sectionId}`, { replace: false });
    } else {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
        setActiveSection(sectionId);
      }
    }
    setIsMenuOpen(false); 
  };

  const inactiveLinkClasses = "btn-cancel mt-0 bg-transparent text-customWhite hover:bg-brightYellow hover:text-black";
  const activeLinkClasses = "btn-full-colour mt-0";

  const getNavLinkClasses = (isNavLinkActive, sectionId = null) => {
    const isOnHomePage = location.pathname === "/";

    if (isOnHomePage && sectionId && sectionId === activeSection) {
      return activeLinkClasses;
    }

    if (!isOnHomePage && isNavLinkActive) {
        return activeLinkClasses;
      }

      return inactiveLinkClasses;
    };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  useEffect(() => {
    console.log("Active Section:", activeSection);
  }, [activeSection]);

  return (
    <>
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center transition-all duration-300 ${
        isScrolled ? 'bg-customGray opacity-90 text-black' : ''
      }`}>
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-6 md:px-10">
        
        {/* Mobile Menu */}
        <div className="xl:hidden flex justify-between items-center w-full">
          {/* Hamburger menu icon  */}
          <button
            className="xl:hidden text-white focus:outline-none p-2 rounded-lg transition-all duration-300 z-50"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? (
              <FaTimes className="text-3xl" />
            ) : (
              <FaBars className="text-3xl" />
            )}
          </button>

          {/* Logo */}
          <NavLink
            to="/"
            onClick={() => {
              window.scrollTo(0, 0);
              setIsMenuOpen(false);
            }}
            className="flex items-center justify-center absolute left-7/12 transform -translate-x-1/2"
          >
            <h1 className="lmw text-lg md:text-xl">
              <span className="l pr-1">L</span>
              <span className="m pr-1">M</span>
              <span className="w pr-2">W</span>
              <span className="fitness">fitness</span>
            </h1>
          </NavLink>

          {/* Cart Icon */}
            <NavLink to="/cart" className="relative text-white hover:text-brightYellow transition-colors pl-4"> 
              <FiShoppingCart className="h-7 w-7" aria-label="Shopping Cart" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-hotPink text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </NavLink>
          </div>

          {/* Web Menu */}
          <div className="hidden xl:flex items-center justify-between w-full px-4">
            {/* Left: Navigation Links */}
            <div className="flex items-center">
              {/* Logo */}
              <NavLink
                to="/"
                onClick={() => {
                  window.scrollTo(0, 0);
                  setIsMenuOpen(false);
                }}
                className="flex items-center justify-end"
              >
                <h1 className="lmw text-lg md:text-xl">
                  <span className="l pr-1">L</span>
                  <span className="m pr-1">M</span>
                  <span className="w pr-2">W</span>
                  <span className="fitness mr-10">fitness</span>
                </h1>
              </NavLink>

              {/* Home Link */}
              <NavLink
                to="/"
                className={({ isActive }) => getNavLinkClasses(isActive, "Home")}
                onClick={(e) => handleNavLinkClick(e, "Home", "")}
              >
                Home
              </NavLink>

              {/* About Link */}
              <NavLink
                to="/about" 
                className={({ isActive }) => getNavLinkClasses(isActive, "About")}
                onClick={(e) => handleNavLinkClick(e, "About", "about")}
              >
                About
              </NavLink>

              {/* Testimonials Link */}
              <NavLink
                to="/testimonials" 
                className={({ isActive }) => getNavLinkClasses(isActive, "Testimonials")}
                onClick={(e) => handleNavLinkClick(e, "Testimonials", "testimonials")}
              >
                Testimonials
              </NavLink>


              {/* Pricing Link */}
              <NavLink
                to="/pricing" 
                className={({ isActive }) => getNavLinkClasses(isActive, "Pricing")}
                onClick={(e) => handleNavLinkClick(e, "Pricing", "pricing")}
              >
                Packages
              </NavLink>

              {/* Contact Link */}
              <NavLink
                to="/contact"
                className={({ isActive }) => getNavLinkClasses(isActive, "Contact")}
                onClick={(e) => handleNavLinkClick(e, "Contact", "contact")} 
              >
                Contact
              </NavLink>

              {/* Blog Link */}
              <NavLink to="/blog" className={({ isActive }) => getNavLinkClasses(isActive)}>
                Blog
              </NavLink>
            </div>

            {/* Right: User Links & Socials */}
            <div className="flex items-center space-x-4">
              {!isLoggedIn ? (
                <>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      isActive
                        ? `${activeLinkClasses}`
                        : `${inactiveLinkClasses}`
                    }
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Login"
                  >
                    Login
                  </NavLink>
                  {isAdmin && (
                    <NavLink
                      to="/register"
                      className={({ isActive }) =>
                        isActive
                          ? `${activeLinkClasses} mr-2`
                          : `${inactiveLinkClasses} mr-2`
                      }
                      onClick={() => setIsMenuOpen(false)}
                      aria-label="Register"
                    >
                      Register
                    </NavLink>
                  )}
                </>
              ) : (
                <>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      isActive ? activeLinkClasses : inactiveLinkClasses
                    }
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Profile"
                  >
                    Profile
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="btn-cancel mt-0"
                  >
                    Logout
                  </button>
                </>
              )}

            {/* Social Icons */}
            <NavLink
              to="https://www.facebook.com/profile.php?id=61573194721199"
              target="_blank"
              className="text-limeGreen socials"
              aria-label="Facebook"
            >
              <FaFacebook className="text-xl md:text-2xl" />
            </NavLink>

            <NavLink
              to="https://www.instagram.com/lmw__fitness/"
              target="_blank"
              className="text-brightYellow socials"
              aria-label="Instagram"
            >
              <FaInstagram className="text-xl md:text-2xl" />
            </NavLink>

            <NavLink
              to="https://www.tiktok.com/en/"
              target="_blank"
              className="text-hotPink socials"
              aria-label="TikTok"
            >
              <FaTiktok className="text-xl md:text-2xl" />
            </NavLink>

              {/* Cart Icon for Desktop */}
              <NavLink to="/cart" className="relative text-white hover:text-brightYellow transition-colors pl-4">
                <FiShoppingCart className="h-7 w-7" aria-label="Shopping Cart" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-hotPink text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Side Navbar (Mobile Menu) */}
      <aside
        className={`fixed top-0 left-0 w-3/4 max-w-xs h-full bg-customGray backdrop-blur-md shadow-lg z-40 transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center mt-24 space-y-4">
          {/* Home Link for Mobile */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-white text-lg font-titillium py-2 hover:bg-brightYellow hover:text-customGray transition-all rounded-lg w-3/4 text-center ${getNavLinkClasses(isActive, "Home")}`
            }
            onClick={(e) => handleNavLinkClick(e, "Home", "")}
          >
            Home
          </NavLink>
          {/* About Link for Mobile */}
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `text-white text-lg font-titillium py-2 hover:bg-brightYellow hover:text-customGray transition-all rounded-lg w-3/4 text-center ${getNavLinkClasses(isActive, "About")}`
            }
            onClick={(e) => handleNavLinkClick(e, "About", "about")}
          >
            About
          </NavLink>
          {/* Testimonials Link for Mobile */}
          <NavLink
            to="/testimonials"
            className={({ isActive }) =>
              `text-white text-lg font-titillium py-2 hover:bg-brightYellow hover:text-customGray transition-all rounded-lg w-3/4 text-center ${getNavLinkClasses(isActive, "Testimonials")}`
            }
            onClick={(e) => handleNavLinkClick(e, "Testimonials", "testimonials")}
          >
            Testimonials
          </NavLink>
          {/* Pricing Link for Mobile */}
          <NavLink
            to="/pricing"
            className={({ isActive }) =>
              `text-white text-lg font-titillium py-2 hover:bg-brightYellow hover:text-customGray transition-all rounded-lg w-3/4 text-center ${getNavLinkClasses(isActive, "Pricing")}`
            }
            onClick={(e) => handleNavLinkClick(e, "Pricing", "pricing")}
          >
            Packages
          </NavLink>
          {/* Contact Link for Mobile */}
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `text-white text-lg font-titillium py-2 hover:bg-brightYellow hover:text-customGray transition-all rounded-lg w-3/4 text-center ${getNavLinkClasses(isActive, "Contact")}`
            }
            onClick={(e) => handleNavLinkClick(e, "Contact", "contact")}
          >
            Contact
          </NavLink>
          {/* Blog Link for Mobile */}
          <NavLink
            to="/blog"
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) =>
              `text-white text-lg font-titillium py-2 hover:bg-brightYellow hover:text-customGray transition-all rounded-lg w-3/4 text-center ${getNavLinkClasses(isActive)}`
            }
          >
            Blog
          </NavLink>

          {/* Conditional Login/Logout/Register Links for Mobile */}
          {!isLoggedIn ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? `${activeLinkClasses} w-3/4 text-center`
                    : "text-white text-lg font-titillium py-2 hover:bg-brightYellow hover:text-customGray transition-all rounded-lg w-3/4 text-center"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </NavLink>
              {isAdmin && (
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive
                      ? `${activeLinkClasses} w-3/4 text-center`
                      : "text-white text-lg font-titillium py-2 hover:bg-brightYellow hover:text-customGray transition-all rounded-lg w-3/4 text-center"
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </NavLink>
              )}
            </>
          ) : (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive
                    ? `${activeLinkClasses} w-3/4 text-center`
                    : "text-white text-lg font-titillium py-2 hover:bg-brightYellow hover:text-customGray transition-all rounded-lg w-3/4 text-center"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="btn-cancel text-lg font-titillium py-2 w-3/4 text-center rounded font-bold"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  );
};

export default Navbar;