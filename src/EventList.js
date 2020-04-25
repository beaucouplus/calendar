import React from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { OutlineButton } from "./Button";
import { useEffect } from "react";

function EventList({ date, events, onAddEvent }) {
  const addEvent = () => {
    onAddEvent({
      date: dayjs(date).format("YYYY-MM-DD"),
      time: "15:00",
      title:
        "this event has a very long title because titles should always be readable even when they span several lines",
    });
  };

  return (
    <div className="h-full flex flex-col mx-2">
      <h2 className="block text-xl font-medium text-gray-800 leading-loose border-b-2 border-yellow-600">
        {dayjs(date).format("LL")}{" "}
      </h2>
      <div className="mt-6">
        <OutlineButton callBack={addEvent}>Add Event</OutlineButton>
      </div>
      <div className="h-auto flex self-stretch mt-6 mb-6 pb-6">
        <ul className="list-inside list-disc text-gray-800">
          {events &&
            events.map((event, idx) => <Event key={idx} event={event} />)}
        </ul>
      </div>
    </div>
  );
}

EventList.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  events: PropTypes.array,
  onAddEvent: PropTypes.func.isRequired,
};

function Event({ event }) {
  useEffect(() => console.log(event));

  return (
    <li className="block w-full flex flex-row h-12 mb-4 hover:bg-gray-200">
      <div className="border-r-2 border-red-600 font-bold pr-4 mr-4">
        {event.time}
      </div>
      <div className="">{event.title}</div>
    </li>
  );
}

export default EventList;
