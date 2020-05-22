import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Button } from "./Button";
import EventContainer from "./EventContainer";
dayjs.extend(customParseFormat);

function DayModal({ date, events }) {
  const [displayForm, setDisplayForm] = useState(false);

  const closeForm = () => {
    setDisplayForm(false);
  };
  return (
    <div className="h-full flex flex-col">
      <header className="flex flex-row items-center px-8 pb-2">
        <h2 className="inline-block text-3xl font-medium text-gray-800 leading-loose mr-4">
          {dayjs(date).format("dddd")} {dayjs(date).format("LL")}
        </h2>
        <div className="flex-grow">
          <HeaderButton callBack={() => setDisplayForm(true)}>
            <i className="gg-add-r mr-3"></i>Add Event
          </HeaderButton>
        </div>
      </header>
      <EventContainer
        events={events}
        date={date}
        displayForm={displayForm}
        onCloseForm={closeForm}
      />
    </div>
  );
}

DayModal.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  events: PropTypes.array,
};

function HeaderButton({ children, callBack }) {
  const style = `flex flex-row items-center
                 bg-blue-500 hover:bg-blue-800
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
