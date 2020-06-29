import React, { useState, useRef, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import produce from "immer";
import dayjs from "dayjs";
import DayPicker from "react-day-picker/DayPicker";
import "react-day-picker/lib/style.css";
import { Button, OutlineButton, BlueSubmitButton } from "./Button";
import TimePicker from "./TimePicker";

const ISOTimeFormat = `YYYY-MM-DDTHH:mm:00+02:00`;
const renderTwoDigits = (int) => (int < 10 ? `0${int}` : `${int}`);

class timeHelper {
  constructor(formats) {
    this.formats = formats;
  }

  toYear = (time) => dayjs(time).format(this.formats.year);

  toHumanReadableTime = (hours, minutes) => `${renderTwoDigits(Number(hours))}:${renderTwoDigits(Number(minutes))}`;

  updateHour = (currentTime, hour) => dayjs(currentTime, this.formats.iso).hour(hour).format(this.formats.iso);

  updateMinute = (currentTime, minute) => dayjs(currentTime, this.formats.iso).minute(minute).format(this.formats.iso);

  updateTime = (currentTime, hour, minute) =>
    dayjs(currentTime, this.formats.iso).hour(hour).minute(minute).format(this.formats.iso);
}

const eventFormReducer = produce((draft, action) => {
  const timeManager = new timeHelper({ iso: ISOTimeFormat, year: "YYYY-MM-DD" });
  let [hours, minutes] = draft.startTimeInput.inputValue.split(":");
  switch (action.type) {
    case "updateTitle":
      draft.event.title = action.name;
      break;

    case "toggleDate":
      draft.isAllDayEvent = !draft.isAllDayEvent;
      break;

    case "addEndDateFromInput":
      draft.event.end.date = action.name;
      break;

    case "addEndDateFromPicker":
      draft.event.end.date = timeManager.toYear(action.name);
      break;

    case "addStartHourFromTimePicker":
      draft.event.start.datetime = timeManager.updateHour(draft.event.start.datetime, action.name);
      hours = action.name;
      draft.startTimeInput.inputValue = timeManager.toHumanReadableTime(hours, minutes);
      break;

    case "addStartMinutesFromTimePicker":
      draft.event.start.datetime = timeManager.updateMinute(draft.event.start.datetime, action.name);
      minutes = action.name;
      draft.startTimeInput.inputValue = timeManager.toHumanReadableTime(hours, minutes);
      break;

    case "addStartTimeFromTimeInput":
      draft.startTimeInput.inputValue = action.name;
      break;

    case "validateStartTime":
      draft.startTimeInput.valid = true;
      draft.event.start.datetime = timeManager.updateTime(draft.event.start.datetime, hours, minutes);
      break;

    case "invalidateStartTime":
      draft.startTimeInput.valid = false;
      break;

    case "submit":
      if (draft.isAllDayEvent) {
        draft.event.start.datetime = null;
        draft.event.end.datetime = null;
      } else {
        draft.event.start.date = null;
        draft.event.end.date = null;
      }
      draft.readyForSubmit = true;
      break;

    default:
  }
});

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

  const defaultEventStartTime = dayjs(date).format(ISOTimeFormat);
  const defaultEvent = {
    event: {
      start: {
        date: date,
        datetime: defaultEventStartTime,
      },
      end: {
        date: date,
        datetime: dayjs(defaultEventStartTime).add(1, "hour").format(ISOTimeFormat),
      },
      title: "Please add a title",
    },
    isAllDayEvent: false,
    readyForSubmit: false,
    startTimeInput: {
      inputValue: "12:00",
      valid: true,
    },
  };

  const [eventForm, dispatch] = useReducer(eventFormReducer, defaultEvent);

  useEffect(() => {
    if (eventForm.readyForSubmit) {
      onAddEvent(eventForm.event);
      onClose();
    }
  });

  const selectText = () => titleInput.current.select();

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch({ type: "submit" });
  };

  return (
    <>
      {display && (
        <form action="" className="mt-10 w-full bg-white p-6 rounded-lg" onSubmit={handleSubmit}>
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
              value={eventForm.event.title}
              onChange={(event) => dispatch({ type: "updateTitle", name: event.target.value })}
              onFocus={selectText}
            />
          </div>
          <div className="mt-4">
            <Toggle
              checked={eventForm.isAllDayEvent}
              onCheck={() => dispatch({ type: "toggleDate" })}
              checkedTitle="All Day Event"
              unCheckedTitle="All Day Event?"
            />
          </div>
          <div className="mt-2 border border-gray-300 rounded p-4">
            {eventForm.isAllDayEvent ? (
              <AllDayEventInput
                onInputChange={(event) => dispatch({ type: "addEndDateFromInput", name: event })}
                onPickerChange={(day) => dispatch({ type: "addEndDateFromPicker", name: day })}
                css={styles.input}
                inputValue={eventForm.event.end.date ? eventForm.event.end.date : ""}
                date={date}
              />
            ) : (
              <TimeInput
                title={"Start time"}
                timeInput={eventForm.startTimeInput.inputValue}
                onChooseHour={(event) =>
                  dispatch({
                    type: "addStartHourFromTimePicker",
                    name: event.target.value,
                  })
                }
                onChooseMinutes={(event) =>
                  dispatch({
                    type: "addStartMinutesFromTimePicker",
                    name: event.target.value,
                  })
                }
                onHandleChange={(event) =>
                  dispatch({
                    type: "addStartTimeFromTimeInput",
                    name: event.target.value,
                  })
                }
                onValidate={() => dispatch({ type: "validateStartTime" })}
                onInvalidate={() => dispatch({ type: "invalidateStartTime" })}
              />
            )}
          </div>
          <div className="flex mt-6 space-x-2">
            <BlueSubmitButton />
            <OutlineButton callBack={onClose} ariaLabel="close form" ariaLabelledBy="close-form">
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

function AllDayEventInput({ onInputChange, onPickerChange, css, inputValue, date }) {
  const disabledInput = `bg-white appearance-none
  border-2 border-gray-300 rounded
  w-full
  py-2 px-4
  text-gray-600 leading-tight
  focus:outline-none focus:text-blue-700 focus:bg-blue-100 focus:border-blue-800`;

  const [datePickerShown, setDatePickerShown] = useState(false);

  const handleDayClick = (day) => {
    onPickerChange(day);
    setDatePickerShown(!datePickerShown);
  };

  const close = () => setDatePickerShown(!datePickerShown);

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
          onClick={() => setDatePickerShown(!datePickerShown)}
        />
        <DatePickerOverlay show={datePickerShown} onDayClick={handleDayClick} inputValue={inputValue} onClose={close} />
      </div>
    </div>
  );
}

function DatePickerOverlay({ show, onDayClick, inputValue, date, onClose }) {
  return (
    <>
      {show && (
        <div
          className="absolute right-0 top-20 mt-1 bg-white border border-gray-300 rounded shadow"
          onMouseLeave={onClose}
        >
          <DayPicker onDayClick={onDayClick} value={inputValue} disabledDays={[{ before: dayjs(date).toDate() }]} />
        </div>
      )}
    </>
  );
}
function TimeInput({ title, timeInput, onHandleChange, onChooseHour, onChooseMinutes, onValidate, onInvalidate }) {
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
    invalid: "bg-red-100 border-red-800 focus:text-red-700 focus:bg-red-100 focus:border-red-800",
  };

  const [timeInputStyle, setTimeInputStyle] = useState(styles.valid);
  const [hours, minutes] = timeInput && timeInput.split(":");

  useEffect(() => {
    const validateInput = (timeInput) => {
      const [currentHours, currentMinutes] = timeInput.split(":");

      const hoursNum = Number(currentHours);
      const minutesNum = Number(currentMinutes);
      if (timeInput.length === 5 && hoursNum >= 0 && hoursNum < 24 && minutesNum >= 0 && minutesNum <= 59) {
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
        <Button callBack={() => toggleTimePicker()} css={styles.timePickerToggle} withFocus={false}>
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
  return <label className="block w-full leading-relaxed tracking-wider text-blue-700 ">{children}</label>;
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
        <span className={`block w-10 h-6 ${checked ? "bg-blue-600" : "bg-gray-400"} rounded-full shadow-inner`}></span>
        <span className={`${styles.toggle} ${checked && styles.checked}`}>
          <input type="checkbox" className="absolute opacity-0 w-0 h-0" />
        </span>
      </span>
      <span className="ml-3 text-md text-gray-700">{checked ? checkedTitle : unCheckedTitle}</span>
    </label>
  );
}

export default EventForm;
