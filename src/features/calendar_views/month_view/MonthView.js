import React, { useState, useEffect, useContext, useRef } from "react";

// PACKAGES
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import dayjs from "dayjs";

// CONTEXT
import { EventContext } from "../../../common/EventContext";

// SCRIPTS
import { monthViewDays } from "../../../common/calendar";
import { chunk } from "../../../common/utils";

// COMPONENTS
import WeekRow from "./WeekRow";

function MonthView({ startOfMonth }) {
  const { eventsByDate } = useContext(EventContext);
  const weekRowsContainer = useRef();
  const [maxNumberOfEvents, setMaxNumberOfEvents] = useState(0);

  const datesToEvents = monthViewDays(startOfMonth, eventsByDate);
  const currentMonth = dayjs(startOfMonth, "YYYY-MM-DD").month();

  const dateList = Object.keys(datesToEvents);
  const eventsPerDaySize = dateList.length;

  const datesGroupedByWeek = chunk(dateList, 7);

  useEffect(() => {
    const maxHeight = Math.round(weekRowsContainer.current.offsetHeight / (eventsPerDaySize / 7));
    const eventHeight = 34; // size of an event. Should be enough to define the max number of events to displey each day.
    const maxEventsSize = Math.floor(maxHeight / eventHeight) - 1;
    setMaxNumberOfEvents((x) => maxEventsSize);
  }, [startOfMonth, eventsPerDaySize]);

  return (
    <>
      <div className={`flex flex-col flex-grow h-full border-t border-gray-500`}>
        <WeekDayTitles />
        <div
          ref={weekRowsContainer}
          className={`grid grid-rows-${datesGroupedByWeek.length} h-full items-stretch divide-x divide-gray-300`}
        >
          {datesGroupedByWeek.map((weekDates, idx) => (
            <WeekRow
              datesToEvents={datesToEvents}
              weekDates={weekDates}
              month={currentMonth}
              maxNumberOfEvents={maxNumberOfEvents}
              key={idx}
            />
          ))}
        </div>
      </div>
    </>
  );
}

MonthView.propTypes = exact({
  startOfMonth: PropTypes.string.isRequired,
});

function WeekDayTitles() {
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  return (
    <div className="grid grid-cols-7 divide-x divide-gray-300 border-b border-gray-300">
      {weekDays.map((wDay) => (
        <div className="px-2 py-2 text-md font-semibold text-gray-800" key={wDay}>
          {wDay}
        </div>
      ))}
    </div>
  );
}

export default MonthView;
