import React, { useRef, useEffect, useReducer } from "react";

// PACKAGES
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import "react-day-picker/lib/style.css";

// REDUCER
import eventFormReducer from "./reducer";

// SCRIPTS
import createDefaultEvent from "./defaultEvent";

// COMPONENTS
import { OutlineButton, BlueSubmitButton } from "../../common/Button";
import { AllDayEventInput, StartTimeInput, Toggle, EventLabel, EndTimeInput } from "./inputs/index";

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

  const defaultEvent = createDefaultEvent(date);
  const [eventForm, dispatch] = useReducer(eventFormReducer, defaultEvent);

  useEffect(() => {
    if (eventForm.readyForSubmit) {
      onAddEvent(eventForm.event);
      onClose();
    }
  }, [eventForm, onAddEvent, onClose]);

  // HANDLERS
  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch({ type: "submit" });
  };

  // Title
  const updateTitle = (event) => dispatch({ type: "updateTitle", name: event.target.value });
  const selectText = () => titleInput.current.select();

  // Toggle
  const toggleDate = () => dispatch({ type: "toggleDate" });

  // AllDayEventInput
  const addEndDateFromInput = (event) => dispatch({ type: "addEndDateFromInput", name: event });
  const addEndDateFromPicker = (day) => dispatch({ type: "addEndDateFromPicker", name: day });

  // StartTimeInput
  const addStartHourFromTimePicker = (event) =>
    dispatch({ type: "addStartHourFromTimePicker", name: event.target.value });
  const addStartMinutesFromTimePicker = (event) =>
    dispatch({ type: "addStartMinutesFromTimePicker", name: event.target.value });
  const addStartTimeFromTimeInput = (event) =>
    dispatch({ type: "addStartTimeFromTimeInput", name: event.target.value });

  // EndTimeInput
  const addEndTimeFromPicker = () => dispatch({ type: "addEndTimeFromPicker" });
  const subtractEndTimeFromPicker = () => dispatch({ type: "subtractEndTimeFromPicker" });
  const addEndTimeFromTimeInput = (event) => dispatch({ type: "addEndTimeFromTimeInput", name: event.target.value });

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
              onChange={updateTitle}
              onFocus={selectText}
            />
          </div>
          <div className="mt-4">
            <Toggle
              checked={eventForm.isAllDayEvent}
              onCheck={toggleDate}
              checkedTitle="All Day Event"
              unCheckedTitle="All Day Event?"
            />
          </div>
          <div className="mt-2 border border-gray-300 rounded p-6">
            {eventForm.isAllDayEvent ? (
              <AllDayEventInput
                onInputChange={addEndDateFromInput}
                onPickerChange={addEndDateFromPicker}
                css={styles.input}
                inputValue={eventForm.event.end.date ? eventForm.event.end.date : ""}
                date={date}
              />
            ) : (
              <div className="">
                <StartTimeInput
                  title={"Start time"}
                  timeInput={eventForm.startInput.time}
                  onChooseHour={addStartHourFromTimePicker}
                  onChooseMinutes={addStartMinutesFromTimePicker}
                  onHandleChange={addStartTimeFromTimeInput}
                  validInput={eventForm.startInput.valid}
                />
                <EndTimeInput
                  timeInput={eventForm.endInput.time}
                  onAddEndTime={addEndTimeFromPicker}
                  onSubtractEndtime={subtractEndTimeFromPicker}
                  onHandleChange={addEndTimeFromTimeInput}
                  validInput={eventForm.endInput.valid}
                />
              </div>
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
