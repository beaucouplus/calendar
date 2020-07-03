import React, { useState, useRef, useEffect } from "react";

// PACKAGES
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import dayjs from "dayjs";

// SCRIPTS
import { sortEvents } from "../../../common/calendar";

// COMPONENTS
import Modal from "../../modal/Modal";
import DayModal from "../day_view/DayModal";
import EventSummary from "./EventSummary";

function WeekRow({ eventsPerDay, week, month, maxNumberOfEvents }) {
  return (
    <div className="grid grid-cols-7 content-start row-gap-1 relative pt-8 grid-flow-col-dense">
      <>
        {week.map((date) => (
          <DailyEventList date={date} events={eventsPerDay[date]} maxNumberOfEvents={maxNumberOfEvents} key={date} />
        ))}
      </>
      <WeekDays week={week} month={month} eventsPerDay={eventsPerDay} maxNumberOfEvents={maxNumberOfEvents} />
    </div>
  );
}
WeekRow.propTypes = exact({
  eventsPerDay: PropTypes.object.isRequired,
  week: PropTypes.array.isRequired,
  month: PropTypes.number.isRequired,
  maxNumberOfEvents: PropTypes.number.isRequired,
});

function WeekDays({ week, month, eventsPerDay, maxNumberOfEvents }) {
  return (
    <div className="absolute top-0 h-full left-0 grid grid-cols-7 w-full divide-x divide-gray-300">
      {week.map((weekDay) => (
        <WeekDay
          day={weekDay}
          events={eventsPerDay[weekDay]}
          month={month}
          maxNumberOfEvents={maxNumberOfEvents}
          key={weekDay}
        />
      ))}
    </div>
  );
}

WeekDays.propTypes = exact({
  week: PropTypes.array.isRequired,
  month: PropTypes.number.isRequired,
  eventsPerDay: PropTypes.object.isRequired,
  maxNumberOfEvents: PropTypes.number.isRequired,
});

const WeekDay = ({ day, month, events, maxNumberOfEvents }) => {
  const remainingEventsNumber =
    events && maxNumberOfEvents < events.length ? events.length - maxNumberOfEvents : undefined;

  const monthDay = dayjs(day).date();
  const titleRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);

  const chooseStyle = () => {
    const today = dayjs().startOf("day");
    const currentDate = dayjs(day).startOf("day");
    if (month !== currentDate.month() || (currentDate.isBefore(today) && month === today.month())) return "past";
    if (currentDate.isSame(today)) return "today";
    return "future";
  };

  const styles = {
    past: "text-gray-500 bg-gray-400 bg-opacity-25 hover:text-gray-700 hover:bg-gray-500 hover:bg-opacity-25",
    today: "text-blue-600 bg-blue-300 bg-opacity-25 hover:bg-blue-400 hover:bg-opacity-25",
    future: "bg-white bg-opacity-25 text-gray-700 hover:bg-gray-300 hover:bg-opacity-25 hover:text-black",
  };

  const currentStyle = styles[chooseStyle()];

  return (
    <>
      <div
        className={`${currentStyle} relative px-2 py-2 border-b border-b-500 cursor-pointer`}
        onClick={() => setShowModal(true)}
      >
        <div className={`text-md font-semibold`} ref={titleRef}>
          {monthDay}
        </div>
        <RemainingEventsNumber remainingEventsNumber={remainingEventsNumber} isShown={!!remainingEventsNumber} />
      </div>
      <Modal showModal={showModal} onCloseModal={closeModal}>
        <DayModal date={day} />
      </Modal>
    </>
  );
};

WeekDay.propTypes = exact({
  day: PropTypes.string.isRequired,
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
