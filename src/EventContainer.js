import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { Button } from "./Button";
import EventForm from "./EventForm";
import { EventContext } from "./EventContext";

dayjs.extend(isBetween);

function EventContainer({ events, date, displayForm, onCloseForm }) {
  const { onAddEvent, onDeleteEvent } = useContext(EventContext);

  const [chosenEvent, setChosenEvent] = useState(undefined);

  const choosePage = (calEvent) => {
    calEvent ? setChosenEvent(calEvent) : setChosenEvent(undefined);
  };
  function setCurrentPage() {
    if (displayForm) return "form";
    if (!chosenEvent && events) return "eventList";
    return "none";
  }

  function handleDeleteEvent(event) {
    setChosenEvent(undefined);
    onDeleteEvent(event);
  }

  const currentPage = setCurrentPage();
  const sortedEvents =
    events &&
    events.sort((a, b) => {
      const aTime = dayjs(a.time, "HH:mm");
      const bTime = dayjs(b.time, "HH:mm");

      return aTime - bTime;
    });
  return (
    <div className="flex flex-col flex-grow bg-gray-200 px-8 shadow-inner">
      <EventForm
        events={events}
        date={date}
        display={currentPage === "form"}
        onAddEvent={onAddEvent}
        onClose={onCloseForm}
      />
      {currentPage === "event" && (
        <EventDetails event={chosenEvent} onDeleteEvent={handleDeleteEvent} />
      )}
      <>
        {currentPage === "eventList" && (
          <EventList events={sortedEvents} onChooseEvent={choosePage} />
        )}
      </>
      <>
        {currentPage === "none" && (
          <div className="text-blue-700 text-2xl tracking-wider">
            No events today.
          </div>
        )}
      </>
    </div>
  );
}

function EventList({ events, onChooseEvent }) {
  const filterEventsBetween = (eventList, lowerLimit, upperLimit) => {
    if (!eventList) return false;
    return eventList.filter((event) => {
      const eventTime = dayjs(event.time, "HH:mm");
      return eventTime.isBetween(
        dayjs(lowerLimit, "HH:mm"),
        dayjs(upperLimit, "HH:mm"),
        null,
        "[)"
      );
    });
  };

  const morningEvents = filterEventsBetween(events, "00:00", "11:59");
  const afternoonEvents = filterEventsBetween(events, "12:00", "18:59");
  const eveningEvents = filterEventsBetween(events, "19:00", "23:59");

  return (
    <div className="grid grid-rows mt-10 mb-20">
      <EventCol
        events={morningEvents}
        onChooseEvent={onChooseEvent}
        title="Morning"
        isShown={morningEvents.length > 0}
      />
      <EventCol
        events={afternoonEvents}
        onChooseEvent={onChooseEvent}
        title="Afternoon"
        isShown={afternoonEvents.length > 0}
      />
      <EventCol
        events={eveningEvents}
        onChooseEvent={onChooseEvent}
        title="Evening"
        isShown={eveningEvents.length > 0}
      />
    </div>
  );
}

EventList.propTypes = {
  events: PropTypes.array,
  onChooseEvent: PropTypes.func.isRequired,
};

function EventCol({ events, title, onChooseEvent, isShown }) {
  return (
    <>
      {isShown && (
        <div className="mb-2">
          <div className="h-auto flex self-stretch">
            <ul className="block w-full space-y-2">
              <h2 className="pl-4 text-md text-blue-700">{title}</h2>
              {events &&
                events.map((event, idx) => (
                  <Event
                    key={idx}
                    event={event}
                    onChooseEvent={onChooseEvent}
                  />
                ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

EventCol.propTypes = {
  events: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  onChooseEvent: PropTypes.func.isRequired,
};

function Event({ event, onDeleteEvent }) {
  const [showDetails, setShowDetails] = useState(false);

  const eventTitleStyle = `flex items-center 
                 w-full h-auto 
                 py-2 px-4
                 rounded-lg
                 text-md text-gray-800
                 border-2 border-transparent 
                 hover:border-blue-600
                 cursor-pointer`;

  return (
    <li className="block bg-white rounded-lg shadow-sm">
      <div
        className={eventTitleStyle}
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="w-1/8 py-1 text-blue-700 font-semibold tracking-wider text-right">
          {event.time}
        </div>
        <div className="pl-4">{event.title}</div>
        <div className="flex flex-grow justify-end text-gray-400 hover:text-blue-600">
          <i class="gg-chevron-down"></i>
        </div>
      </div>
      {showDetails && (
        <EventDetails event={event} onDeleteEvent={onDeleteEvent} />
      )}
    </li>
  );
}

Event.propTypes = {
  event: PropTypes.object.isRequired,
  onChooseEvent: PropTypes.func.isRequired,
};

function EventDetails({ event, onDeleteEvent }) {
  return (
    <div className="m-2 flex flex-row justify-end pt-5 border-t border-gray-300 ">
      <DeleteButton callBack={() => onDeleteEvent(event)}>
        <i className="gg-trash"></i>
      </DeleteButton>
    </div>
  );
}

function DeleteButton({ children, callBack }) {
  const outlineStyle = `flex flex-row items-center
                 bg-transparent hover:bg-red-800
                 text-sm text-red-700 align-middle hover:text-white
                 py-2 px-4
                 border border-red-700 hover:border-transparent rounded
                 `;

  return (
    <Button callBack={callBack} css={outlineStyle}>
      {children}
    </Button>
  );
}

export default EventContainer;
