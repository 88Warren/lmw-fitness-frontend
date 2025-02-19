import { Outlet } from 'react-router-dom';
import Navbar from '../components/Shared/NavBar';
import Footer from '../components/Shared/Footer';

const Boilerplate = () => {
  return (
    <>
        <Navbar />
          <Outlet />
        <Footer />
    </>
  );
};

export default Boilerplate;