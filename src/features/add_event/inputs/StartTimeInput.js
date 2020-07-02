import React, { useState, useEffect } from "react";

// COMPONENTS
import { Button } from "../../../Button";
import TimePicker from "./TimePicker";
import EventLabel from "./EventLabel";
import ManualTimeInput from "./ManualTimeInput";

function TimeInput({ title, timeInput, validInput, onHandleChange, onChooseHour, onChooseMinutes }) {
  const [timePickerShown, setTimePickerShown] = useState(false);
  const toggleTimePicker = () => setTimePickerShown(!timePickerShown);

  const styles = {
    timePickerToggle: `flex justify-center items-center bg-gray-400
                      px-4
                      border-r-2 border-b-2 border-t-2 border-gray-400
                      rounded-r rounded-l-none
                      text-gray-800 text-center
                      group-hover:bg-blue-800 group-hover:border-blue-800 group-hover:text-white
                      hover:bg-blue-800 hover:border-blue-800
                      focus:outline-none focus:bg-blue-800 focus:border-blue-800 focus:text-white`,
  };

  const [hours, minutes] = timeInput && timeInput.split(":");

  const chooseMinutes = (event) => {
    onChooseMinutes(event);
    toggleTimePicker();
  };

  return (
    <div>
      <EventLabel>{title}</EventLabel>
      <div className="flex group w-2/3">
        <ManualTimeInput
          timeInput={timeInput}
          onHandleChange={onHandleChange}
          validInput={validInput}
          radius={"rounded-l rounded-r-none"}
        />
        <Button callBack={() => toggleTimePicker()} css={styles.timePickerToggle} withFocus={false}>
          <i className="gg-chevron-down"></i>
        </Button>
      </div>
      <TimePicker
        eventHour={Number(hours)}
        eventMinutes={Number(minutes)}
        onChooseHour={onChooseHour}
        onChooseMinutes={chooseMinutes}
        display={timePickerShown}
      />
    </div>
  );
}

export default TimeInput;
