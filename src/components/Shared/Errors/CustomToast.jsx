import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";

const CustomToast = ({ message }) => {

  return (
    <div className="flex items-center p-4 rounded-xl text-center text-black w-96 bg-white">
      <div className="flex-1">
        <p className="text-lg font-titillium">{message}</p>
      </div>
    </div>
  );
};

CustomToast.propTypes = {
  type: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default CustomToast;
