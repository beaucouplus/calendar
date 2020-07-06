import React, { useState, useContext } from "react";

// PACKAGES
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

// CONTEXT
import { EventContext } from "../../../common/EventContext";

// COMPONENTS
import DayView from "./DayView";
import { Button } from "../../../common/Button";

// DAYJS PLUGINS
dayjs.extend(customParseFormat);

function DayModal({ date }) {
  const [displayForm, setDisplayForm] = useState(false);
  const closeForm = () => setDisplayForm(false);
  const triggerForm = () => setDisplayForm(!displayForm);

  const { eventsByDate } = useContext(EventContext);
  const events = eventsByDate[date];

  return (
    <div className="mt-8 h-full flex flex-col">
      <header className="flex items-center justify-between pl-6 px-3 pb-3">
        <h2 className="inline-block text-2xl  text-gray-800 leading-loose">
          {dayjs(date).format("dddd")} {dayjs(date).format("LL")}
        </h2>
        <AddEventButton callBack={() => triggerForm()} />
      </header>
      <DayView events={events} date={date} displayForm={displayForm} onCloseForm={closeForm} />
    </div>
  );
}

DayModal.propTypes = exact({
  date: PropTypes.string,
});

function AddEventButton({ callBack }) {
  const style = `flex items-center
                 bg-blue-600
                 text-xs text-white font-semibold align-middle
                 hover:bg-blue-800 hover:text-white
                 ml-4
                 py-2 px-4
                 rounded
                 cursor-pointer`;

  return (
    <Button callBack={callBack} css={style} ariaLabel="new event form" ariaLabelledBy="new-event-form">
      <i className="gg-add-r mr-1 transform scale-75 "></i>New
    </Button>
  );
}
// No need for propType as Button already has a propType

export default DayModal;
