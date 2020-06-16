import React, { useState, useRef, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import dayjs from "dayjs";
import DayPicker from "react-day-picker/DayPicker";
import "react-day-picker/lib/style.css";
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

  const [dateInput, setDateInput] = useState(date);
  const [timeInput, setTimeInput] = useState("12:00");
  const [hours, minutes] = timeInput.split(":");

  const [isAllDayEvent, setIsAllDayEvent] = useState(false);
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

  const handleDayInputChange = (e) => setDateInput(e.target.value);
  const handleDayChange = (day) =>
    setDateInput(dayjs(day).format("YYYY-MM-DD"));

  const selectText = () => titleInput.current.select();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!valid) return;

    const timeFormat = `YYYY-MM-DDT${timeInput}:00+02:00`;
    const eventTime = dayjs(date).format(timeFormat);
    onAddEvent({
      start: {
        date: null,
        datetime: eventTime,
      },
      end: {
        date: null,
        datetime: dayjs(eventTime).add(1, "hour").format(timeFormat),
      },
      title: titleInput.current.value,
    });
    onClose();
  };

  return (
    <>
      {display && (
        <form
          action=""
          className="mt-10 w-full bg-white p-6 rounded-lg"
          onSubmit={handleSubmit}
        >
          <div id="form-title" className="">
            <h3 className="flex items-center leading-relaxed text-xl tracking-wider text-blue-700 font-medium">
              <i className="gg-add-r mr-2"></i> New Event
            </h3>
          </div>
          <div className="mt-4">
            <EventLabel>Title</EventLabel>
            <input
              ref={titleInput}
              className={styles.input}
              type="text"
              defaultValue="Add a title to your event"
              onFocus={selectText}
            />
          </div>
          <div className="mt-4">
            <Toggle
              checked={isAllDayEvent}
              onCheck={() => setIsAllDayEvent(!isAllDayEvent)}
              checkedTitle="All Day Event"
              unCheckedTitle="All Day Event?"
            />
          </div>
          <div className="mt-2 border border-gray-300 rounded p-4">
            {isAllDayEvent ? (
              <AllDayEventInput
                onInputChange={handleDayInputChange}
                onDayChange={handleDayChange}
                css={styles.input}
                inputValue={dateInput}
                date={date}
              />
            ) : (
              <TimeInput
                title={"Start time"}
                timeInput={timeInput}
                onChooseHour={(event) => chooseHour(event)}
                onChooseMinutes={(event) => chooseMinutes(event)}
                hours={hours}
                minutes={minutes}
                onHandleChange={(e) => handleChange(e)}
                onValidate={() => validate(true)}
                onInvalidate={() => validate(false)}
              />
            )}
          </div>
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
  date: PropTypes.string.isRequired,
  display: PropTypes.bool.isRequired,
  onAddEvent: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  events: PropTypes.array,
});

function AllDayEventInput({
  onInputChange,
  onDayChange,
  css,
  inputValue,
  date,
}) {
  const disabledInput = `bg-white appearance-none
  border-2 border-gray-300 rounded
  w-full
  py-2 px-4
  text-gray-600 leading-tight
  focus:outline-none focus:text-blue-700 focus:bg-blue-100 focus:border-blue-800`;

  const [datePickerShown, setDatePickerShown] = useState(false);

  return (
    <div className="grid grid-cols-7 gap-2">
      <div className="col-span-3">
        <EventLabel>Start Date</EventLabel>
        <input className={disabledInput} value={date} disabled />
      </div>
      <div className="flex items-end mb-2 justify-center">
        <i className="gg-arrow-right mx-2 text-blue-600"></i>
      </div>
      <div className="col-span-3 relative">
        <EventLabel>End date</EventLabel>
        <input
          className={`${css}`}
          value={inputValue}
          onChange={onInputChange}
          onFocus={() => setDatePickerShown(!datePickerShown)}
        />
        <DatePickerOverlay
          show={datePickerShown}
          onDayClick={onDayChange}
          inputValue={inputValue}
        />
      </div>
    </div>
  );
}

function DatePickerOverlay({ show, onDayClick, inputValue }) {
  return (
    <>
      {show && (
        <div className="absolute right-0 top-20 mt-1 bg-white border border-gray-300 rounded shadow">
          <DayPicker onDayClick={onDayClick} value={inputValue} />
        </div>
      )}
    </>
  );
}
function TimeInput({
  title,
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
    timePickerToggle: `flex justify-center items-center bg-gray-400
                  px-4
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
    <div className="">
      <EventLabel>{title}</EventLabel>
      <div className="flex group w-1/2">
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

function Toggle({ checked, onCheck, checkedTitle, unCheckedTitle }) {
  const styles = {
    toggle: `absolute block
       w-4 h-4 mt-1 ml-1
       bg-white rounded-full shadow
       inset-y-0 left-0
       focus-within:shadow-outline
       transition-transform duration-200 ease-in-out`,
    checked: `transform translate-x-full`,
  };

  return (
    <label
      htmlFor={checked ? "checked" : "unchecked"}
      className="mt-3 inline-flex items-center cursor-pointer"
      onClick={onCheck}
    >
      <span className="relative">
        <span
          className={`block w-10 h-6 ${
            checked ? "bg-blue-600" : "bg-gray-400"
          } rounded-full shadow-inner`}
        ></span>
        <span className={`${styles.toggle} ${checked && styles.checked}`}>
          <input type="checkbox" className="absolute opacity-0 w-0 h-0" />
        </span>
      </span>
      <span className="ml-3 text-md text-gray-700">
        {checked ? checkedTitle : unCheckedTitle}
      </span>
    </label>
  );
}

export default EventForm;
