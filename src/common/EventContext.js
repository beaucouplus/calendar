import React, { useState, useReducer } from "react";
import { groupEventsByDateAndType } from "./calendar";
import seeds from "./seeds";

function modalReducer(state, action) {
  switch (action.type) {
    case "display":
      return { date: action.date, displayed: true, chosenEventId: null };
    case "chooseEvent":
      return { date: action.date, displayed: true, chosenEventId: action.eventId };
    case "close":
      return { date: null, displayed: false, chosenEventId: null };
    default:
      return state;
  }
}

function useModal() {
  const [status, dispatch] = useReducer(modalReducer, { displayed: false, date: null, chosenEventId: null });

  function display(date) {
    dispatch({ type: "display", date });
  }

  const chooseEvent = (date, eventId) => {
    dispatch({ type: "chooseEvent", date, eventId });
  };

  const close = () => {
    dispatch({ type: "close" });
  };

  return { status, display, chooseEvent, close };
}

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
