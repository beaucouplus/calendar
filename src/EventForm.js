import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import dayjs from "dayjs";
import { Button, OutlineButton, BlueSubmitButton } from "./Button";
import TimePicker from "./TimePicker";

function EventForm({ events, date, display, onAddEvent, onClose }) {
  const titleInput = useRef();

  const styles = {
    input: `bg-gray-100 appearance-none
            border-2 border-gray-400 rounded
            w-full
            py-2 px-4
            text-gray-700 leading-tight
            hover:border-blue-800 hover:bg-blue-100 hover:text-blue-700
            focus:outline-none focus:text-blue-700 focus:bg-blue-100 focus:border-blue-800`,
  };

  const [timeInput, setTimeInput] = useState("12:00");
  const [hours, minutes] = timeInput.split(":");

  const [valid, validate] = useState(false);

  const renderTwoDigits = (int) => (int < 10 ? `0${int}` : `${int}`);

  const chooseHour = (event) => {
    setTimeInput(`${renderTwoDigits(event.currentTarget.value)}:${minutes}`);
  };

  const chooseMinutes = (event) => {
    setTimeInput(`${hours}:${renderTwoDigits(event.currentTarget.value)}`);
  };

  const handleChange = (event) => {
    setTimeInput(event.target.value);
  };

  const selectText = () => titleInput.current.select();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!valid) return;

    onAddEvent({
      date: dayjs(date).format("YYYY-MM-DD"),
      time: timeInput,
      title: titleInput.current.value,
    });
    onClose();
  };

  return (
    <>
      {display && (
        <form
          action=""
          className="mt-10 w-full bg-white p-10 rounded-lg"
          onSubmit={handleSubmit}
        >
          <div id="form-title" className="">
            <h3 className="leading-relaxed text-2xl tracking-wider text-blue-700 font-semibold">
              New Event
            </h3>
          </div>
          <div className="mt-2">
            <EventLabel>Title</EventLabel>
            <input
              ref={titleInput}
              className={styles.input}
              type="text"
              defaultValue="Add a title to your event"
              onFocus={selectText}
            />
          </div>
          <TimeInput
            timeInput={timeInput}
            onChooseHour={(event) => chooseHour(event)}
            onChooseMinutes={(event) => chooseMinutes(event)}
            hours={hours}
            minutes={minutes}
            onHandleChange={(e) => handleChange(e)}
            onValidate={() => validate(true)}
            onInvalidate={() => validate(false)}
          />

          <div className="flex mt-6 space-x-2">
            <BlueSubmitButton />
            <OutlineButton
              callBack={onClose}
              ariaLabel="close form"
              ariaLabelledBy="close-form"
            >
              Cancel
            </OutlineButton>
          </div>
        </form>
      )}
    </>
  );
}

EventForm.propTypes = exact({
  date: PropTypes.instanceOf(Date).isRequired,
  display: PropTypes.bool.isRequired,
  onAddEvent: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  events: PropTypes.array,
});

function TimeInput({
  timeInput,
  onHandleChange,
  hours,
  minutes,
  onChooseHour,
  onChooseMinutes,
  onValidate,
  onInvalidate,
}) {
  const [timePickerShown, setTimePickerShown] = useState(false);
  const toggleTimePicker = () => setTimePickerShown(!timePickerShown);

  const styles = {
    timeInput: `flex flex-grow
                 bg-gray-100 appearance-none
                 py-2 px-4
                 text-gray-700 leading-tight
                 border-2 border-gray-400
                 rounded-l rounded-r-none
                 hover:bg-blue-100 hover:text-blue-700 hover:border-blue-800
                 focus:outline-none
                 `,
    timePickerToggle: `flex justify-center bg-gray-400
                  py-2 px-4
                  border-r-2 border-b-2 border-t-2 border-gray-400
                  rounded-r rounded-l-none
                  text-gray-800 text-center
                  group-hover:bg-blue-800 group-hover:border-blue-800 group-hover:text-white
                  hover:bg-blue-800 hover:border-blue-800
                  focus:outline-none focus:bg-blue-800 focus:border-blue-800 focus:text-white`,
    valid: "focus:text-blue-700 focus:bg-blue-100 focus:border-blue-800",
    invalid:
      "bg-red-100 border-red-800 focus:text-red-700 focus:bg-red-100 focus:border-red-800",
  };

  const [timeInputStyle, setTimeInputStyle] = useState(styles.valid);

  useEffect(() => {
    const validateInput = (timeInput) => {
      const [currentHours, currentMinutes] = timeInput.split(":");

      const hoursNum = Number(currentHours);
      const minutesNum = Number(currentMinutes);
      if (
        timeInput.length === 5 &&
        hoursNum >= 0 &&
        hoursNum < 24 &&
        minutesNum >= 0 &&
        minutesNum <= 59
      ) {
        onValidate();
        setTimeInputStyle(styles.valid);
      } else {
        onInvalidate();
        setTimeInputStyle(styles.invalid);
      }
    };
    validateInput(timeInput);
  }, [timeInput, styles.invalid, styles.valid, onValidate, onInvalidate]);

  const chooseMinutes = (event) => {
    onChooseMinutes(event);
    toggleTimePicker();
  };

  return (
    <div className="mt-2">
      <EventLabel>Start time</EventLabel>
      <div className="flex group">
        <input
          className={`${styles.timeInput} ${timeInputStyle}`}
          type="text"
          value={timeInput}
          onChange={onHandleChange}
        />
        <Button
          callBack={() => toggleTimePicker()}
          css={styles.timePickerToggle}
          withFocus={false}
        >
          <i className="gg-chevron-down"></i>
        </Button>
      </div>
      <TimePicker
        eventHour={Number(hours)}
        eventMinutes={Number(minutes)}
        onChooseHour={onChooseHour}
        onChooseMinutes={(event) => chooseMinutes(event)}
        display={timePickerShown}
      />
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

export default EventForm;
