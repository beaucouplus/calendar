import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { Button, OutlineButton, BlueSubmitButton } from "./Button";
import { range } from "./utils";

function EventForm({ date, display, onAddEvent, onClose }) {
  const titleInput = useRef();

  const [eventHour, setEventHour] = useState(12);
  const [eventMinutes, setEventMinutes] = useState(0);
  const [hourPickerShown, setHourPickerShown] = useState(false);
  const [minutesPickerShown, setMinutesPickerShown] = useState(false);

  const renderTwoDigits = (int) => (int < 10 ? `0${int}` : `${int}`);
  const twoDigitsHour = renderTwoDigits(eventHour);
  const twoDigitsMinutes = renderTwoDigits(eventMinutes);

  const styles = {
    input: `bg-white appearance-none 
      border-2 border-gray-400 
      w-full 
      py-2 px-4 
      text-gray-700 leading-tight 
      focus:outline-none focus:bg-white focus:border-blue-300`,
  };
  const displayTimePickers = () => {
    setMinutesPickerShown(false);
    setHourPickerShown(true);
  };

  const chooseHour = (event) => {
    setEventHour(Number(event.target.value));
    setHourPickerShown(false);
    setMinutesPickerShown(true);
  };

  const chooseMinutes = (event) => {
    setEventMinutes(Number(event.target.value));
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
          className="mt-1 p-4 bg-gray-100 border border-blue-800 w-1/3"
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
              className={styles.input}
              type="text"
              defaultValue="Add a title to your event"
            />
          </div>
          <div className="mt-2">
            <EventLabel>Start time</EventLabel>
            <input
              className={styles.input}
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
              eventMinutes={eventMinutes}
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

EventForm.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  display: PropTypes.bool.isRequired,
  onAddEvent: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

function HourPicker({ eventHour, onChooseHour, display }) {
  const hours_range = range(0, 23);

  return (
    <>
      {display && (
        <RangePicker
          selectedItem={eventHour}
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
          selectedItem={eventMinutes}
          callBack={onChooseMinutes}
          collection={minutes}
        />
      )}
    </>
  );
}

function RangePicker({ selectedItem = "", callBack, collection }) {
  const style = `bg-transparent hover:bg-blue-500
                 text-sm text-gray-700 font-semibold hover:text-white
                 py-2 px-2
                 `;

  return (
    <div className="grid grid-cols-6 gap-2 mt-1 bg-white border-2 border-gray-400">
      {collection.map((item) => (
        <Button
          value={item}
          css={`
            ${style} ${item === selectedItem ? "border border-blue-500" : ""}
          `}
          callBack={callBack}
          key={item}
        >{`${item}`}</Button>
      ))}
    </div>
  );
}

RangePicker.propTypes = {
  selectedItem: PropTypes.number.isRequired,
  callBack: PropTypes.func.isRequired,
  collection: PropTypes.array.isRequired,
};

function EventLabel({ children }) {
  return (
    <label className="block w-full leading-relaxed tracking-wider text-blue-700 ">
      {children}
    </label>
  );
}

export default EventForm;
