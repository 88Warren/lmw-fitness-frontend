import PropTypes from "prop-types";

export const InputField = ({ label, type, name, value, onChange }) => (
  <div data-oid="a5bjc_l">
    <label
      className="block text-black font-bold mb-2"
      htmlFor={name}
      data-oid="pubfobc"
    >
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className="w-full p-3 border rounded focus:ring-2 focus:ring-limeGreen"
      required
      data-oid="2pmhcfs"
    />
  </div>
);

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export const TextAreaField = ({ label, name, value, onChange }) => (
  <div data-oid="0bqewa.">
    <label
      className="block text-black font-bold mb-2"
      htmlFor={name}
      data-oid="alcblel"
    >
      {label}
    </label>
    <textarea
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className="w-full p-3 border rounded focus:ring-2 focus:ring-limeGreen"
      rows="5"
      required
      data-oid="3.h2tvs"
    />
  </div>
);

TextAreaField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
