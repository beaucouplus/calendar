import React, { useState } from "react";
import { groupEventsByDate } from "./calendar";

const dummyEvents = [
  {
    id: 1,
    start: { date: null, datetime: "2020-07-01T11:00:00+02:00" },
    end: { date: null, datetime: "2020-07-01T15:00:00+02:00" },
    title: "go to the beach",
  },
  {
    id: 2,
    start: { date: null, datetime: "2020-07-01T17:00:00+02:00" },
    end: { date: null, datetime: "2020-07-01T21:00:00+02:00" },
    title: "play FF7 with Ryan and Simon",
  },
  {
    id: 3,
    start: { date: null, datetime: "2020-07-01T19:00:00+02:00" },
    end: { date: null, datetime: "2020-07-01T23:00:00+02:00" },
    title: "Drinks with Natasha and Pepito at the hacienda near the cemetery.",
  },

  {
    id: 4,
    start: { date: null, datetime: "2020-07-09T09:00:00+02:00" },
    end: { date: null, datetime: "2020-07-09T12:00:00+02:00" },
    title: "work from home",
  },
  {
    id: 5,
    start: { date: null, datetime: "2020-07-09T15:00:00+02:00" },
    end: { date: null, datetime: "2020-07-09T19:00:00+02:00" },
    title: "summer party with the cascados",
  },
  {
    id: 6,
    start: { date: null, datetime: "2020-07-17T13:00:00+02:00" },
    end: { date: null, datetime: "2020-07-17T14:30:00+02:00" },
    title: "hamburgers with Daniel",
  },
  {
    id: 7,
    start: { date: null, datetime: "2020-07-17T21:00:00+02:00" },
    end: { date: null, datetime: "2020-07-18T:02:00+02:00" },
    title: "Night out at the Hacienda as usual",
  },
  {
    id: 8,
    start: { date: null, datetime: "2020-07-21T15:00:00+02:00" },
    end: { date: null, datetime: "2020-07-21T17:00:00+02:00" },
    title: "Chill at home",
  },
  {
    id: 9,
    start: { date: null, datetime: "2020-07-21T17:00:00+02:00" },
    end: { date: null, datetime: "2020-07-21T19:00:00+02:00" },
    title: "Double chill at home, netflix night",
  },
  {
    id: 10,
    start: { date: null, datetime: "2020-07-17T18:00:00+02:00" },
    end: { date: null, datetime: "2020-07-17T18:15:00+02:00" },
    title: "Toilet time",
  },
  {
    id: 11,
    start: { date: null, datetime: "2020-07-21T19:00:00+02:00" },
    end: { date: null, datetime: "2020-07-21T19:00:00+02:00" },
    title: "Nap time",
  },
  {
    id: 12,
    start: { date: null, datetime: "2020-07-30T10:00:00+02:00" },
    end: { date: null, datetime: "2020-07-30T11:00:00+02:00" },
    title: "coffee at la pata negra",
  },
  {
    id: 13,
    start: { date: null, datetime: "2020-07-30T16:00:00+02:00" },
    end: { date: null, datetime: "2020-07-30T17:30:00+02:00" },
    title: "Another coffee. Love coffee",
  },
];

const EventContext = React.createContext();

function EventStore({ children }) {
  const [events, setEvents] = useState(dummyEvents);
  const [eventID, setEventID] = useState(dummyEvents.length);

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
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export { EventContext, EventStore };
