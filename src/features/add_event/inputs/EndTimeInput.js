import React from "react";

// PACKAGES
import PropTypes from "prop-types";
import exact from "prop-types-exact";

// COMPONENTS
import EventLabel from "./EventLabel";
import ManualTimeInput from "./ManualTimeInput";
import { Button } from "../../../common/Button";

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

EndTime.propTypes = exact({
  timeInput: PropTypes.string.isRequired,
  validInput: PropTypes.bool.isRequired,
  onAddEndTime: PropTypes.func.isRequired,
  onSubtractEndtime: PropTypes.func.isRequired,
  onHandleChange: PropTypes.func.isRequired,
});

export default EndTime;
