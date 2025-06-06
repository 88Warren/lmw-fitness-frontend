import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import { useState } from "react";

const Footer = () => {
  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  // State and handler for the newsletter form, now in Footer
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for subscribing!");
    setNewsletterEmail("");
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

            {/* Newsletter Signup - Now placed prominently in the footer */}
            <div className="md:col-span-2 flex justify-center"> {/* Centered in footer */}
              <div className="max-w-xs w-full text-white"> {/* White background for contrast */}
                <p className="text-base md:text-lg text-center font-titillium font-semibold mb-4">
                  Get fitness tips and updates!
                </p>
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Your email address"
                    className="flex-1 px-3 py-1 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-limeGreen placeholder-gray-400 text-base"
                    required
                  />
                  <button
                    type="submit"
                    className="btn-subscribe"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
            {/* Links Column */}
            <div className="flex flex-col space-y-4">
              <Link to="/" className="font-titillium text-sm hover:text-limeGreen transition-colors duration-300">Private Policy</Link>
              <Link to="/" className="font-titillium text-sm hover:text-brightYellow transition-colors duration-300">Terms of Service</Link>
            </div>
          </div>

          <hr className="my-6 border-white/20" /> {/* Slightly faded border */}

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center text-xs">
            <span>© 2025 LMW Fitness</span>

            {/* Social Icons */}
            <div className="hidden md:flex space-x-4 justify-center items-center">
                <Link to="https://www.facebook.com/profile.php?id=61573194721199" target="_blank" className="text-limeGreen socials" aria-label="Facebook">
                <FaFacebook className="text-xl" />
                </Link>
                <Link to="https://www.instagram.com/lmw__fitness/" target="_blank" className="text-brightYellow socials" aria-label="Instagram">
                <FaInstagram className="text-xl" />
                </Link>
                <Link to="https://www.tiktok.com/en/" target="_blank" className="text-hotPink socials" aria-label="TikTok">
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