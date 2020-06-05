import React, { useState, useEffect, useContext, useRef } from "react";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import dayjs from "dayjs";
import { sortEvents, monthViewDays } from "./calendar";
import { chunk } from "./utils";
import Modal from "./Modal";
import DayModal from "./DayModal";
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
    const eventHeight = 22; // size of an event. Should be enough to define the max number of events to displey each day.
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

function WeekRow({ daysInView, week, month, maxHeight, maxNumberOfEvents }) {
  const titleRef = useRef();
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const finalHeight = maxHeight - titleRef.current.offsetHeight - 20;
    setContentHeight(finalHeight);
  }, [maxHeight]);

  return (
    <div
      className="grid grid-cols-7 items-start content-start relative border-b border-gray-300 pt-8 grid-flow-col-dense"
      ref={titleRef}
    >
      <WeekDays
        week={week}
        month={month}
        daysInView={daysInView}
        maxNumberOfEvents={maxNumberOfEvents}
      />
      {/*  I need the position of the event inside the week. Monday is 1, sunday is 7 */}
      {/* I also need the duration of the event */}
      {/*       {event.title} {event.position} duration: {event.duration} */}
      {/* date, month, events, maxHeight, maxNumberOfEvents */}
      <>
        {week.map((date, idx) => (
          <DailyEventList
            date={date}
            events={daysInView[date]}
            maxHeight={maxHeight}
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
  return (
    <div className="absolute top-0 h-full left-0 grid grid-cols-7 w-full divide-x divide-gray-300 z-0">
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
      "text-gray-500 hover:text-gray-700 hover:bg-gray-100 hover:bg-opacity-50",
    today: "text-blue-600 bg-blue-100 hover:bg-blue-200 hover:bg-opacity-50",
    future: "text-gray-700 hover:bg-gray-100 hover:bg-opacity-50",
  };

  const currentStyle = styles[chooseStyle()];

  const sortedEvents = sortEvents(events);
  return (
    <>
      <div
        className={`${currentStyle} relative p-2 border-b border-b-500 cursor-pointer`}
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

const DisplayContents = ({ children }) => {
  return (
    <div className="overflow-hidden text-xs" style={{ display: "contents" }}>
      {children}
    </div>
  );
};

function DailyEventList({
  date,
  events,
  maxHeight,
  maxNumberOfEvents,
  gridPosition,
}) {
  const sortedEvents = sortEvents(events);

  return (
    <DisplayContents>
      <EventList
        date={date}
        events={sortedEvents}
        contentHeight={maxHeight}
        maxNumberOfEvents={maxNumberOfEvents}
        gridPosition={gridPosition}
      />
    </DisplayContents>
  );
}

function EventList({
  date,
  events,
  contentHeight,
  maxNumberOfEvents,
  gridPosition,
}) {
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
      className={`flex mx-2 p-2 col-start-${gridPosition} col-span-1  truncate`}
      key={event.id}
    >
      {dayjs(event.start.datetime).format("HH:mm")} {event.title}
    </div>
  );
}

function AllDayEvent({ event, gridPosition, display }) {
  return (
    <>
      {display && (
        <div
          className={`mx-2 p-2 col-start-${gridPosition} col-span-${event.duration} truncate bg-gray-200 border border-gray-400 py-1 px-2 mb-1 rounded`}
          key={event.id}
        >
          {event.title} {event.position}
        </div>
      )}
    </>
  );
}

// function MonthDay({ date, month, events, maxHeight, maxNumberOfEvents }) {
//   const [showModal, setShowModal] = useState(false);
//   const [contentHeight, setContentHeight] = useState(0);
//   const titleRef = useRef();
//   const monthDay = dayjs(date).date();

//   const remainingEventsNumber =
//     events && maxNumberOfEvents < events.length
//       ? events.length - maxNumberOfEvents
//       : undefined;

//   const sortedEvents = sortEvents(events);

//   const chooseStyle = () => {
//     const today = dayjs().startOf("day");
//     const currentDate = dayjs(date).startOf("day");
//     if (month !== currentDate.month() || currentDate.isBefore(today))
//       return "past";
//     if (currentDate.isSame(today)) return "today";
//     return "future";
//   };

//   const styles = {
//     past: "text-gray-500 hover:text-gray-700 hover:bg-gray-100",
//     today: "text-blue-600 bg-blue-100 hover:bg-blue-200 hover:bg-opacity-50",
//     future: "text-gray-700 hover:bg-gray-100",
//   };

//   const currentStyle = styles[chooseStyle()];

//   useEffect(() => {
//     const finalHeight = maxHeight - titleRef.current.offsetHeight - 20;
//     setContentHeight(finalHeight);
//   }, [maxHeight]);

//   const closeModal = () => setShowModal(false);
//   return (
//     <>
//       <div
//         className={`${currentStyle} relative p-2 border-b border-b-500 cursor-pointer`}
//         onClick={() => setShowModal(true)}
//       >
//         <div className={`text-md font-semibold`} ref={titleRef}>
//           {monthDay}
//         </div>
//         <EventList
//           events={sortedEvents}
//           contentHeight={contentHeight}
//           maxNumberOfEvents={maxNumberOfEvents}
//         />
//         <RemainingEventsNumber
//           remainingEventsNumber={remainingEventsNumber}
//           isShown={!!remainingEventsNumber}
//         />
//       </div>
//       <Modal showModal={showModal} onCloseModal={closeModal}>
//         <DayModal date={date} events={sortedEvents} />
//       </Modal>
//     </>
//   );
// }
// MonthDay.propTypes = exact({
//   date: PropTypes.instanceOf(Date).isRequired,
//   month: PropTypes.string.isRequired,
//   events: PropTypes.array.isRequired,
//   maxHeight: PropTypes.number.isRequired,
//   maxNumberOfEvents: PropTypes.number.isRequired,
// });

function RemainingEventsNumber({ remainingEventsNumber, isShown }) {
  return (
    <>
      {isShown && (
        <div className="absolute bottom-0 left-0 flex w-full justify-end text-xs font-semibold text-gray-600 py-1 px-2">
          + {remainingEventsNumber}
        </div>
      )}
    </>
  );
}

RemainingEventsNumber.propTypes = exact({
  remainingEventsNumber: PropTypes.number,
  isShown: PropTypes.bool.isRequired,
});

export default MonthView;
