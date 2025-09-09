import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

const Footer = () => {
  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div>
        <hr className="h-0.5 border-0 bg-limeGreen"></hr>
      </div>

      <footer className="bg-customGray p-6 lg:py-8 text-black">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 md:gap-8 text-center md:text-left">
            {/* Logo Column */}
            <div className="flex col-span-3 justify-center md:justify-start">
              <Link to="/" onClick={handleClick}>
                <h1 className="lmw">
                  <span className="l">L</span>
                  <span className="m">M</span>
                  <span className="w">W</span>
                  <span className="fitness">fitness</span>
                </h1>
              </Link>
            </div>

            {/* Legal Links Column (Updated) */}
            <div className="flex flex-col justify-center items-center md:items-end space-y-4 mt-4 md:mt-0">
              <Link
                to="/docs/LMW_fitness_Website_Policies.docx"
                target="_blank"
                rel="noopener noreferrer"
                className="font-titillium text-xs text-logoGray hover:text-limeGreen transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                to="/docs/LMW_fitness_Terms_of_Service.docx"
                target="_blank"
                rel="noopener noreferrer"
                className="font-titillium text-xs text-logoGray hover:text-brightYellow transition-colors duration-300"
              >
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="p-4">
            <hr className="h-0.25 border-0 bg-black"></hr>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center text-xs">
            <span className="mb-2 sm:mb-0">
              © {new Date().getFullYear()} LMW Fitness
            </span>

            {/* Social Icons */}
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link
                to="https://www.facebook.com/profile.php?id=61573194721199"
                target="_blank"
                rel="noopener noreferrer"
                className="text-limeGreen socials"
                aria-label="Facebook"
              >
                <FaFacebook className="text-xl" />
              </Link>
              <Link
                to="https://www.instagram.com/lmw__fitness/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brightYellow socials"
                aria-label="Instagram"
              >
                <FaInstagram className="text-xl" />
              </Link>
              <Link
                to="https://www.tiktok.com/en/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-hotPink socials"
                aria-label="TikTok"
              >
                <FaTiktok className="text-xl" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
