import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

const Footer = () => {
  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div data-oid="bcpzzx9">
        <hr className="h-1 border-0 bg-limeGreen" data-oid="shkbyyi"></hr>
      </div>

      <footer
        className="bg-customGray p-6 lg:py-8 text-white"
        data-oid="59s.b2b"
      >
        <div className="mx-auto max-w-7xl" data-oid=":-6r7lj">
          <div
            className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left"
            data-oid="1tqv965"
          >
            {/* Logo Column */}
            <div
              className="flex justify-center md:justify-start"
              data-oid="r0zsbap"
            >
              <Link to="/" onClick={handleClick} data-oid="f:vn.pf">
                <h1 className="lmw" data-oid="-00sz-l">
                  <span className="l" data-oid="nob8fys">
                    L
                  </span>
                  <span className="m" data-oid="7v.b316">
                    M
                  </span>
                  <span className="w" data-oid="8eb0.iw">
                    W
                  </span>
                  <span className="fitness" data-oid=".3bok3.">
                    fitness
                  </span>
                </h1>
              </Link>
            </div>

            {/* Company Links */}
            <div data-oid="ckuqux7">
              {/* <h2 className="font-titillium mb-4 font-semibold uppercase">Pages</h2>
                <ul className="space-y-2">
                   <li><Link to="/about" onClick={handleClick} className="hover:text-brightYellow">About</Link></li>
                   <li><Link to="/blog" onClick={handleClick} className="hover:text-brightYellow">Blog</Link></li>
                </ul> */}
            </div>

            {/* Social Links */}
            <div data-oid="4ew2uub">
              {/* <h2 className="font-titillium mb-4 font-semibold uppercase">Follow Me</h2>
                <ul className="space-y-2">
                   <li><a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="hover:text-brightYellow">Facebook</a></li>
                   <li><a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:text-brightYellow">Instagram</a></li>
                </ul> */}
            </div>

            {/* Legal Links */}
            <div data-oid="x63v5px">
              {/* <h2 className="font-titillium mb-4 font-semibold uppercase">Legal</h2>
                <ul className="space-y-2">
                   <li><Link to="/privacy-policy" onClick={handleClick} className="hover:text-brightYellow">Privacy Policy</Link></li>
                   <li><Link to="/terms" onClick={handleClick} className="hover:text-brightYellow">Terms & Conditions</Link></li>
                </ul> */}
            </div>
          </div>

          <hr className="my-6 border-white" data-oid="h27ponb" />

          {/* Bottom Section */}
          <div
            className="flex flex-col md:flex-row justify-between items-center text-sm"
            data-oid="jjs5dok"
          >
            <span data-oid="ilstw9h">© 2025 LMW Fitness</span>

            {/* Social Icons */}
            <div
              className="hidden md:flex space-x-4 justify-center items-center"
              data-oid=".c0w6c:"
            >
              <Link
                to="https://www.facebook.com/profile.php?id=61573194721199"
                target="_blank"
                className="text-limeGreen socials"
                aria-label="Facebook"
                data-oid="905puw9"
              >
                <FaFacebook className="text-2xl" data-oid="zl-0y.w" />
              </Link>
              <Link
                to="https://www.instagram.com/lmw__fitness/"
                target="_blank"
                className="text-brightYellow socials"
                aria-label="Instagram"
                data-oid="r23n7u6"
              >
                <FaInstagram className="text-2xl" data-oid="fvzz8l7" />
              </Link>
              <Link
                to="https://www.tiktok.com/en/"
                target="_blank"
                className="text-hotPink socials"
                aria-label="TikTok"
                data-oid="fpjmp3v"
              >
                <FaTiktok className="text-2xl" data-oid="t13l0hm" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
