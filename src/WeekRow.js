import React, { useEffect, useState, useRef } from "react";
// proptypes
import PropTypes from "prop-types";
import exact from "prop-types-exact";
// js scripts
import dayjs from "dayjs";
import { sortEvents } from "./calendar";
// modal
import Modal from "./Modal";
import DayModal from "./DayModal";

function WeekRow({ daysInView, week, month, maxHeight, maxNumberOfEvents }) {
  const titleRef = useRef();
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const finalHeight = maxHeight - titleRef.current.offsetHeight - 20;
    setContentHeight(finalHeight);
  }, [maxHeight]);

  return (
    <div
      className="grid grid-cols-7 content-start row-gap-1 relative pt-8 grid-flow-col-dense"
      ref={titleRef}
    >
      <WeekDays
        week={week}
        month={month}
        daysInView={daysInView}
        maxNumberOfEvents={maxNumberOfEvents}
        maxHeight={contentHeight}
      />
      <>
        {week.map((date, idx) => (
          <DailyEventList
            date={date}
            events={daysInView[date]}
            gridPosition={idx + 1}
            maxNumberOfEvents={maxNumberOfEvents}
            key={date}
          />
        ))}
      </>
    </div>
  );
}

function WeekDays({ week, month, daysInView, maxNumberOfEvents, maxHeight }) {
  useEffect(() => console.log(maxHeight));

  return (
    <div className="absolute top-0 h-full left-0 grid grid-cols-7 w-full divide-x divide-gray-300">
      {week.map((weekDay) => (
        <WeekDay
          day={weekDay}
          events={daysInView[weekDay]}
          month={month}
          maxNumberOfEvents={maxNumberOfEvents}
          maxHeight={maxHeight}
          key={weekDay}
        />
      ))}
    </div>
  );
}

const WeekDay = ({ day, month, events, maxNumberOfEvents }) => {
  const remainingEventsNumber =
    events && maxNumberOfEvents < events.length
      ? events.length - maxNumberOfEvents
      : undefined;

  const monthDay = dayjs(day).date();
  const titleRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);

  const chooseStyle = () => {
    const today = dayjs().startOf("day");
    const currentDate = dayjs(day).startOf("day");
    if (month !== currentDate.month() || currentDate.isBefore(today))
      return "past";
    if (currentDate.isSame(today)) return "today";
    return "future";
  };

  const styles = {
    past:
      "text-gray-500 hover:text-gray-700 hover:bg-yellow-300 hover:bg-opacity-50",
    today:
      "text-blue-600 bg-blue-200 bg-opacity-50 hover:bg-blue-200 hover:bg-opacity-50",
    future: "text-gray-700 hover:bg-yellow-300 hover:bg-opacity-50",
  };

  const currentStyle = styles[chooseStyle()];

  const sortedEvents = sortEvents(events);
  return (
    <>
      <div
        className={`${currentStyle} relative px-2 py-2 border-b border-b-500 cursor-pointer`}
        onClick={() => setShowModal(true)}
      >
        <div className={`text-md font-semibold`} ref={titleRef}>
          {monthDay}
        </div>
        <RemainingEventsNumber
          remainingEventsNumber={remainingEventsNumber}
          isShown={!!remainingEventsNumber}
        />
      </div>
      <Modal showModal={showModal} onCloseModal={closeModal}>
        <DayModal date={day} events={sortedEvents} />
      </Modal>
    </>
  );
};

function RemainingEventsNumber({ remainingEventsNumber, isShown }) {
  return (
    <>
      {isShown && (
        <div className="absolute bottom-0 left-0 flex justify-end w-full">
          <div className="text-xs font-semibold text-gray-600 pr-2">
            + {remainingEventsNumber}
          </div>
        </div>
      )}
    </>
  );
}

RemainingEventsNumber.propTypes = exact({
  remainingEventsNumber: PropTypes.number,
  isShown: PropTypes.bool.isRequired,
});

function DailyEventList({ date, events, maxNumberOfEvents, gridPosition }) {
  const sortedEvents = sortEvents(events);

  return (
    <div className="contents text-xs">
      <EventList
        date={date}
        events={sortedEvents}
        maxNumberOfEvents={maxNumberOfEvents}
        gridPosition={gridPosition}
      />
    </div>
  );
}

function EventList({ date, events, maxNumberOfEvents, gridPosition }) {
  useEffect(() => console.log(events));

  return (
    <>
      {events &&
        events
          .slice(0, maxNumberOfEvents)
          .map((event) =>
            event.allDay ? (
              <AllDayEvent
                event={event}
                key={event.id}
                gridPosition={gridPosition}
                display={
                  event.position === 1 ||
                  dayjs(date).format("dddd") === "Monday"
                }
              />
            ) : (
              <TimedEvent
                event={event}
                key={event.id}
                gridPosition={gridPosition}
              />
            )
          )}
    </>
  );
}

function TimedEvent({ event, gridPosition }) {
  return (
    <div
      className={`mx-2 py-1 px-2 bg-white border border-gray-300 rounded col-start-${gridPosition} col-span-1 truncate z-10 cursor-pointer`}
      key={event.id}
    >
      {dayjs(event.start.datetime).format("HH:mm")} {event.title}
    </div>
  );
}

function AllDayEvent({ event, gridPosition, display }) {
  const remainingDuration = event.duration - event.position;
  return (
    <>
      {display && (
        <div
          className={`mx-2 py-1 px-2 col-start-${gridPosition} col-span-${remainingDuration} truncate bg-gray-200 border border-gray-400 rounded z-10 cursor-pointer`}
          key={event.id}
        >
          {event.title}
        </div>
      )}
    </>
  );
}

export default WeekRow;
