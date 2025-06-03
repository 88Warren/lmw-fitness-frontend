import { toast, Zoom } from "react-toastify";
import CustomToast from "../components/Shared/CustomToast";

export const showToast = (type, message) => {
  toast(<CustomToast type={type} message={message} data-oid="eb0c98w" />, {
    position: "top-center",
    autoClose: 3000,
    className: "custom-toast",
    transition: Zoom,
  });
};
