import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'
import logo from '../../assets/images/LMW_fitness_NavBar_Logo.png'

const Navbar = () => {
  const handleClick = () => {
    window.scrollTo(0, 0);
    closeMobileMenu();
  };

  const navLink = ({ isActive }) => isActive 
  ? 'font-titillium py-2 px-3 mr-2 bg-limeGreen text-customGray rounded'
  : 'font-titillium py-2 px-3 mr-2 text-customGray rounded hover:bg-limeGreen';

  const specialNavLink = ({ isActive }) => isActive 
  ? 'font-titillium py-2 px-3 mr-2 bg-limeGreen rounded text-customGray'
  : 'font-titillium btn-primary';

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMenuOpen(false);

//   const token = getCookie('access_token');
//   const isLoggedIn = !!token;

//   const currentUser = JSON.parse(localStorage.getItem('currentUser'));
//   const userId = currentUser ? currentUser.id : null;

  return (
    // <!-- overall nav -->
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent transition-colors duration-300">
      {/* <!-- container --> */}
      <div className="max-w-7xl mx-auto px-4">
        {/* <!-- Creating space between left side and right side --> */}
        <div className="flex justify-between">
          {/* <!-- left size --> */}
          <div className="flex items-center space-x-1">
            <div>
              <Link to="/" onClick={handleClick} className="flex items-center py-3 px-3">
                <img src={logo} alt="logo" className="h-12 w-14" />
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <NavLink to="/" onClick={handleClick} className={navLink}>Home</NavLink>
              <NavLink to="/activities/locator" onClick={handleClick} className={navLink}>Locator</NavLink>
            {/* {isLoggedIn ? ( */}
              <NavLink to="/activities/new" onClick={handleClick} className={navLink}>Add Activity</NavLink>
            {/* ) : null} */}
            </div>
          </div>
          {/* <!-- right side --> */}
          <div className="hidden md:flex items-center space-x-1"> 
          {/* {!isLoggedIn ? (  */}
            <div>
              <NavLink to="/users/login" onClick={handleClick} className={navLink}>Login</NavLink>
              <NavLink to="/users/register" onClick={handleClick} className={specialNavLink}>Register</NavLink>
            </div>
             {/* ) : ( */}
            {/* <div>
              <NavLink to="/users/logout" onClick={handleClick} className={navLink}>Logout</NavLink>
              <NavLink to={`/users/profile/${userId}`} onClick={handleClick} className={specialNavLink}>Profile</NavLink>
            </div> */}
            {/* )} */}
          </div>
          {/* <!-- mobile menu button --> */}
          <div className="md:hidden flex items-center">
            <button className="text-customGray focus:outline-none" onClick={toggleMenu}>
            {isMenuOpen ? (
                <FaTimes className="text-2xl" />
              ) : (
                <FaBars className="text-2xl" />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      <div className={`md:hidden font-titillium text-center text-customGray transform transition-transform 
        ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
        style={{transition: "transform 0.3s ease, opacity 0.3s ease"}}>
        <NavLink to="/" onClick={handleClick} className="block py-2 px-4 rounded hover:bg-customGray transition-colors mx-auto w-fit">Home</NavLink>
        <NavLink to="/activities/locator" onClick={handleClick} className="block py-2 px-4 rounded hover:bg-customGray transition-colors mx-auto w-fit">Locator</NavLink>
        {/* {isLoggedIn ? ( */}
        <NavLink to="/activities/new" onClick={handleClick} className="block py-2 px-4 rounded hover:bg-customGray transition-colors mx-auto w-fit">Add Activity</NavLink>
        {/* ) : null} */}
      </div>
    </nav>  
  )
};

export default Navbar;