import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const NotFoundPage = () => {
  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <section className="text-center flex flex-col justify-center items-center h-lvh">
      <FaExclamationTriangle className="text-brightYellow text-6xl mb-4" />

      <h1 className="font-titillium text-6xl font-bold mb-4">404 Not Found</h1>
      <p className="font-titillium text-xl mb-5">This page does not exist</p>
      <Link
        to="/"
        onClick={handleClick}
        className="btn-full-colour"
      >
        Go Back
      </Link>
    </section>
  );
};

export default NotFoundPage;
