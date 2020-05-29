import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import DayView from "./DayView";
import { Button } from "./Button";

dayjs.extend(customParseFormat);

function DayModal({ date, events }) {
  const [displayForm, setDisplayForm] = useState(false);

  const closeForm = () => {
    setDisplayForm(false);
  };

  const triggerForm = () => {
    setDisplayForm(!displayForm);
  };

  return (
    <div className="mt-8 h-full flex flex-col">
      <header className="flex items-center justify-between pl-6 px-3 pb-3">
        <h2 className="inline-block text-2xl  text-gray-800 leading-loose">
          {dayjs(date).format("dddd")} {dayjs(date).format("LL")}
        </h2>
        <AddEventButton callBack={() => triggerForm()} />
      </header>
      <DayView
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

function AddEventButton({ callBack }) {
  const style = `flex items-center
                 bg-blue-600
                 text-xs text-white font-semibold align-middle
                 hover:bg-blue-800 hover:text-white
                 ml-4
                 py-2 px-6
                 rounded
                 cursor-pointer`;

  return (
    <Button
      callBack={callBack}
      css={style}
      ariaLabel="new event form"
      ariaLabelledBy="new-event-form"
    >
      <i className="gg-add-r mr-3"></i>New
    </Button>
  );
}

export default DayModal;
