import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";

const CustomToast = ({ type, message }) => {
  const bgColor =
    type === "success"
      ? "bg-limeGreen"
      : type === "warn"
        ? "bg-brightYellow"
        : "bg-hotPink";

  return (
    <div className={`flex items-center p-4 rounded-xl text-center text-white w-96 ${bgColor}`}>
      <div className="flex-1">
        <p className="font-bold text-lg font-titillium">{message}</p>
      </div>
    </div>
  );
};

CustomToast.propTypes = {
  type: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default CustomToast;
