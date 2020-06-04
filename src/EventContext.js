import React, { useState } from "react";
import { groupEventsByDate } from "./calendar";

const dummyEvents = [
  { id: 1, date: "2020-07-01", time: "11:00", title: "go to the beach" },
  {
    id: 2,
    date: "2020-07-01",
    time: "17:00",
    title: "play FF7 with Ryan and Simon",
  },
  {
    id: 3,
    date: "2020-07-01",
    time: "21:00",
    title: "Drinks with Natasha and Pepito at the hacienda near the cemetery.",
  },

  { id: 4, date: "2020-07-09", time: "13:00", title: "work from home" },
  {
    id: 5,
    date: "2020-07-09",
    time: "15:00",
    title: "summer party with the cascados",
  },
  {
    id: 6,
    date: "2020-07-17",
    time: "17:00",
    title: "hamburgers with Daniel",
  },
  {
    id: 7,
    date: "2020-07-17",
    time: "18:00",
    title: "Night out at the Hacienda as usual",
  },
  {
    id: 8,
    date: "2020-07-21",
    time: "15:00",
    title: "Chill at home",
  },
  {
    id: 9,
    date: "2020-07-21",
    time: "17:00",
    title: "Double chill at home, netflix night",
  },
  {
    id: 10,
    date: "2020-07-21",
    time: "18:00",
    title: "Toilet time",
  },
  {
    id: 11,
    date: "2020-07-21",
    time: "19:00",
    title: "Nap time",
  },
  {
    id: 12,
    date: "2020-07-21",
    time: "20:00",
    title: "Eat",
  },
  {
    id: 13,
    date: "2020-07-21",
    time: "21:00",
    title: "Netflix",
  },
  {
    id: 14,
    date: "2020-07-21",
    time: "22:00",
    title: "Should I sleep?",
  },
  {
    id: 15,
    date: "2020-07-30",
    time: "10:00",
    title: "coffee at la pata negra",
  },
  {
    id: 16,
    date: "2020-07-30",
    time: "16:00",
    title: "Another coffee. Love coffee",
  },
];

const EventContext = React.createContext();

function EventStore({ children }) {
  const [events, setEvents] = useState(groupEventsByDate(dummyEvents));
  const [eventID, setEventID] = useState(17);

  function addEvent(event) {
    setEventID(eventID + 1);
    const newEvent = { ...event, id: eventID };
    const eventsList = events[event.date];
    const newEventsList = eventsList ? [...eventsList, newEvent] : [newEvent];
    const newEventListAtEventDate = { [event.date]: newEventsList };
    const newEvents = { ...events, ...newEventListAtEventDate };
    setEvents(newEvents);
  }

  function deleteEvent(event) {
    const eventsList = events[event.date];
    const remainingEvents = eventsList.filter((e) => e.id !== event.id);

    if (remainingEvents.length > 0) {
      const newEventListAtEventDate = { [event.date]: remainingEvents };
      const newEvents = { ...events, ...newEventListAtEventDate };
      setEvents(newEvents);
    } else {
      const { [event.date]: _, ...newEvents } = events;
      setEvents(newEvents);
    }
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
