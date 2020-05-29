import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { Button, OutlineButton, BlueSubmitButton } from "./Button";
import { range } from "./utils";

function EventForm({ events, date, display, onAddEvent, onClose }) {
  const titleInput = useRef();

  const [manualTimeInput, setManualTimeInput] = useState("12:00");
  const [valid, validate] = useState(false);
  const [eventHour, setEventHour] = useState(12);
  const [eventMinutes, setEventMinutes] = useState(0);
  const [timePickerShown, setTimePickerShown] = useState(false);

  const styles = {
    input: `bg-gray-100 appearance-none
            border-2 border-gray-400 rounded
            w-full
            py-2 px-4
            text-gray-700 leading-tight
            hover:border-blue-800 hover:bg-blue-100 hover:text-blue-700
            focus:outline-none focus:text-blue-700 focus:bg-blue-100 focus:border-blue-800`,
    inputInGroup: `flex flex-grow
                 bg-gray-100 appearance-none
                 py-2 px-4
                 text-gray-700 leading-tight
                 border-2 border-gray-400
                 rounded-l rounded-r-none
                 hover:bg-blue-100 hover:text-blue-700 hover:border-blue-800
                 focus:outline-none focus:text-blue-700 focus:bg-blue-100 focus:border-blue-800`,
    inputButton: `flex justify-center bg-gray-400
                  py-2 px-4
                  border-r-2 border-b-2 border-t-2 border-gray-400
                  rounded-r rounded-l-none
                  text-gray-800 text-center
                  group-hover:bg-blue-800 group-hover:border-blue-800 group-hover:text-white
                  hover:bg-blue-800 hover:border-blue-800
                  focus:outline-none focus:bg-blue-800 focus:border-blue-800 focus:text-white`,
  };

  const toggleTimePicker = () => {
    setTimePickerShown(!timePickerShown);
  };

  const close = () => {
    // setMinutesPickerShown(false);
    // setHourPickerShown(false);
    onClose();
  };

  const chooseHour = (event) => {
    setEventHour(Number(event.target.value));
    // setHourPickerShown(false);
    // setMinutesPickerShown(true);
  };

  const chooseMinutes = (event) => {
    setEventMinutes(Number(event.target.value));
    // setMinutesPickerShown(false);
  };

  const selectText = () => titleInput.current.select();

  const handleChange = (event) => {
    setManualTimeInput(event.target.value);

    console.log(manualTimeInput);
    if (manualTimeInput.length >= 5) {
      validate(true);
      // const [hours, minutes] = manualTimeInput.split(":");
      // console.log("hours", hours, "minutes", minutes);
      // setEventHour(Number(hours));
      // setEventMinutes(Number(minutes));
    }
  };

  const handleSubmit = (event) => {
    if (!valid) return;
    event.preventDefault();

    onAddEvent({
      date: dayjs(date).format("YYYY-MM-DD"),
      time: manualTimeInput,
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
          <div className="mt-2">
            <EventLabel>Start time</EventLabel>
            <div className="flex group">
              <input
                className={styles.inputInGroup}
                type="text"
                value={manualTimeInput}
                onChange={(e) => handleChange(e)}
              />
              <Button
                callBack={() => toggleTimePicker()}
                css={styles.inputButton}
                withFocus={false}
              >
                <i className="gg-chevron-down"></i>
              </Button>
            </div>
            <TimePicker
              eventHour={eventHour}
              eventMinutes={eventMinutes}
              onchooseHour={(event) => chooseHour(event)}
              onChooseMinutes={(event) => chooseMinutes(event)}
              display={timePickerShown}
            />
          </div>
          <div className="flex mt-6 space-x-2">
            <BlueSubmitButton />
            <OutlineButton
              callBack={close}
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

EventForm.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  display: PropTypes.bool.isRequired,
  onAddEvent: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  events: PropTypes.array,
};

function TimePicker({
  eventHour,
  onChooseHour,
  eventMinutes,
  onChooseMinutes,
  display,
}) {
  return (
    <>
      {display && (
        <div className="grid grid-cols-2">
          <div className="">
            <HourPicker
              eventHour={eventHour}
              onChooseHour={onChooseHour}
              display={true}
            />
          </div>
          <MinutesPicker
            eventMinutes={eventMinutes}
            onChooseMinutes={onChooseMinutes}
            display={true}
            columns={1}
          />
        </div>
      )}
    </>
  );
}

function HourPicker({ eventHour, onChooseHour, display, columns }) {
  const hours_range = range(0, 23);

  return (
    <>
      {display && (
        <RangePicker
          selectedItem={eventHour}
          callBack={onChooseHour}
          collection={hours_range}
          columns={columns}
        />
      )}
    </>
  );
}

function MinutesPicker({ eventMinutes, onChooseMinutes, display, columns }) {
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  return (
    <>
      {display && (
        <RangePicker
          selectedItem={eventMinutes}
          callBack={onChooseMinutes}
          collection={minutes}
          columns={columns}
        />
      )}
    </>
  );
}

function RangePicker({ selectedItem = "", callBack, collection, columns = 6 }) {
  const style = `bg-transparent hover:bg-blue-500
                 text-sm text-gray-700 font-semibold hover:text-white
                 py-2 px-2
                 rounded
                 `;

  return (
    <div
      className={`grid grid-cols-${columns} gap-2 mt-1 bg-white border-2 border-gray-400 rounded`}
    >
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
  columns: PropTypes.number,
};

function EventLabel({ children }) {
  return (
    <label className="block w-full leading-relaxed tracking-wider text-blue-700 ">
      {children}
    </label>
  );
}

export default EventForm;
