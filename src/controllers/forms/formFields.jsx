import PropTypes from "prop-types";

export const InputField = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  required,
  infoText,
  children, 
  checked,
  autoComplete,  
}) => {

  const  inputClasses = "mt-1 block w-full px-4 py-3 border border-logoGray rounded-md shadow-sm placeholder-logoGray text-logoGray focus:outline-none focus:border-3 sm:text-m font-titillium bg-gray-700";
  return (
    <div>
      <label
        className="block mb-2 text-m text-customWhite font-titillium tracking-wide"
        htmlFor={name}
      >
        {label}
      </label>

      {type === "select" ? (
        <select
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          className={inputClasses}
          required={required}
        >
          {children}
        </select>
      ) : type === "checkbox" ? (
        <div className="relative inline-block">
          <input
            type="checkbox"
            name={name}
            id={name}
            checked={checked}
            onChange={onChange}
            className={`
              appearance-none
              h-6 w-6
              rounded-md
              border-2 border-logoGray
              bg-gray-700
              cursor-pointer
              focus:outline-none
              transition-all duration-200
              relative
            `}
          />
          {checked && (
            <span
              className={`
                absolute left-0 top-0
                h-6 w-6
                flex items-center justify-center
                text-brightYellow
                text-xl
                pointer-events-none
              `}
            >
              ✓
            </span>
          )}
        </div>
      ) : (
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          className={inputClasses}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
        />
      )}

      {infoText && (
        <p className="text-sm text-logoGray mt-2 font-titillium">
          {infoText}
        </p>
      )}
    </div>
  );
};

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,  
  checked: PropTypes.bool,       
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  required: PropTypes.bool,
  infoText: PropTypes.string,
  children: PropTypes.node,
  autoComplete: PropTypes.string,    
};

export const TextAreaField = ({ label, name, value, onChange, rows = 5, placeholder = "", required, infoText  }) => (
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
      className="mt-1 block w-full px-4 py-3 border border-logoGray rounded-md shadow-sm placeholder-logoGray text-logoGray focus:outline-none focus:border-3 sm:text-m font-titillium bg-gray-700 resize-y"
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
  rows: PropTypes.number,
};