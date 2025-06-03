import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const NotFoundPage = () => {
  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <section
      className="text-center flex flex-col justify-center items-center h-96"
      data-oid="vcy30b:"
    >
      <FaExclamationTriangle
        className="text-brightYellow text-6xl mb-4"
        data-oid="_bbr:3g"
      />
      <h1 className="font-titillium text-6xl font-bold mb-4" data-oid="0xw7skt">
        404 Not Found
      </h1>
      <p className="font-titillium text-xl mb-5" data-oid="-q.aj4o">
        This page does not exist
      </p>
      <Link
        to="/"
        onClick={handleClick}
        className="text-white bg-limeGreen hover:bg-brightYellow rounded-md px-3 py-2 mt-4"
        data-oid="jyxaq5u"
      >
        Go Back
      </Link>
    </section>
  );
};

export default NotFoundPage;
