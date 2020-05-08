import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Button } from "./Button";
import EventContainer from "./EventContainer";
dayjs.extend(customParseFormat);

function DayModal({ date, events, onAddEvent, onDeleteEvent }) {
  const [displayForm, setDisplayForm] = useState(false);

  const closeForm = () => {
    setDisplayForm(false);
  };
  return (
    <div className="h-full flex flex-col mx-8">
      <header className="flex flex-row items-center">
        <h2 className="inline-block text-3xl font-medium text-gray-800 leading-loose mr-4">
          {dayjs(date).format("dddd")} {dayjs(date).format("LL")}
        </h2>
        <div className="relative flex-grow">
          <HeaderButton callBack={() => setDisplayForm(true)}>
            <i className="gg-add-r h-full mr-3"></i>Add Event
          </HeaderButton>
        </div>
      </header>
      <EventContainer
        events={events}
        onDeleteEvent={onDeleteEvent}
        date={date}
        onAddEvent={onAddEvent}
        displayForm={displayForm}
        onCloseForm={closeForm}
      />
    </div>
  );
}

DayModal.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  events: PropTypes.array,
  onAddEvent: PropTypes.func.isRequired,
};

function HeaderButton({ children, callBack }) {
  const style = `flex flex-row items-center
                 bg-blue-700 hover:bg-blue-500
                 text-xs text-white font-semibold align-middle hover:text-white
                 py-2 px-4
                 rounded
                 cursor-pointer`;

  return (
    <Button
      callBack={callBack}
      css={style}
      ariaLabel="new event form"
      ariaLabelledBy="new-event-form"
    >
      {children}
    </Button>
  );
}

export default DayModal;
