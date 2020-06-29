import React, { useRef, useEffect, useReducer } from "react";
// PACKAGES
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import dayjs from "dayjs";
import "react-day-picker/lib/style.css";
import timeFormats from "../../common/timeFormats";

// REDUCER
import eventFormReducer from "./reducer";

// COMPONENTS
import { OutlineButton, BlueSubmitButton } from "../../Button";
import { AllDayEventInput, TimeInput, Toggle, EventLabel } from "./inputs/index";

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

  const defaultEventStartTime = dayjs(date).format(timeFormats.iso);
  const defaultEvent = {
    event: {
      start: {
        date: date,
        datetime: defaultEventStartTime,
      },
      end: {
        date: date,
        datetime: dayjs(defaultEventStartTime).add(1, "hour").format(timeFormats.iso),
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

export default EventForm;
