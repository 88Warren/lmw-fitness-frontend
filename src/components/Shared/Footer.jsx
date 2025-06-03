import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

const Footer = () => {
  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div data-oid="sbu5c66">
        <hr className="h-1 border-0 bg-limeGreen" data-oid="lisgo9z"></hr>
      </div>

      <footer
        className="bg-customGray p-6 lg:py-8 text-white"
        data-oid="z4a:p_-"
      >
        <div className="mx-auto max-w-7xl" data-oid="_19dykc">
          <div
            className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left"
            data-oid="bvkbe39"
          >
            {/* Logo Column */}
            <div
              className="flex justify-center md:justify-start"
              data-oid="qe.4:h2"
            >
              <Link to="/" onClick={handleClick} data-oid="_udr9-g">
                <h1 className="lmw" data-oid="yzz16jd">
                  <span className="l" data-oid="o2e6j0g">
                    L
                  </span>
                  <span className="m" data-oid="wobegop">
                    M
                  </span>
                  <span className="w" data-oid="0qx3la6">
                    W
                  </span>
                  <span className="fitness" data-oid="8gt9gyj">
                    fitness
                  </span>
                </h1>
              </Link>
            </div>

            {/* Company Links */}
            <div data-oid="f6-r0jd">
              {/* <h2 className="font-titillium mb-4 font-semibold uppercase">Pages</h2>
                   <ul className="space-y-2">
                      <li><Link to="/about" onClick={handleClick} className="hover:text-brightYellow">About</Link></li>
                      <li><Link to="/blog" onClick={handleClick} className="hover:text-brightYellow">Blog</Link></li>
                   </ul> */}
            </div>

            {/* Social Links */}
            <div data-oid="lewye5o">
              {/* <h2 className="font-titillium mb-4 font-semibold uppercase">Follow Me</h2>
                   <ul className="space-y-2">
                      <li><a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="hover:text-brightYellow">Facebook</a></li>
                      <li><a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:text-brightYellow">Instagram</a></li>
                   </ul> */}
            </div>

            {/* Legal Links */}
            <div data-oid="94n_:4_">
              {/* <h2 className="font-titillium mb-4 font-semibold uppercase">Legal</h2>
                   <ul className="space-y-2">
                      <li><Link to="/privacy-policy" onClick={handleClick} className="hover:text-brightYellow">Privacy Policy</Link></li>
                      <li><Link to="/terms" onClick={handleClick} className="hover:text-brightYellow">Terms & Conditions</Link></li>
                   </ul> */}
            </div>
          </div>

          <hr className="my-6 border-white" data-oid="gmpg7v6" />

          {/* Bottom Section */}
          <div
            className="flex flex-col md:flex-row justify-between items-center text-sm"
            data-oid="ac9_v.b"
          >
            <span data-oid="n_n75vq">© 2025 LMW Fitness</span>

            {/* Social Icons */}
            <div
              className="hidden md:flex space-x-4 justify-center items-center"
              data-oid="7nr.t4p"
            >
              <Link
                to="https://www.facebook.com/profile.php?id=61573194721199"
                target="_blank"
                className="text-limeGreen socials"
                aria-label="Facebook"
                data-oid="ilx2_7x"
              >
                <FaFacebook className="text-2xl" data-oid="p_5sqyz" />
              </Link>
              <Link
                to="https://www.instagram.com/lmw__fitness/"
                target="_blank"
                className="text-brightYellow socials"
                aria-label="Instagram"
                data-oid="8v1c1h."
              >
                <FaInstagram className="text-2xl" data-oid=".ag29ky" />
              </Link>
              <Link
                to="https://www.tiktok.com/en/"
                target="_blank"
                className="text-hotPink socials"
                aria-label="TikTok"
                data-oid="9xft4m1"
              >
                <FaTiktok className="text-2xl" data-oid="djfu76x" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
