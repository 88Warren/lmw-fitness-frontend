import { Outlet } from "react-router-dom";
import Navbar from "../components/Shared/NavBar";
import Footer from "../components/Shared/Footer";

const Boilerplate = () => {
  return (
    <>
      <Navbar data-oid="0w0kncx" />
      <Outlet data-oid="brhwl:e" />
      <Footer data-oid="d2.3dl9" />
    </>
  );
};

export default Boilerplate;
