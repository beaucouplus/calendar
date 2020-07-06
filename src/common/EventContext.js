import React, { useState, useReducer } from "react";
import { groupEventsByDateAndType } from "./calendar";
import seeds from "./seeds";
import useModal from "../features/modal/useModal";

const EventContext = React.createContext();

function EventStore({ children }) {
  const [events, setEvents] = useState(seeds);
  const [eventID, setEventID] = useState(seeds.length);
  const eventsByDate = groupEventsByDateAndType(events);
  const modal = useModal();

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
        modal: modal,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export { EventContext, EventStore };
