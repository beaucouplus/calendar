import React, { useEffect, useState, useRef } from "react";
// proptypes
import PropTypes from "prop-types";
import exact from "prop-types-exact";
// js scripts
import dayjs from "dayjs";
import { sortEvents } from "./calendar";
import { range } from "./utils";
// modal
import Modal from "./Modal";
import DayModal from "./DayModal";

function WeekRow({ eventsPerDay, week, month, maxNumberOfEvents }) {
  return (
    <div className="grid grid-cols-7 content-start row-gap-1 relative pt-8 grid-flow-col-dense">
      <>
        {week.map((date) => (
          <DailyEventList
            date={date}
            eventsPerDay={eventsPerDay}
            maxNumberOfEvents={maxNumberOfEvents}
            key={date}
          />
        ))}
      </>
      <WeekDays
        week={week}
        month={month}
        eventsPerDay={eventsPerDay}
        maxNumberOfEvents={maxNumberOfEvents}
      />
    </div>
  );
}

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
    if (
      month !== currentDate.month() ||
      (currentDate.isBefore(today) && month === today.month())
    )
      return "past";
    if (currentDate.isSame(today)) return "today";
    return "future";
  };

  const styles = {
    past:
      "text-gray-500 bg-gray-400 bg-opacity-25 hover:text-gray-700 hover:bg-gray-500 hover:bg-opacity-25",
    today:
      "text-blue-600 bg-blue-300 bg-opacity-25 hover:bg-blue-400 hover:bg-opacity-25",
    future:
      "bg-white bg-opacity-25 text-gray-700 hover:bg-gray-300 hover:bg-opacity-25 hover:text-black",
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
        <RemainingEventsNumber
          remainingEventsNumber={remainingEventsNumber}
          isShown={!!remainingEventsNumber}
        />
      </div>
      <Modal showModal={showModal} onCloseModal={closeModal}>
        <DayModal date={day} />
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

function DailyEventList({ date, eventsPerDay, maxNumberOfEvents }) {
  const sortedEvents = sortEvents(eventsPerDay[date]);
  // note: works because Sunday is the first day of the week and Monday has index 1
  const gridPosition = dayjs(date).day();
  const eventStyle = `col-start-${gridPosition} mx-2 py-1 px-2 border rounded truncate cursor-pointer z-10 hover:bg-orange-300 hover:border-orange-400`;

  return (
    <>
      <div className="contents text-xs">
        {sortedEvents &&
          sortedEvents
            .slice(0, maxNumberOfEvents)
            .map((event) =>
              event.allDay ? (
                <AllDayEvent
                  date={date}
                  event={event}
                  key={event.id}
                  display={event.displayed}
                  css={eventStyle}
                />
              ) : (
                <TimedEvent
                  date={date}
                  event={event}
                  key={event.id}
                  css={eventStyle}
                />
              )
            )}
      </div>
    </>
  );
}

function TimedEvent({ date, event, css }) {
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);
  const [chosenEventId, setChosenEventId] = useState(undefined);

  const chooseStyle = () => {
    const today = dayjs().startOf("day");
    const currentDate = dayjs(date).startOf("day");
    if (currentDate.isSame(today)) return "today";
    return "future";
  };

  const eventStyle = { today: `border-blue-300 bg-blue-200` };
  const currentColors = eventStyle[chooseStyle()];
  const handleClick = () => {
    setShowModal(true);
    setChosenEventId(event.id);
  };

  return (
    <>
      <div
        className={`${css} col-span-1 border-gray-400 ${currentColors} `}
        key={event.id}
        onClick={handleClick}
      >
        {dayjs(event.start.datetime).format("HH:mm")} {event.title}
      </div>
      <Modal showModal={showModal} onCloseModal={closeModal}>
        <DayModal date={date} chosenEventId={chosenEventId} />
      </Modal>
    </>
  );
}

function AllDayEvent({ date, event, events, display, css }) {
  const remainingDuration = event.duration - event.position + 1;

  const currentWeekDayIndex = dayjs(date).day();
  const remainingDaysUntilEndOfWeek =
    currentWeekDayIndex + remainingDuration > 7
      ? 7 - currentWeekDayIndex + 1
      : remainingDuration;

  const weeklyRemainingDays = range(0, remainingDaysUntilEndOfWeek - 1).map(
    (daysNumber) => {
      const newDate = dayjs(date, "YYYY-MM-DD").add(daysNumber, "day");
      return {
        date: newDate.format("YYYY-MM-DD"),
        position: event.position + daysNumber,
      };
    }
  );

  return (
    <>
      {display && (
        <>
          <div
            className={`${css} col-span-${remainingDuration} bg-indigo-100 border-indigo-200 relative`}
            key={event.id}
          >
            <div
              className={`absolute gap-2 top-0 left-0  grid grid-cols-${remainingDaysUntilEndOfWeek} w-full h-full`}
            >
              {weeklyRemainingDays.map((day) => (
                <AllDayEventPart
                  day={day}
                  events={events}
                  event={event}
                  key={day.date}
                />
              ))}
            </div>
            {event.title}
          </div>
        </>
      )}
    </>
  );
}

function AllDayEventPart({ day, event }) {
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);
  const [chosenEventId, setChosenEventId] = useState(undefined);

  const handleClick = () => {
    setShowModal(true);
    setChosenEventId(event.id);
  };

  return (
    <>
      <div
        className={`border-b-4 border-transparent hover:border-orange-400 first:mx-2 last:mx-2`}
        onClick={() => handleClick()}
      >
        &nbsp;
      </div>
      <Modal showModal={showModal} onCloseModal={closeModal}>
        <DayModal date={day.date} chosenEventId={chosenEventId} />
      </Modal>
    </>
  );
}

export default WeekRow;
