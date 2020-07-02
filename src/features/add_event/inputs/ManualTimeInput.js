import React from "react";

// PACKAGES
import PropTypes from "prop-types";
import exact from "prop-types-exact";

function ManualTimeInput({ timeInput, validInput, onHandleChange, radius = "rounded-none" }) {
  const styles = {
    timeInput: `flex flex-grow w-full
        bg-gray-100 appearance-none
        py-2 px-4
        text-gray-700 leading-tight
        border-2 border-gray-400
        ${radius}
        hover:bg-blue-100 hover:text-blue-700 hover:border-blue-800
        focus:outline-none
                         `,
    valid: "focus:text-blue-700 focus:bg-blue-100 focus:border-blue-800",
    invalid: "bg-red-100 border-red-800 focus:text-red-700 focus:bg-red-100 focus:border-red-800",
  };

  const timeInputStyle = validInput ? styles.valid : styles.invalid;

  return (
    <input
      className={`${styles.timeInput} ${timeInputStyle}`}
      type="text"
      value={timeInput}
      onChange={onHandleChange}
    />
  );
}

ManualTimeInput.propTypes = exact({
  timeInput: PropTypes.string.isRequired,
  validInput: PropTypes.bool.isRequired,
  onHandleChange: PropTypes.func.isRequired,
  radius: PropTypes.string.isRequired,
});

ManualTimeInput.defaultProps = {
  radius: "rounded-none",
};

export default ManualTimeInput;
