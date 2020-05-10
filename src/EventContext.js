import React, { useState } from "react";
import { dummyEvents } from "./calendar";

const EventContext = React.createContext();

function EventStore({ children }) {
  const [events, setEvents] = useState(dummyEvents);

  function addEvent(event) {
    const newEvent = { ...event, id: events.length + 1 };
    setEvents([...events, newEvent]);
  }

  function deleteEvent(event) {
    setEvents(events.filter((e) => e.id !== event.id));
  }
  return (
    <EventContext.Provider
      value={{
        events: events,
        onAddEvent: addEvent,
        onDeleteEvent: deleteEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export { EventContext, EventStore };
