import React, { useState } from "react";
import { groupEventsByDateAndType } from "./calendar";
import seeds from "./seeds";

const EventContext = React.createContext();

function EventStore({ children }) {
  const [events, setEvents] = useState(seeds);
  const [eventID, setEventID] = useState(seeds.length);
  const [modalStatus, setModalStatus] = useState({ displayed: false, date: null, chosenEventId: null });
  const eventsByDate = groupEventsByDateAndType(events);

  const displayModal = (date) => {
    setModalStatus({ date, displayed: true, chosenEventId: null });
  };

  const displayModalAndChooseEvent = (date, eventId) => {
    setModalStatus({ date, displayed: true, chosenEventId: eventId });
  };

  const closeModal = () => {
    setModalStatus({ displayed: false, date: null, chosenEventId: null });
  };

  function addEvent(event) {
    setEventID(eventID + 1);
    const newEvent = { ...event, id: eventID };
    const newEvents = [...events, newEvent];
    setEvents(newEvents);
  }

  function deleteEvent(event) {
    const remainingEvents = events.filter((e) => e.id !== event.id);
    setEvents(remainingEvents);
  }

  return (
    <EventContext.Provider
      value={{
        events: events,
        onAddEvent: addEvent,
        onDeleteEvent: deleteEvent,
        eventsByDate: eventsByDate,
        displayModal,
        closeModal,
        displayModalAndChooseEvent,
        modalStatus,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export { EventContext, EventStore };
