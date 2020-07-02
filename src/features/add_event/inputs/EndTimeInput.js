import React from "react";

// COMPONENTS
import EventLabel from "./EventLabel";
import { Button } from "../../../Button";

// SCRIPTS
import ManualTimeInput from "./ManualTimeInput";

function EndTime({ timeInput, validInput, onAddEndTime, onSubtractEndtime, onHandleChange }) {
  const styles = {
    button: `flex justify-center items-center bg-gray-400
                      px-4
                      border-gray-400
                      text-gray-800 text-center
                      hover:text-white hover:bg-blue-800 hover:border-blue-800
                      focus:outline-none focus:bg-blue-800 focus:border-blue-800 focus:text-white`,
    rightButton: "border-r-2 border-b-2 border-t-2 border-gray-400 rounded-r rounded-l-none",
    leftButton: "border-l-2 border-b-2 border-t-2 rounded-l rounded-r-none",
  };

  return (
    <div className="mt-4">
      <EventLabel>End Time</EventLabel>
      <div className="flex w-2/3">
        <Button
          callBack={onSubtractEndtime}
          css={`
            ${styles.button} ${styles.leftButton}
          `}
          withFocus={false}
        >
          <i className="gg-math-minus"></i>
        </Button>
        <ManualTimeInput timeInput={timeInput} onHandleChange={onHandleChange} validInput={validInput} />
        <Button
          callBack={onAddEndTime}
          css={`
            ${styles.button} ${styles.rightButton}
          `}
          withFocus={false}
        >
          <i className="gg-math-plus"></i>
        </Button>
      </div>
    </div>
  );
}

export default EndTime;
