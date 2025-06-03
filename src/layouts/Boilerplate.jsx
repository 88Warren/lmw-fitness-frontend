import { Outlet } from "react-router-dom";
import Navbar from "../components/Shared/NavBar";
import Footer from "../components/Shared/Footer";

const Boilerplate = () => {
  return (
    <>
      <Navbar data-oid="84lsxg6" />
      <Outlet data-oid="kuf4vnl" />
      <Footer data-oid="9m41qpp" />
    </>
  );
};

export default Boilerplate;
