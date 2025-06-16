import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import NewsletterSignup from "../Blog/Sections/NewsletterSignup";

const Footer = () => {
  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div>
        <hr className="h-1 border-0 bg-limeGreen"></hr>
      </div>

      <footer className="bg-customGray p-6 lg:py-8 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">

            {/* Logo Column */}
            <div className="flex justify-center md:justify-start">
              <Link to="/" onClick={handleClick}>
                <h1 className="lmw">
                    <span className="l">L</span>
                    <span className="m">M</span>
                    <span className="w">W</span>
                    <span className='fitness'>fitness</span>
                </h1>
              </Link>
            </div>

            {/* Newsletter Signup */}
            <div className="md:col-span-2 flex justify-center">
              <div className="w-2/5 max-w-md">
                <NewsletterSignup />
              </div>
            </div>

            {/* Links Column */}
            <div className="flex flex-col items-center md:items-end space-y-4">
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/lmwfitness" target="_blank" rel="noopener noreferrer" className="text-white hover:text-limeGreen transition-colors">
                  <FaFacebook size={24} />
                </a>
                <a href="https://www.instagram.com/lmwfitness" target="_blank" rel="noopener noreferrer" className="text-white hover:text-limeGreen transition-colors">
                  <FaInstagram size={24} />
                </a>
                <a href="https://www.tiktok.com/@lmwfitness" target="_blank" rel="noopener noreferrer" className="text-white hover:text-limeGreen transition-colors">
                  <FaTiktok size={24} />
                </a>
              </div>
              <div className="text-sm text-logoGray">
                © {new Date().getFullYear()} LMW Fitness. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;