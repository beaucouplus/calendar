import React, { useState, useEffect } from "react";

// PACKAGES
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import dayjs from "dayjs";

// SCRIPTS
import { range } from "../../../common/utils";

// COMPONENTS
import Modal from "../../modal/Modal";
import DayModal from "../day_view/DayModal";

function EventSummary({ date, event }) {
  const [showModal, setShowModal] = useState(false);
  const [chosenEventId, setChosenEventId] = useState(undefined);
  const [modalDate, setModalDate] = useState(date);

  useEffect(() => console.log(showModal, chosenEventId));

  const handleClick = (newDate) => {
    newDate && setModalDate(newDate);

    setShowModal(true);
    setChosenEventId(event.id);
  };

  const closeModal = () => setShowModal(false);

  const weekDay = dayjs(date).day();
  const gridPosition = weekDay === 0 ? 7 : weekDay;
  const eventStyle = `col-start-${gridPosition} 
                        mx-2 py-1 px-2 border rounded truncate 
                        cursor-pointer z-10 
                        hover:bg-orange-300 hover:border-orange-400`;

  return (
    <>
      {event.allDay ? (
        <AllDayEvent
          date={date}
          event={event}
          key={event.id}
          display={event.displayed}
          css={eventStyle}
          onHandleClick={handleClick}
        />
      ) : (
        <TimedEvent date={date} event={event} key={event.id} css={eventStyle} onHandleClick={handleClick} />
      )}
      <Modal showModal={showModal} onCloseModal={closeModal}>
        <DayModal date={modalDate} chosenEventId={chosenEventId} />
      </Modal>
    </>
  );
}

EventSummary.propTypes = exact({
  date: PropTypes.string.isRequired,
  event: PropTypes.object.isRequired,
});

function TimedEvent({ date, event, css, onHandleClick }) {
  const chooseStyle = () => {
    const today = dayjs().startOf("day");
    const currentDate = dayjs(date).startOf("day");
    if (currentDate.isSame(today)) return "today";
    return "future";
  };

  const handleClick = () => onHandleClick(date);

  const eventStyle = { today: `border-blue-300 bg-blue-200` };
  const currentColors = eventStyle[chooseStyle()];

  return (
    <div className={`${css} col-span-1 border-gray-400 ${currentColors} `} key={event.id} onClick={handleClick}>
      {dayjs(event.start.datetime).format("HH:mm")} {event.title}
    </div>
  );
}

TimedEvent.propTypes = exact({
  date: PropTypes.string.isRequired,
  event: PropTypes.object.isRequired,
  css: PropTypes.string.isRequired,
  onHandleClick: PropTypes.func.isRequired,
});

function AllDayEvent({ date, event, display, css, onHandleClick }) {
  const remainingDuration = event.duration - event.position;

  const weekDay = dayjs(date).day();
  const currentWeekDayIndex = weekDay === 0 ? 7 : weekDay;

  const remainingDaysUntilEndOfWeek =
    currentWeekDayIndex + remainingDuration > 7 ? 7 - currentWeekDayIndex + 1 : remainingDuration + 1;

  const weeklyRemainingDays = range(0, remainingDaysUntilEndOfWeek - 1).map((daysNumber) => {
    const newDate = dayjs(date, "YYYY-MM-DD").add(daysNumber, "day");
    return {
      date: newDate.format("YYYY-MM-DD"),
      position: event.position + daysNumber,
    };
  });

  return (
    <>
      {display && (
        <>
          <div
            className={`${css} col-span-${remainingDaysUntilEndOfWeek} bg-indigo-100 border-indigo-200 relative`}
            key={event.id}
          >
            <div className={`absolute gap-2 top-0 left-0  grid grid-cols-${remainingDaysUntilEndOfWeek} w-full h-full`}>
              {weeklyRemainingDays.map((day) => (
                <AllDayEventPart day={day} event={event} key={day.date} onHandleClick={onHandleClick} />
              ))}
            </div>
            {event.title}
          </div>
        </>
      )}
    </>
  );
}

AllDayEvent.propTypes = exact({
  date: PropTypes.string.isRequired,
  event: PropTypes.object.isRequired,
  display: PropTypes.bool.isRequired,
  css: PropTypes.string.isRequired,
  onHandleClick: PropTypes.func.isRequired,
});

function AllDayEventPart({ day, onHandleClick }) {
  const handleClick = () => {
    onHandleClick(day.date);
  };

  return (
    <>
      <div
        className={`border-b-4 border-transparent hover:border-orange-400 first:mx-2 last:mx-2`}
        onClick={handleClick}
      >
        &nbsp;
      </div>
    </>
  );
}

AllDayEventPart.propTypes = exact({
  day: PropTypes.object.isRequired,
  event: PropTypes.object.isRequired,
});

export default EventSummary;
