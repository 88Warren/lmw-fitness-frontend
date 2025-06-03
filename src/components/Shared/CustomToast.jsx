import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";

const CustomToast = ({ type, message }) => {
  const bgColor =
    type === "success"
      ? "bg-limeGreen opacity-60"
      : type === "warn"
        ? "bg-brightYellow"
        : "bg-hotPink";

  return (
    <div
      className={`flex items-center p-4 rounded-xl text-white shadow-lg w-96 ${bgColor}`}
      data-oid="497yuyj"
    >
      <div className="flex-1" data-oid="-w58bgd">
        <p className="font-bold text-lg" data-oid="7husi.d">
          {message}
        </p>
      </div>
    </div>
  );
};

CustomToast.propTypes = {
  type: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default CustomToast;
