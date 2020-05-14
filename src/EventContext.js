import React, { useState } from "react";

const dummyEvents = {
  "2020-05-13": [
    { id: 1, date: "2020-05-13", time: "11:00", title: "go to the beach" },
    {
      id: 2,
      date: "2020-05-13",
      time: "17:00",
      title: "play FF7 with Ryan and Simon",
    },
    {
      id: 3,
      date: "2020-05-13",
      time: "21:00",
      title:
        "Drinks with Natasha and Pepito at the hacienda near the cemetery.",
    },
  ],
  "2020-05-06": [
    { id: 4, date: "2020-05-06", time: "13:00", title: "work from home" },
    {
      id: 5,
      date: "2020-05-06",
      time: "15:00",
      title: "summer party with the cascados",
    },
  ],
  "2020-05-20": [
    {
      id: 6,
      date: "2020-05-20",
      time: "15:00",
      title: "hamburgers with Daniel",
    },
    {
      id: 7,
      date: "2020-05-20",
      time: "18:00",
      title: "Night out at the Hacienda as usual",
    },
  ],
  "2020-05-27": [
    {
      id: 8,
      date: "2020-05-27",
      time: "18:00",
      title: "Chill at home",
    },
    {
      id: 9,
      date: "2020-05-27",
      time: "21:00",
      title: "Double chill at home, netflix night",
    },
    {
      id: 10,
      date: "2020-05-27",
      time: "22:00",
      title: "Toilet time",
    },
    {
      id: 11,
      date: "2020-05-27",
      time: "23:30",
      title: "Should I sleep?",
    },
  ],
};

const EventContext = React.createContext();

function EventStore({ children }) {
  const [events, setEvents] = useState(dummyEvents);
  const [eventID, setEventID] = useState(11);

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
