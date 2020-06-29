import React, { useState } from "react";

// PACKAGES
import dayjs from "dayjs";
import DayPicker from "react-day-picker/DayPicker";

// COMPONENTS
import EventLabel from "./EventLabel";

function AllDayEventInput({ onInputChange, onPickerChange, css, inputValue, date }) {
  const disabledInput = `bg-white appearance-none
      border-2 border-gray-300 rounded
      w-full
      py-2 px-4
      text-gray-600 leading-tight
      focus:outline-none focus:text-blue-700 focus:bg-blue-100 focus:border-blue-800`;

  const [datePickerShown, setDatePickerShown] = useState(false);

  const handleDayClick = (day) => {
    onPickerChange(day);
    setDatePickerShown(!datePickerShown);
  };

  const close = () => setDatePickerShown(!datePickerShown);

  return (
    <div className="grid grid-cols-7 gap-2">
      <div className="col-span-3">
        <EventLabel>Start Date</EventLabel>
        <input className={disabledInput} value={date} disabled />
      </div>
      <div className="flex items-end mb-2 justify-center">
        <i className="gg-arrow-right mx-2 text-blue-600"></i>
      </div>
      <div className="col-span-3 relative">
        <EventLabel>End date</EventLabel>
        <input
          className={`${css}`}
          value={inputValue}
          onChange={onInputChange}
          onClick={() => setDatePickerShown(!datePickerShown)}
        />
        <DatePickerOverlay show={datePickerShown} onDayClick={handleDayClick} inputValue={inputValue} onClose={close} />
      </div>
    </div>
  );
}

function DatePickerOverlay({ show, onDayClick, inputValue, date, onClose }) {
  return (
    <>
      {show && (
        <div
          className="absolute right-0 top-20 mt-1 bg-white border border-gray-300 rounded shadow"
          onMouseLeave={onClose}
        >
          <DayPicker onDayClick={onDayClick} value={inputValue} disabledDays={[{ before: dayjs(date).toDate() }]} />
        </div>
      )}
    </>
  );
}

export default AllDayEventInput;
