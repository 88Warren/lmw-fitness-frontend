import PropTypes from "prop-types";

export const InputField = ({ label, type, name, value, onChange, placeholder, className, required, infoText }) => (
  <div>
    <label 
      className="block mb-2 text-m text-customWhite font-titillium tracking-wide" 
      htmlFor={name}
    >
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className={className}
      placeholder={placeholder}
      required={required}
    />
    {infoText && (
      <p className="text-sm text-logoGray mt-2 font-titillium">
        {infoText}
      </p>
    )}
  </div>
);

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string, 
  required: PropTypes.bool,    
  infoText: PropTypes.string,
};

export const TextAreaField = ({ label, name, value, onChange, rows = 5, placeholder = "", className, required, infoText  }) => (
  <div>
    <label 
      className="block mb-2 text-m text-customWhite font-titillium tracking-wide" 
      htmlFor={name}
    >
      {label}
    </label>
    <textarea
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className={className}
      rows={rows}
      placeholder={placeholder}
      required={required}
    />
    {infoText && (
      <p className="text-sm text-logoGray mt-2 font-titillium">
        {infoText}
      </p>
    )}
  </div>
);

TextAreaField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string, 
  required: PropTypes.bool,   
  infoText: PropTypes.string,
};
