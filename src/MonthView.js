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
  const weekRowsContainer = useRef();
  const [maxNumberOfEvents, setMaxNumberOfEvents] = useState(0);

  const eventsPerDay = monthViewDays(startOfMonth, events);
  const currentMonth = dayjs(startOfMonth).month();

  const daysList = Object.keys(eventsPerDay);
  const eventsPerDaySize = daysList.length;

  const weeks = chunk(daysList, 7);

  useEffect(() => {
    const maxHeight = Math.round(
      weekRowsContainer.current.offsetHeight / (eventsPerDaySize / 7)
    );
    const eventHeight = 34; // size of an event. Should be enough to define the max number of events to displey each day.
    const maxEventsSize = Math.floor(maxHeight / eventHeight) - 1;
    setMaxNumberOfEvents((x) => maxEventsSize);
  }, [startOfMonth, eventsPerDaySize]);

  return (
    <div className={`flex flex-col flex-grow h-full border-t border-gray-500`}>
      <WeekDayTitles />
      <div
        ref={weekRowsContainer}
        className={`grid grid-rows-${weeks.length} h-full items-stretch divide-x divide-gray-300`}
      >
        {weeks.map((week, idx) => (
          <WeekRow
            eventsPerDay={eventsPerDay}
            week={week}
            month={currentMonth}
            maxNumberOfEvents={maxNumberOfEvents}
            key={idx}
          />
        ))}
      </div>
    </div>
  );
}

function WeekDayTitles() {
  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return (
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
  );
}

MonthView.propTypes = exact({
  startOfMonth: PropTypes.instanceOf(Date).isRequired,
});

export default MonthView;
