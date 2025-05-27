import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';

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
                    
                    {/* Company Links */}
                    <div>
                        {/* <h2 className="font-titillium mb-4 font-semibold uppercase">Pages</h2>
                        <ul className="space-y-2">
                            <li><Link to="/about" onClick={handleClick} className="hover:text-brightYellow">About</Link></li>
                            <li><Link to="/blog" onClick={handleClick} className="hover:text-brightYellow">Blog</Link></li>
                        </ul> */}
                    </div>

                    {/* Social Links */}
                    <div>
                        {/* <h2 className="font-titillium mb-4 font-semibold uppercase">Follow Me</h2>
                        <ul className="space-y-2">
                            <li><a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="hover:text-brightYellow">Facebook</a></li>
                            <li><a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:text-brightYellow">Instagram</a></li>
                        </ul> */}
                    </div>

                    {/* Legal Links */}
                    <div>
                        {/* <h2 className="font-titillium mb-4 font-semibold uppercase">Legal</h2>
                        <ul className="space-y-2">
                            <li><Link to="/privacy-policy" onClick={handleClick} className="hover:text-brightYellow">Privacy Policy</Link></li>
                            <li><Link to="/terms" onClick={handleClick} className="hover:text-brightYellow">Terms & Conditions</Link></li>
                        </ul> */}
                    </div>
                </div>

                <hr className="my-6 border-white" />

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-center text-sm">
                    <span>© 2025 LMW Fitness</span>
                    
                    {/* Social Icons */}
                    <div className="hidden md:flex space-x-4 justify-center items-center">
                        <Link to="https://www.facebook.com/profile.php?id=61573194721199" target="_blank" className="text-limeGreen socials" aria-label="Facebook">
                        <FaFacebook className="text-2xl" />
                        </Link>
                        <Link to="https://www.instagram.com/lmw__fitness/" target="_blank" className="text-brightYellow socials" aria-label="Instagram">
                        <FaInstagram className="text-2xl" />
                        </Link>
                        <Link to="https://www.tiktok.com/en/" target="_blank" className="text-hotPink socials" aria-label="TikTok">
                        <FaTiktok className="text-2xl" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    </>
    );
};

export default Footer;