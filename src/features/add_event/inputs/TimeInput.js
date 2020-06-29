import React, { useState, useEffect } from "react";

// COMPONENTS
import { Button } from "../../../Button";
import TimePicker from "./TimePicker";
import EventLabel from "./EventLabel";

function TimeInput({ title, timeInput, onHandleChange, onChooseHour, onChooseMinutes, onValidate, onInvalidate }) {
  const [timePickerShown, setTimePickerShown] = useState(false);
  const toggleTimePicker = () => setTimePickerShown(!timePickerShown);

  const styles = {
    timeInput: `flex flex-grow
                     bg-gray-100 appearance-none
                     py-2 px-4
                     text-gray-700 leading-tight
                     border-2 border-gray-400
                     rounded-l rounded-r-none
                     hover:bg-blue-100 hover:text-blue-700 hover:border-blue-800
                     focus:outline-none
                     `,
    timePickerToggle: `flex justify-center items-center bg-gray-400
                      px-4
                      border-r-2 border-b-2 border-t-2 border-gray-400
                      rounded-r rounded-l-none
                      text-gray-800 text-center
                      group-hover:bg-blue-800 group-hover:border-blue-800 group-hover:text-white
                      hover:bg-blue-800 hover:border-blue-800
                      focus:outline-none focus:bg-blue-800 focus:border-blue-800 focus:text-white`,
    valid: "focus:text-blue-700 focus:bg-blue-100 focus:border-blue-800",
    invalid: "bg-red-100 border-red-800 focus:text-red-700 focus:bg-red-100 focus:border-red-800",
  };

  const [timeInputStyle, setTimeInputStyle] = useState(styles.valid);
  const [hours, minutes] = timeInput && timeInput.split(":");

  useEffect(() => {
    const validateInput = (timeInput) => {
      const [currentHours, currentMinutes] = timeInput.split(":");

      const hoursNum = Number(currentHours);
      const minutesNum = Number(currentMinutes);
      if (timeInput.length === 5 && hoursNum >= 0 && hoursNum < 24 && minutesNum >= 0 && minutesNum <= 59) {
        onValidate();
        setTimeInputStyle(styles.valid);
      } else {
        onInvalidate();
        setTimeInputStyle(styles.invalid);
      }
    };
    validateInput(timeInput);
  }, [timeInput, styles.invalid, styles.valid, onValidate, onInvalidate]);

  const chooseMinutes = (event) => {
    onChooseMinutes(event);
    toggleTimePicker();
  };

  return (
    <div className="">
      <EventLabel>{title}</EventLabel>
      <div className="flex group w-1/2">
        <input
          className={`${styles.timeInput} ${timeInputStyle}`}
          type="text"
          value={timeInput}
          onChange={onHandleChange}
        />
        <Button callBack={() => toggleTimePicker()} css={styles.timePickerToggle} withFocus={false}>
          <i className="gg-chevron-down"></i>
        </Button>
      </div>
      <TimePicker
        eventHour={Number(hours)}
        eventMinutes={Number(minutes)}
        onChooseHour={onChooseHour}
        onChooseMinutes={(event) => chooseMinutes(event)}
        display={timePickerShown}
      />
    </div>
  );
}

export default TimeInput;
