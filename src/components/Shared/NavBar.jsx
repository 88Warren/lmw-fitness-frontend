import { useEffect, useState } from "react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sections, setSections] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const { cartItemCount } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === "/") {
      const sectionElements = Array.from(document.querySelectorAll("section[id]")); 
      setSections(sectionElements);
    } else {
      setSections([]); 
      setActiveSection(""); 
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== "/" || sections.length === 0) {
      return; 
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }, 
    );

    sections.forEach((section) => observer.observe(section));
    return () => sections.forEach((section) => observer.unobserve(section));
  }, [sections, location.pathname]); 

  const scrollToSection = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/", { replace: false });

      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 200); 
    } else {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }

    setIsMenuOpen(false); 
  };

  const inactiveLinkClasses = "font-titillium py-1 px-4 text-lg md:text-xl text-white rounded hover:bg-brightYellow hover:text-customGray transition-colors duration-300";
  const activeLinkClasses = "font-titillium font-bold py-1 px-4 text-lg md:text-xl text-customGray rounded bg-gradient-to-r from-limeGreen via-brightYellow to-hotPink";

  const getNavLinkClasses = (linkPath, sectionId = null) => {
    const isOnHomePage = location.pathname === "/";
    let isActive = false;

    if (sectionId && isOnHomePage) {
      isActive = sectionId === activeSection;
    } else if (linkPath) {
      isActive = location.pathname === linkPath;
    }

    return isActive
      ? activeLinkClasses
      : inactiveLinkClasses;
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center transition-all duration-300 bg-customGray"      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-6 md:px-10">
        
        {/* Mobile Menu */}
        <div className="lg:hidden flex justify-between items-center w-full">
          {/* Hamburger menu icon  */}
          <button
            className="lg:hidden text-white focus:outline-none p-2 rounded-lg transition-all duration-300 z-50"
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
          <div className="hidden lg:flex items-center justify-between w-full px-4">
            {/* Left: Navigation Links */}
            <div className="flex items-center space-x-4">
              {/* Home Link */}
              <button
                onClick={() => scrollToSection("Home")}
                className={getNavLinkClasses("/", "Home")} 
              >
                Home
              </button>
              {/* About Link */}
              <button
                onClick={() => scrollToSection("About")}
                className={getNavLinkClasses("/about", "About")} 
              >
                About
              </button>

              {/* Pricing Link */}
              <button
                onClick={() => scrollToSection("Pricing")}
                className={getNavLinkClasses("/pricing", "Pricing")} 
              >
                Pricing
              </button>

              {/* Contact Link */}
              <button
                onClick={() => scrollToSection("Contact")}
                className={getNavLinkClasses("/contact", "Contact")} 
              >
                Contact
              </button>

              {/* Blog Link */}
              <NavLink
                to="/blog"
                className={getNavLinkClasses("/blog")}
              >
                Blog
              </NavLink>
            </div>

            {/* Center: User Links */}
            {/* <div className="flex items-center justify-end">
              {!isLoggedIn ? (
                <>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      isActive
                        ? `${activeLinkClasses} mr-2`
                        : `${inactiveLinkClasses} mr-2`
                    }
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Login"
                  >
                    Login
                  </NavLink>
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
                </>
              )}
            </div> */}

            {/* Right: Social Icons */}
            <div className="flex items-center space-x-4">
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
              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="btn-cancel w-2/3 font-bold"
                >
                  Logout
                </button>
              )}
            </div>

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
      </nav>

      {/* Side Navbar (Mobile Menu) */}
      <aside
        className={`fixed top-0 left-0 w-3/4 max-w-xs h-full bg-customGray backdrop-blur-md shadow-lg z-40 transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center mt-24 space-y-4">
          {/* Home Link for Mobile */}
          <button
            onClick={() => scrollToSection("Home")}
            className={`text-white text-lg font-titillium py-2 hover:bg-brightYellow hover:text-customGray transition-all rounded-lg w-3/4 text-center ${getNavLinkClasses("/", "Home")}`}
          >
            Home
          </button>
          {/* About Link for Mobile */}
          <button
            onClick={() => scrollToSection("About")}
            className={`text-white text-lg font-titillium py-2 hover:bg-brightYellow hover:text-customGray transition-all rounded-lg w-3/4 text-center ${getNavLinkClasses("/about", "About")}`} 
          >
            About
          </button>

          {/* Pricing Link for Mobile */}
          <button
            onClick={() => scrollToSection("Pricing")}
            className={`text-white text-lg font-titillium py-2 hover:bg-brightYellow hover:text-customGray transition-all rounded-lg w-3/4 text-center ${getNavLinkClasses("/about", "About")}`} 
          >
            Pricing
          </button>

          {/* Contact Link for Mobile */}
          <button
            onClick={() => scrollToSection("Contact")}
            className={`text-white text-lg font-titillium py-2 hover:bg-brightYellow hover:text-customGray transition-all rounded-lg w-3/4 text-center ${getNavLinkClasses("/contact", "Contact")}`} 
          >
            Contact
          </button>

          <NavLink
            to="/blog"
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) =>
              isActive ? `${activeLinkClasses} w-3/4 text-center` : "text-white text-lg font-titillium py-2 hover:bg-brightYellow hover:text-customGray transition-all rounded-lg w-3/4 text-center"
            }
          >
            Blog
          </NavLink>

          {/* Conditional Login/Logout/Register Links for Mobile */}
          {!isLoggedIn ? (
            <>
              {/* <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? `${activeLinkClasses} w-3/4 text-center`
                    : "text-white text-lg font-titillium py-2 hover:bg-brightYellow hover:text-customGray transition-all rounded-lg w-3/4 text-center"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </NavLink> */}
              {/* NEW: Register Link for Mobile */}
              {/* <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive
                    ? `${activeLinkClasses} w-3/4 text-center`
                    : "text-white text-lg font-titillium py-2 hover:bg-brightYellow hover:text-customGray transition-all rounded-lg w-3/4 text-center"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </NavLink> */}
            </>
          ) : (
            <>
              {/* <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive
                    ? `${activeLinkClasses} w-3/4 text-center`
                    : "text-white text-lg font-titillium py-2 hover:bg-brightYellow hover:text-customGray transition-all rounded-lg w-3/4 text-center"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </NavLink> */}
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