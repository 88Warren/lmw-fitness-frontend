import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaRegUser,
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [sections, setSections] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const sectionElements = Array.from(document.querySelectorAll("section"));
    setSections(sectionElements);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      { threshold: 0.5 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => sections.forEach((section) => observer.unobserve(section));
  }, [sections, location.pathname]);

  useEffect(() => {
    if (location.pathname !== "/") {
      setSections([]);
      return;
    }
    const interval = setInterval(() => {
      const sectionElements = Array.from(document.querySelectorAll("section"));
      if (sectionElements.length > 0) {
        setSections(sectionElements);
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [location.pathname]);

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

  const navLink = (sectionName) => {
    const isOnHomePage = location.pathname === "/";
    let isActive = false;

    if (isOnHomePage) {
      isActive = sectionName === activeSection;
    } else {
      if (sectionName === "Home") {
        isActive = false;
      } else {
        isActive = false;
      }
    }
    return isActive
      ? "font-titillium font-bold py-2 px-4 md:px-6 mr-2 text-lg md:text-xl text-customGray rounded bg-gradient-to-r from-limeGreen via-brightYellow to-hotPink"
      : "font-titillium py-2 px-4 md:px-6 text-lg md:text-xl text-white rounded hover:bg-brightYellow hover:text-customGray";
  };

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("");
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center transition-all duration-300 ${isScrolled ? "bg-customGray opacity-80 shadow-md" : "bg-transparent"}`}
        data-oid="3ownl0b"
      >
        <div
          className="max-w-7xl mx-auto w-full flex items-center justify-between px-6 md:px-10"
          data-oid="ntirh6a"
        >
          {/* Logo */}
          <NavLink
            to="/"
            onClick={() => window.scrollTo(0, 0)}
            className="flex items-center"
            data-oid="kxi_k2c"
          >
            <h1 className="lmw items-end text-lg md:text-xl" data-oid="zc7r9ow">
              <span className="l pr-1" data-oid=".u89pvu">
                L
              </span>
              <span className="m pr-1" data-oid="62gui-g">
                M
              </span>
              <span className="w pr-2" data-oid="3fukn92">
                W
              </span>
              <span className="fitness" data-oid="m8lqucd">
                fitness
              </span>
            </h1>
          </NavLink>

          {/* Web Menu */}
          <div
            className="hidden lg:flex items-center justify-between w-full px-4"
            data-oid="wbmaait"
          >
            {/* Left: Navigation Links */}
            <div className="flex items-center space-x-4" data-oid="pm5sm24">
              {["Home", "About", "Contact"].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={navLink(section)}
                  data-oid="e79e3f_"
                >
                  {section.replace(/([A-Z])/g, " $1").trim()}
                </button>
              ))}
              <NavLink
                to="/blog"
                className={({ isActive }) =>
                  isActive
                    ? "font-titillium font-bold py-2 px-4 md:px-6 text-lg md:text-xl text-customGray rounded bg-gradient-to-r from-limeGreen via-brightYellow to-hotPink"
                    : "font-titillium py-2 px-4 md:px-6 text-lg md:text-xl text-white rounded hover:bg-brightYellow hover:text-customGray"
                }
                data-oid="1gey9_w"
              >
                Blog
              </NavLink>
            </div>

            {/* Center: User Links */}
            <div className="flex items-center justify-end" data-oid="7:efdno">
              {!isLoggedIn ? (
                <NavLink
                  to="/login"
                  className="font-titillium font-bold py-2 px-4 md:px-6 text-lg md:text-xl text-customGray rounded bg-gradient-to-r from-limeGreen via-brightYellow to-hotPink hover:bg-brightYellow hover:text-customGray transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Login"
                  data-oid="jlqtnf:"
                >
                  Login
                </NavLink>
              ) : (
                <>
                  <NavLink
                    to="/profile"
                    className="font-titillium font-bold py-2 px-4 md:px-6 text-lg md:text-xl text-customGray rounded bg-gradient-to-r from-limeGreen via-brightYellow to-hotPink"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Profile"
                    data-oid="_anc1.4"
                  >
                    Profile
                  </NavLink>
                </>
              )}
            </div>

            {/* Right: Social Icons */}
            <div className="flex items-center space-x-4" data-oid="j25uj9g">
              <NavLink
                to="https://www.facebook.com/profile.php?id=61573194721199"
                target="_blank"
                className="text-limeGreen socials"
                aria-label="Facebook"
                data-oid=":ycb2av"
              >
                <FaFacebook
                  className="text-xl md:text-2xl"
                  data-oid="ngjlsvl"
                />
              </NavLink>

              <NavLink
                to="https://www.instagram.com/lmw__fitness/"
                target="_blank"
                className="text-brightYellow socials"
                aria-label="Instagram"
                data-oid="0:s5zrn"
              >
                <FaInstagram
                  className="text-xl md:text-2xl"
                  data-oid="bgcd-:b"
                />
              </NavLink>

              <NavLink
                to="https://www.tiktok.com/en/"
                target="_blank"
                className="text-hotPink socials"
                aria-label="TikTok"
                data-oid="4f5iyqs"
              >
                <FaTiktok className="text-xl md:text-2xl" data-oid="1y-mc4d" />
              </NavLink>
              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="font-titillium py-2 px-4 md:px-6 text-lg md:text-xl text-white rounded bg-red-500 hover:bg-red-600 transition-colors duration-300"
                  data-oid="y-dw:7v"
                >
                  Logout
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white focus:outline-none p-2 rounded-lg transition-all duration-300 z-50"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            data-oid="dze93g6"
          >
            {isMenuOpen ? (
              <FaTimes className="text-3xl" data-oid="k6hwt9i" />
            ) : (
              <FaBars className="text-3xl" data-oid="kkd5777" />
            )}
          </button>
        </div>
      </nav>

      {/* Side Navbar (Mobile Menu) */}
      <aside
        className={`fixed top-0 left-0 w-3/4 max-w-xs h-full bg-customGray/90 backdrop-blur-md shadow-lg z-40 transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        data-oid="cjyy7kn"
      >
        <div
          className="flex flex-col items-center mt-24 space-y-4"
          data-oid="h-rl.v9"
        >
          {["Home", "About", "Contact"].map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className="text-white text-lg font-titillium py-2 hover:bg-brightYellow hover:text-customGray transition-all rounded-lg w-3/4 text-center"
              data-oid="o7srs3k"
            >
              {section.replace(/([A-Z])/g, " $1").trim()}
            </button>
          ))}
          <NavLink
            to="/blog"
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) =>
              isActive
                ? "font-titillium font-bold py-2 px-4 md:px-6 text-lg md:text-xl text-customGray rounded bg-gradient-to-r from-limeGreen via-brightYellow to-hotPink"
                : "font-titillium py-2 px-4 md:px-6 text-lg md:text-xl text-white rounded hover:bg-brightYellow hover:text-customGray"
            }
            data-oid="a11t-pu"
          >
            Blog
          </NavLink>

          {/* Conditional Login/Logout/Register Links for Mobile */}
          {!isLoggedIn ? (
            <>
              <NavLink
                to="/login"
                className="text-white text-lg font-titillium py-2 hover:bg-brightYellow hover:text-customGray transition-all rounded-lg w-3/4 text-center"
                onClick={() => setIsMenuOpen(false)}
                data-oid="97xrb_-"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="text-white text-lg font-titillium py-2 hover:bg-brightYellow hover:text-customGray transition-all rounded-lg w-3/4 text-center"
                onClick={() => setIsMenuOpen(false)}
                data-oid="p2yo:uq"
              >
                Register
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/profile"
                className="text-white text-lg font-titillium py-2 hover:bg-brightYellow hover:text-customGray transition-all rounded-lg w-3/4 text-center"
                onClick={() => setIsMenuOpen(false)}
                data-oid="--7i82r"
              >
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-white text-lg font-titillium py-2 w-3/4 text-center rounded bg-red-500 hover:bg-red-600 transition-colors duration-300"
                data-oid="b0a-.xb"
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
