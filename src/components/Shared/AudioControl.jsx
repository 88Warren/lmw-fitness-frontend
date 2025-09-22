import React from "react";
import PropTypes from "prop-types";

const AudioControl = ({ audioEnabled, onToggle, className = "" }) => {
  return (
    <div className={className}>
      <button
        onClick={onToggle}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
          audioEnabled
            ? "bg-limeGreen text-black hover:bg-green-400"
            : "bg-gray-600 text-logoGray hover:bg-gray-500"
        }`}
        title={
          audioEnabled ? "Disable workout sounds" : "Enable workout sounds"
        }
      >
        <span className="text-lg">{audioEnabled ? "🔊" : "🔇"}</span>
      </button>
    </div>
  );
};

AudioControl.propTypes = {
  audioEnabled: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default AudioControl;
