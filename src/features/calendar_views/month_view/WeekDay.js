import React, { useRef, useContext } from "react";

// PACKAGES
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import dayjs from "dayjs";

// CONTEXT
import { EventContext } from "../../../common/EventContext";

const WeekDay = ({ date, month, events, maxNumberOfEvents }) => {
  const remainingEventsNumber =
    events && maxNumberOfEvents < events.length ? events.length - maxNumberOfEvents : undefined;

  const monthDay = dayjs(date).date();
  const titleRef = useRef();

  const { modal } = useContext(EventContext);

  const chooseStyle = () => {
    const today = dayjs().startOf("day");
    const currentDate = dayjs(date).startOf("day");
    if (month !== currentDate.month() || (currentDate.isBefore(today) && month === today.month())) return "past";
    if (currentDate.isSame(today)) return "today";
    return "future";
  };

  const styles = {
    past: "text-gray-500 bg-gray-400 bg-opacity-25 hover:text-gray-700 hover:bg-gray-500 hover:bg-opacity-25",
    today: "text-blue-600 bg-blue-300 bg-opacity-25 hover:bg-blue-400 hover:bg-opacity-25",
    future: "bg-white bg-opacity-25 text-gray-700 hover:bg-gray-300 hover:bg-opacity-25 hover:text-black",
  };

  const handleClick = () => modal.display(date);
  const currentStyle = styles[chooseStyle()];

  return (
    <>
      <div className={`${currentStyle} relative px-2 py-2 border-b border-b-500 cursor-pointer`} onClick={handleClick}>
        <div className={`text-md font-semibold`} ref={titleRef}>
          {monthDay}
        </div>
        <RemainingEventsNumber remainingEventsNumber={remainingEventsNumber} isShown={!!remainingEventsNumber} />
      </div>
    </>
  );
};

WeekDay.propTypes = exact({
  date: PropTypes.string.isRequired,
  month: PropTypes.number.isRequired,
  events: PropTypes.array,
  maxNumberOfEvents: PropTypes.number.isRequired,
});

function RemainingEventsNumber({ remainingEventsNumber, isShown }) {
  return (
    <>
      {isShown && (
        <div className="absolute bottom-0 left-0 flex justify-end w-full">
          <div className="text-xs font-semibold text-gray-600 pr-2">+ {remainingEventsNumber}</div>
        </div>
      )}
    </>
  );
}

RemainingEventsNumber.propTypes = exact({
  remainingEventsNumber: PropTypes.number,
  isShown: PropTypes.bool.isRequired,
});

export default WeekDay;
