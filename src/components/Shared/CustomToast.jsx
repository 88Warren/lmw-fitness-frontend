import React from "react";
import "react-toastify/dist/ReactToastify.css";

const CustomToast = ({ type, message }) => {
  const bgColor =
    type === "success" ? "bg-limeGreen opacity-60" :
    type === "warn" ? "bg-brightYellow" :
    "bg-hotPink";

  return (
    <div className={`flex items-center p-4 rounded-xl text-white shadow-lg w-96 ${bgColor}`}>
      <div className="flex-1">
        <p className="font-bold text-lg">{message}</p>
      </div>
    </div>
  );
};

export default CustomToast;