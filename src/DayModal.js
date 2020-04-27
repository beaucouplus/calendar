import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";
import { BlueButton } from "./Button";
import EventForm from "./EventForm";
dayjs.extend(customParseFormat);
dayjs.extend(isBetween);

function DayModal({ date, events, onAddEvent }) {
  const [displayForm, setDisplayForm] = useState(false);

  return (
    <div className="h-full flex flex-col mx-2">
      <h2 className="block text-3xl font-medium text-gray-800 leading-loose border-b-2 border-gray-300">
        {dayjs(date).format("dddd")} {dayjs(date).format("LL")}
      </h2>
      <div className="mt-4 pb-4">
        <BlueButton callBack={() => setDisplayForm(true)}>Add Event</BlueButton>
        <EventForm
          date={date}
          display={displayForm}
          onAddEvent={onAddEvent}
          onClose={() => setDisplayForm(false)}
        />
      </div>
      <div className="grid grid-cols-3 gap-8 w-full mt-6">
        {events && <EventList events={events} />}
      </div>
    </div>
  );
}

DayModal.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  events: PropTypes.array,
  onAddEvent: PropTypes.func.isRequired,
};

function EventList({ events }) {
  const sortedEvents =
    events &&
    events.sort((a, b) => {
      const aTime = dayjs(a.time, "HH:mm");
      const bTime = dayjs(b.time, "HH:mm");

      return aTime - bTime;
    });

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

  const morningEvents = filterEventsBetween(sortedEvents, "00:00", "11:59");
  const afternoonEvents = filterEventsBetween(sortedEvents, "12:00", "18:59");
  const eveningEvents = filterEventsBetween(sortedEvents, "19:00", "23:59");

  return (
    <>
      <EventCol events={morningEvents} title="Morning"></EventCol>
      <EventCol events={afternoonEvents} title="Afternoon">
        <h2>Afternoon</h2>
      </EventCol>
      <EventCol events={eveningEvents} title="Evening">
        <h2>Evening</h2>
      </EventCol>
    </>
  );
}

DayModal.propTypes = {
  events: PropTypes.array,
};

function EventCol({ events, title }) {
  return (
    <div className="">
      <div className="py-2">
        <h2 className="text-xl font-medium text-gray-800">{title}</h2>
      </div>
      <div className="h-auto flex self-stretch mt-4 mb-6 pb-6">
        <ul className="block w-full list-inside list-disc text-gray-800">
          {events &&
            events.map((event, idx) => <Event key={idx} event={event} />)}
        </ul>
      </div>
    </div>
  );
}

function Event({ event }) {
  return (
    <li className="block w-full h-auto mb-4 p-4 border-2 text-lg text-gray-800 border-gray-300 hover:border-blue-600">
      <div className="h-auto py-1 font-bold tracking-wider border-b-2 border-gray-300">
        {event.time}
      </div>
      <div className="mt-2">{event.title}</div>
    </li>
  );
}

export default DayModal;
