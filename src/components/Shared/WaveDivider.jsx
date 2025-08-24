import PropTypes from "prop-types";

const WaveDivider = ({ fill = "#fff", flip = false, opacity = 1, style = {} }) => (
  <div
    style={{
      width: "100%",
      overflow: "hidden",
      lineHeight: 0,
      transform: flip ? "rotate(180deg)" : undefined,
      opacity: opacity,
      ...style,
    }}
  >
    <svg
      viewBox="0 0 1440 120"
      style={{
        position: "relative",
        display: "block",
        width: "calc(100% + 1.3px)",
        height: "80px",
      }}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        fill={fill}
        d="M0,40 C360,80 720,0 1080,40 C1200,50 1320,60 1440,40 L1440,120 L0,120 Z"

      />
    </svg>
  </div>
);

WaveDivider.propTypes = {
  fill: PropTypes.string,
  flip: PropTypes.bool,
  style: PropTypes.object,
  opacity: PropTypes.number,
};

export default WaveDivider;
