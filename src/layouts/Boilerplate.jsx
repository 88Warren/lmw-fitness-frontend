import { Outlet } from "react-router-dom";
import Navbar from "../components/Shared/NavBar";
import Footer from "../components/Shared/Footer";
import CookieConsent from "../components/Shared/CookieConsent";

const Boilerplate = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <CookieConsent />
    </>
  );
};

export default Boilerplate;
