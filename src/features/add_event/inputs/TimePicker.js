import React from "react";

// PACKAGES
import PropTypes from "prop-types";
import exact from "prop-types-exact";

// SCRIPTS
import { range } from "../../../common/utils";

function TimePicker({ eventHour, eventMinutes, onChooseHour, onChooseMinutes, display }) {
  const hours_range = range(0, 23);
  const minutes_range = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  return (
    <>
      {display && (
        <div className="mt-2 w-full p-4 bg-gray-100 border border-gray-300 rounded shadow-sm grid grid-cols-2 gap-2">
          <SelectInput currentValue={eventHour} handleChange={onChooseHour}>
            {hours_range.map((hour) => (
              <option value={hour} key={hour}>
                {hour} h
              </option>
            ))}
          </SelectInput>
          <SelectInput currentValue={eventMinutes} handleChange={onChooseMinutes}>
            {minutes_range.map((minute) => (
              <option value={minute} key={minute}>
                {minute} minutes
              </option>
            ))}
          </SelectInput>
        </div>
      )}
    </>
  );
}
TimePicker.propTypes = exact({
  eventHour: PropTypes.number.isRequired,
  eventMinutes: PropTypes.number.isRequired,
  display: PropTypes.bool.isRequired,
  onChooseHour: PropTypes.func.isRequired,
  onChooseMinutes: PropTypes.func.isRequired,
});

function SelectInput({ currentValue, handleChange, children }) {
  return (
    <select
      className="block bg-white border border-gray-400 rounded hover:bg-blue-100 hover:border-blue-800 p-2 focus:outline-none focus:shadow-outline"
      value={currentValue}
      onChange={handleChange}
    >
      {children}
    </select>
  );
}
SelectInput.propTypes = exact({
  currentValue: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
});

export default TimePicker;
