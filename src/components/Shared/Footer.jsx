import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import { useState } from "react";
import { InputField } from "../../controllers/forms/formFields";
import { BACKEND_URL } from "../../utils/config";
import { showToast } from "../../utils/toastUtil";

const Footer = () => {
  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!newsletterEmail) {
      showToast("warn", "Please enter your email address.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/newsletter/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      const data = await response.json();

      if (response.ok || response.status === 200) {
        showToast("success", data.message || "Thank you for subscribing! Please check your inbox to confirm.");
        setNewsletterEmail("");
      } else {
        showToast("error", data.error || "Failed to subscribe. Please try again.");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      showToast("error", "An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
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
              <form onSubmit={handleNewsletterSubmit} className="space-y-4 w-2/5 max-w-md">
                <InputField
                  label="Get fitness tips and updates!"
                  type="email"
                  name="newsletterEmail"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  disabled={isLoading}
                />
              <button
                type="submit"
                className="btn-subscribe w-full h-12 px-6" 
                disabled={isLoading}
              >
                {isLoading ? "Subscribing..." : "Subscribe Now"}
              </button>
            </form>
          </div>

          {/* Links Column */}
          {/* <div className="flex flex-col space-y-4">
            <Link to="/" className="font-titillium text-sm hover:text-limeGreen transition-colors duration-300">Private Policy</Link>
            <Link to="/" className="font-titillium text-sm hover:text-brightYellow transition-colors duration-300">Terms of Service</Link>
          </div> */}
        </div>

        <hr className="my-6 border-white/20" /> 

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs">
          <span>© 2025 LMW Fitness</span>

            {/* Social Icons */}
            <div className="hidden md:flex space-x-4 justify-center items-center">
              <a href="https://www.facebook.com/profile.php?id=61573194721199" target="_blank" rel="noopener noreferrer" className="text-limeGreen socials" aria-label="Facebook">
              <FaFacebook className="text-xl" />
              </a>
              <a href="https://www.instagram.com/lmw__fitness/" target="_blank" rel="noopener noreferrer" className="text-brightYellow socials" aria-label="Instagram">
              <FaInstagram className="text-xl" />
              </a>
              <a href="https://www.tiktok.com/en/" target="_blank" rel="noopener noreferrer" className="text-hotPink socials" aria-label="TikTok">
              <FaTiktok className="text-xl" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;