import React, { useState } from "react";

// PACKAGES
import dayjs from "dayjs";

// COMPONENTS
import EventLabel from "./EventLabel";
import { Button } from "../../../Button";
import { useEffect } from "react";

// SCRIPTS
import timeFormats from "../../../common/timeFormats";

const MAX_DURATION = 12;

function addHalfHour(time, maxTime) {
  let currentTime = dayjs(time, timeFormats.iso);
  const maxEndTime = dayjs(maxTime, timeFormats.iso).add(MAX_DURATION, "hours");
  currentTime = currentTime.add(30, "minutes");

  if (currentTime > maxEndTime) return maxEndTime.format(timeFormats.iso);
  return currentTime.format(timeFormats.iso);
}

function subtractHalfHour(time, minTime) {
  let currentTime = dayjs(time, timeFormats.iso);
  const minEndTime = dayjs(minTime, timeFormats.iso);
  currentTime = currentTime.subtract(30, "minutes");

  if (currentTime < minEndTime) return minEndTime.format(timeFormats.iso);
  return currentTime.format(timeFormats.iso);
}

const add1HourToTime = (time, minTime) => {
  const plusThirty = addHalfHour(time, minTime);
  return addHalfHour(plusThirty, minTime);
};

function EndTime({ defaultEndTime }) {
  const [newEndTime, setNewEndTime] = useState(defaultEndTime);

  function addToEndTime() {
    const nextEndTime = addHalfHour(newEndTime, defaultEndTime);
    setNewEndTime(nextEndTime);
  }

  function subtractFromEndTime() {
    const nextEndTime = subtractHalfHour(newEndTime, defaultEndTime);
    setNewEndTime(nextEndTime);
  }

  const displayedEndTime = dayjs(newEndTime, timeFormats.iso).format("HH:mm");

  const newDefaultEndTime = add1HourToTime(defaultEndTime, defaultEndTime);
  useEffect(() => {
    // if new prop defaultEndTime, reset state and add 1 hour
    setNewEndTime(newDefaultEndTime);
  }, [newDefaultEndTime]);

  const styles = {
    input: `flex flex-grow w-full
                     bg-gray-100 appearance-none
                     py-2 px-4
                     text-gray-700 leading-tight
                     border-2 border-gray-400
                     rounded-l-none rounded-r-none
                     cursor-default
                     focus:outline-none
                     `,
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
          callBack={() => subtractFromEndTime()}
          css={`
            ${styles.button} ${styles.leftButton}
          `}
          withFocus={false}
        >
          <i className="gg-math-minus"></i>
        </Button>
        <input className={`${styles.input}`} type="text" value={displayedEndTime} readOnly />
        <Button
          callBack={() => addToEndTime()}
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
