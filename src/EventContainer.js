import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import EventForm from "./EventForm";
import Event from "./Event";
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
      <>
        {currentPage === "eventList" && (
          <EventList
            events={sortedEvents}
            onChooseEvent={choosePage}
            onDeleteEvent={onDeleteEvent}
          />
        )}
      </>
      <>
        {currentPage === "none" && (
          <div className="mt-10 text-blue-700 text-2xl tracking-wider">
            No events today.
          </div>
        )}
      </>
    </div>
  );
}

function EventList({ events, onChooseEvent, onDeleteEvent }) {
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
        onDeleteEvent={onDeleteEvent}
        title="Morning"
        isShown={morningEvents.length > 0}
      />
      <EventCol
        events={afternoonEvents}
        onChooseEvent={onChooseEvent}
        onDeleteEvent={onDeleteEvent}
        title="Afternoon"
        isShown={afternoonEvents.length > 0}
      />
      <EventCol
        events={eveningEvents}
        onChooseEvent={onChooseEvent}
        onDeleteEvent={onDeleteEvent}
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

function EventCol({ events, title, onChooseEvent, isShown, onDeleteEvent }) {
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
                    onDeleteEvent={onDeleteEvent}
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

export default EventContainer;
