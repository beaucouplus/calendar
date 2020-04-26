import React from "react";
import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { Button, OutlineButton, BlueSubmitButton, BlueButton } from "./Button";
import { range } from "./utils";

function EventList({ date, events, onAddEvent }) {
  const [displayForm, setDisplayForm] = useState(false);

  return (
    <div className="h-full flex flex-col mx-2">
      <h2 className="block text-xl font-medium text-gray-800 leading-loose border-b-2 border-gray-300">
        {dayjs(date).format("LL")}{" "}
      </h2>
      <div className="mt-6">
        <BlueButton callBack={() => setDisplayForm(true)}>Add Event</BlueButton>
        <EventForm
          date={date}
          display={displayForm}
          onAddEvent={onAddEvent}
          onClose={() => setDisplayForm(false)}
        />
      </div>
      <div className="h-auto flex self-stretch mt-6 mb-6 pb-6">
        <ul className="block w-full list-inside list-disc text-gray-800">
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
  return (
    <li className="block w-full flex flex-row h-auto p-2 mb-2 hover:bg-gray-100 border border-transparent hover:border-gray-300">
      <div className="border-r-2 border-red-600 h-auto font-bold pr-4 mr-4">
        {event.time}
      </div>
      <div className="">{event.title}</div>
    </li>
  );
}

function EventForm({ date, display, onAddEvent, onClose }) {
  const titleInput = useRef();

  const [eventHour, setEventHour] = useState(12);
  const [eventMinutes, setEventMinutes] = useState(0);
  const [hourPickerShown, setHourPickerShown] = useState(false);
  const [minutesPickerShown, setMinutesPickerShown] = useState(false);

  const renderTwoDigits = (int) => (int < 10 ? `0${int}` : `${int}`);
  const twoDigitsHour = renderTwoDigits(eventHour);
  const twoDigitsMinutes = renderTwoDigits(eventMinutes);

  const displayTimePickers = () => {
    setMinutesPickerShown(false);
    setHourPickerShown(true);
  };

  const chooseHour = (event) => {
    setEventHour(event.target.value);
    setHourPickerShown(false);
    setMinutesPickerShown(true);
  };

  const chooseMinutes = (event) => {
    setEventMinutes(event.target.value);
    setMinutesPickerShown(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onAddEvent({
      date: dayjs(date).format("YYYY-MM-DD"),
      time: `${twoDigitsHour}:${twoDigitsMinutes}`,
      title: titleInput.current.value,
    });
    onClose();
  };

  return (
    <>
      {display && (
        <form
          action=""
          className="mt-1 p-4 bg-gray-100 border border-blue-800"
          onSubmit={handleSubmit}
        >
          <div
            id="form-title"
            className="flex items-center justify-between pb-2"
          >
            <h3 className="leading-relaxed text-2xl tracking-wider text-blue-700 font-semibold">
              New Event
            </h3>
            <OutlineButton callBack={onClose}>✕</OutlineButton>
          </div>
          <div className="mt-2">
            <EventLabel>Title</EventLabel>
            <input
              ref={titleInput}
              className="bg-white appearance-none border-2 border-gray-400 w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-300"
              type="text"
              defaultValue="Add a title to your event"
            />
          </div>
          <div className="mt-2">
            <EventLabel>Start time</EventLabel>
            <input
              className="bg-white appearance-none border-2 border-gray-400 w-1/5 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-300"
              type="text"
              value={`${twoDigitsHour}:${twoDigitsMinutes}`}
              onClick={() => displayTimePickers()}
              readOnly
            />
            <HourPicker
              eventHour={eventHour}
              onChooseHour={(event) => chooseHour(event)}
              display={hourPickerShown}
            />
            <MinutesPicker
              eventHour={eventHour}
              onChooseMinutes={(event) => chooseMinutes(event)}
              display={minutesPickerShown}
            />
          </div>
          <div className="mt-2">
            <BlueSubmitButton />
          </div>
        </form>
      )}
    </>
  );
}

function HourPicker({ eventHour, onChooseHour, display }) {
  const hours_range = range(0, 23);

  return (
    <>
      {display && (
        <RangePicker
          value={eventHour}
          callBack={onChooseHour}
          collection={hours_range}
        />
      )}
    </>
  );
}

function MinutesPicker({ eventMinutes, onChooseMinutes, display }) {
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  return (
    <>
      {display && (
        <RangePicker
          value={eventMinutes}
          callBack={onChooseMinutes}
          collection={minutes}
        />
      )}
    </>
  );
}

function RangePicker({ value, callBack, collection }) {
  const style = `bg-transparent hover:bg-blue-500
                 text-sm text-gray-700 font-semibold hover:text-white
                 py-2 px-2
                 `;
  return (
    <div className="grid grid-cols-6 gap-2 mt-1 bg-white border-2 border-gray-400">
      {collection.map((item) => (
        <Button
          value={item}
          css={style}
          callBack={callBack}
          key={item}
        >{`${item}`}</Button>
      ))}
    </div>
  );
}

function EventLabel({ children }) {
  return (
    <label className="block w-full leading-relaxed tracking-wider text-blue-700 ">
      {children}
    </label>
  );
}

export default EventList;
