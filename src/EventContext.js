import React, { useState } from "react";

const dummyEvents = {
  "2020-04-13": [
    { id: 1, date: "2020-04-13", time: "11:00", title: "go to the beach" },
    {
      id: 2,
      date: "2020-04-13",
      time: "17:00",
      title: "play FF7 with Ryan and Simon",
    },
    {
      id: 3,
      date: "2020-04-13",
      time: "21:00",
      title:
        "Drinks with Natasha and Pepito at the hacienda near the cemetery.",
    },
  ],
  "2020-04-19": [
    { id: 4, date: "2020-04-19", time: "15:00", title: "confinement" },
  ],
  "2020-05-20": [
    { id: 5, date: "2020-05-20", time: "15:00", title: "poule au pot" },
  ],
};

const EventContext = React.createContext();

function EventStore({ children }) {
  const [events, setEvents] = useState(dummyEvents);
  const [eventID, setEventID] = useState(5);

  function addEvent(event) {
    setEventID(events.length + 1);
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
