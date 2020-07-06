import React from "react";

// PACKAGES
import PropTypes from "prop-types";
import exact from "prop-types-exact";

// SCRIPTS
import { sortEvents } from "../../../common/calendar";

// COMPONENTS
import EventSummary from "./EventSummary";
import WeekDay from "./WeekDay";

function WeekRow({ datesToEvents, weekDates, month, maxNumberOfEvents }) {
  return (
    <div className="grid grid-cols-7 content-start row-gap-1 relative pt-8 grid-flow-col-dense">
      <>
        {weekDates.map((date) => (
          <DailyEventList date={date} events={datesToEvents[date]} maxNumberOfEvents={maxNumberOfEvents} key={date} />
        ))}
      </>
      <WeekDays
        weekDates={weekDates}
        month={month}
        datesToEvents={datesToEvents}
        maxNumberOfEvents={maxNumberOfEvents}
      />
    </div>
  );
}
WeekRow.propTypes = exact({
  datesToEvents: PropTypes.object.isRequired,
  weekDates: PropTypes.array.isRequired,
  month: PropTypes.number.isRequired,
  maxNumberOfEvents: PropTypes.number.isRequired,
});

function WeekDays({ weekDates, month, datesToEvents, maxNumberOfEvents }) {
  return (
    <div className="absolute top-0 h-full left-0 grid grid-cols-7 w-full divide-x divide-gray-300">
      {weekDates.map((weekDay) => (
        <WeekDay
          date={weekDay}
          events={datesToEvents[weekDay]}
          month={month}
          maxNumberOfEvents={maxNumberOfEvents}
          key={weekDay}
        />
      ))}
    </div>
  );
}

WeekDays.propTypes = exact({
  weekDates: PropTypes.array.isRequired,
  month: PropTypes.number.isRequired,
  datesToEvents: PropTypes.object.isRequired,
  maxNumberOfEvents: PropTypes.number.isRequired,
});

function DailyEventList({ date, events, maxNumberOfEvents }) {
  const sortedEvents = sortEvents(events);

  return (
    <>
      <div className="contents text-xs">
        {sortedEvents &&
          sortedEvents
            .slice(0, maxNumberOfEvents)
            .map((event) => <EventSummary date={date} event={event} key={event.id} />)}
      </div>
    </>
  );
}
DailyEventList.propTypes = exact({
  date: PropTypes.string.isRequired,
  events: PropTypes.array,
  maxNumberOfEvents: PropTypes.number.isRequired,
});

export default WeekRow;
