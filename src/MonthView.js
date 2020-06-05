import React, { useState, useEffect, useContext, useRef } from "react";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import dayjs from "dayjs";
import { monthViewDays } from "./calendar";
import WeekRow from "./WeekRow";
import { chunk } from "./utils";
import { EventContext } from "./EventContext";

function MonthView({ startOfMonth }) {
  const { events } = useContext(EventContext);
  const monthDaysContainerRef = useRef();
  const [maxItemHeight, setMaxItemHeight] = useState(0);
  const [maxNumberOfEvents, setMaxNumberOfEvents] = useState(0);

  const daysInView = monthViewDays(startOfMonth, events);
  const currentMonth = dayjs(startOfMonth).month();
  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const daysList = Object.keys(daysInView);
  const daysListSize = daysList.length;

  const weeks = chunk(daysList, 7);

  useEffect(() => {
    const maxHeight = Math.round(
      monthDaysContainerRef.current.offsetHeight / (daysListSize / 7)
    );
    setMaxItemHeight((x) => maxHeight);
    const eventHeight = 34; // size of an event. Should be enough to define the max number of events to displey each day.
    const maxEventsSize = Math.floor(maxHeight / eventHeight) - 1;
    setMaxNumberOfEvents((x) => maxEventsSize);
  }, [startOfMonth, daysListSize]);

  return (
    <div className={`flex flex-col flex-grow h-full border-t border-gray-500`}>
      <div className="grid grid-cols-7 divide-x divide-gray-300 border-b border-gray-300">
        {weekDays.map((wDay) => (
          <div
            className="px-2 py-2 text-md font-semibold text-gray-800"
            key={wDay}
          >
            {wDay}
          </div>
        ))}
      </div>
      <div
        ref={monthDaysContainerRef}
        className={`grid grid-rows-${weeks.length} h-full items-stretch divide-x divide-gray-300`}
      >
        {weeks.map((week, idx) => (
          <WeekRow
            daysInView={daysInView}
            week={week}
            month={currentMonth}
            maxHeight={maxItemHeight}
            maxNumberOfEvents={maxNumberOfEvents}
            key={idx}
          />
        ))}
      </div>
    </div>
  );
}

MonthView.propTypes = exact({
  startOfMonth: PropTypes.instanceOf(Date).isRequired,
});

export default MonthView;
