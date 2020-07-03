import React, { useState, useEffect, useContext } from "react";

// PACKAGES
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import dayjs from "dayjs";

// CONTEXT
import { EventContext } from "../../common/EventContext";

// SCRIPTS
import timeFormats from "../../common/timeFormats";
import { isoDateTimeToString } from "../../common/utils";

// COMPONENTS
import { Button } from "../../common/Button";

function Event({ event, chosenEventId }) {
  const isShown = event.id === chosenEventId;
  const { onDeleteEvent } = useContext(EventContext);
  const [showDetails, setShowDetails] = useState(isShown);

  const handleDeleteEvent = (event) => {
    setShowDetails(false);
    onDeleteEvent(event);
  };

  const handleClick = () => setShowDetails(!showDetails);

  const buttonStyle = `group flex items-start
                   w-full h-auto 
                   py-2 px-4
                   rounded-lg
                   text-md text-gray-800
                   focus:outline-none
                   cursor-pointer`;

  return (
    <li
      className={`block bg-white rounded-lg shadow-sm border-2 hover:border-blue-600 border-transparent focus-within:border-blue-600`}
    >
      <Button css={buttonStyle} callBack={handleClick} withFocus={false}>
        {event.allDay ? <AllDayEventHeader event={event} /> : <TimedEventHeader event={event} />}
      </Button>
      {showDetails && <EventDetails event={event} onDeleteEvent={handleDeleteEvent} />}
    </li>
  );
}

Event.propTypes = exact({
  event: PropTypes.object.isRequired,
  chosenEventId: PropTypes.number,
});

function TimedEventHeader({ event }) {
  return (
    <>
      <div className="w-1/8 text-blue-700 font-semibold tracking-wider text-right">
        {isoDateTimeToString(event.start.datetime)}
      </div>
      <div className="pl-4 text-left">{event.title}</div>
      <div className="ml-4 flex flex-grow justify-end ">
        <div className="flex text-gray-800 text-xs items-center pr-2">
          <i className="gg-arrow-right transform scale-75 text-gray-600 mr-1"></i>
          {isoDateTimeToString(event.end.datetime)}
        </div>
      </div>
      <div className="flex justify-end text-gray-400 group-focus:text-blue-600 group-hover:text-blue-600 group-active:text-blue-600">
        <i className="gg-chevron-down"></i>
      </div>
    </>
  );
}
TimedEventHeader.propTypes = exact({
  event: PropTypes.object.isRequired,
});

function AllDayEventHeader({ event }) {
  return (
    <>
      <div className="flex-none w-full flex flex-col">
        <div className="flex border-b border-gray-300 pb-2">
          <div className="flex items-center pr-2 text-md text-blue-700 font-semibold tracking-wider">
            {dayjs(event.start.date).format(timeFormats.monthDay)} <i className="gg-arrow-right mx-2"></i>
            {dayjs(event.end.date).format(timeFormats.monthDay)}
          </div>
          <div className="text-xs px-2 py-1 flex flex-grow justify-end">
            Day {event.position} of {event.duration}
          </div>
          <div className="flex justify-end text-gray-400 group-focus:text-blue-600 group-hover:text-blue-600 group-active:text-blue-600">
            <i className="gg-chevron-down"></i>
          </div>
        </div>
        <div className="mt-2 text-left flex items-start">{event.title}</div>
      </div>
    </>
  );
}

AllDayEventHeader.propTypes = exact({
  event: PropTypes.object.isRequired,
});

function EventDetails({ event, onDeleteEvent }) {
  return (
    <div className="text-gray-700 text-sm pb-2 px-4">
      <div className="mt-2" id="event-description">
        This event will take place somewhere, on the edge of the Earth. Might be useful to take something with me, such
        as a bottle of water or some snacks. Also, I shall wear very light clothes as the weather will probably be very
        warm.
      </div>
      <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded" id="event-location">
        <h3 className="font-semibold">Where?</h3>
        <p>21 jump street, NY 20383</p>
      </div>
      <div className="flex flex-row justify-end py-2">
        <DeleteButton callBack={() => onDeleteEvent(event)}>delete</DeleteButton>
      </div>
    </div>
  );
}
EventDetails.propTypes = exact({
  event: PropTypes.object.isRequired,
  onDeleteEvent: PropTypes.func.isRequired,
});

function DeleteButton({ children, callBack }) {
  const outlineStyle = `flex flex-row items-center
                   bg-transparent rounded
                   text-xs text-red-700 align-middle 
                   py-2 px-3
                   hover:bg-red-700 hover:text-white focus:outline-none focus:bg-red-700  focus:text-white
                   `;

  return (
    <Button callBack={callBack} css={outlineStyle} withFocus={false}>
      {children}
    </Button>
  );
}

export default Event;
