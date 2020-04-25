import React from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { OutlineButton, OutlineSubmitButton } from "./Button";
import { useEffect, useState, useRef } from "react";

function EventList({ date, events, onAddEvent }) {
  const [displayForm, setDisplayForm] = useState(false);

  return (
    <div className="h-full flex flex-col mx-2">
      <h2 className="block text-xl font-medium text-gray-800 leading-loose border-b-2 border-yellow-600">
        {dayjs(date).format("LL")}{" "}
      </h2>
      <div className="mt-6">
        <OutlineButton callBack={() => setDisplayForm(true)}>
          Add Event
        </OutlineButton>
        <EventForm date={date} display={displayForm} onAddEvent={onAddEvent} />
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

function EventForm({ date, display, onAddEvent }) {
  const titleInput = useRef();

  const handleSubmit = (event) => {
    event.preventDefault();
    onAddEvent({
      date: dayjs(date).format("YYYY-MM-DD"),
      time: "15:00",
      title: titleInput.current.value,
    });
  };

  return (
    <>
      {display && (
        <form
          action=""
          className="bg-gray-100 mt-4 p-4"
          onSubmit={handleSubmit}
        >
          <div id="form-title" className="pb-2">
            <h3 className="leading-relaxed text-red-800 font-semibold">
              New event
            </h3>
          </div>
          <input
            ref={titleInput}
            className="bg-white appearance-none border-2 border-gray-400 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-200"
            id="inline-full-name"
            type="text"
            defaultValue="Go to the beach"
          />
          <div className="mt-2">
            <OutlineSubmitButton />
          </div>
        </form>
      )}
    </>
  );
}

export default EventList;
