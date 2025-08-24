import { toast } from "react-toastify";
import CustomToast from "../components/Shared/Errors/CustomToast";

export const showToast = (type, message) => {
  toast(<CustomToast type={type} message={message} />, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: true,
  });
};
