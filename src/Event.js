import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button } from "./Button";

function Event({ event, onDeleteEvent }) {
  const [showDetails, setShowDetails] = useState(false);

  const handleDeleteEvent = (event) => {
    setShowDetails(false);
    onDeleteEvent(event);
  };

  const eventTitleStyle = `flex 
                   w-full h-auto 
                   rounded-lg
                   text-md text-gray-800
                   cursor-pointer`;

  return (
    <li className="block bg-white rounded-lg shadow-sm border-2 border-transparent hover:border-blue-600 py-2 px-4">
      <div
        className={eventTitleStyle}
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="w-1/8 text-blue-700 align-baseline font-semibold tracking-wider text-right">
          {event.time}
        </div>
        <div className="pl-4">{event.title}</div>
        <div className="flex flex-grow justify-end text-gray-400 hover:text-blue-600">
          <i className="gg-chevron-down"></i>
        </div>
      </div>
      {showDetails && (
        <EventDetails event={event} onDeleteEvent={handleDeleteEvent} />
      )}
    </li>
  );
}

Event.propTypes = {
  event: PropTypes.object.isRequired,
  onChooseEvent: PropTypes.func.isRequired,
};

function EventDetails({ event, onDeleteEvent }) {
  return (
    <div className="text-gray-700 text-sm">
      <div className="mt-2" id="event-description">
        This event will take place somewhere, on the edge of the Earth. Might be
        useful to take something with me, such as a bottle of water or some
        snacks. Also, I shall wear very light clothes as the weather will
        probably be very warm.
      </div>
      <div
        className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded"
        id="event-location"
      >
        <h3 className="font-semibold">Where?</h3>
        <p>21 jump street, NY 20383</p>
      </div>
      <div className="flex flex-row justify-end py-2">
        <DeleteButton callBack={() => onDeleteEvent(event)}>
          delete
        </DeleteButton>
      </div>
    </div>
  );
}

function DeleteButton({ children, callBack }) {
  const outlineStyle = `flex flex-row items-center
                   bg-transparent rounded
                   text-xs text-red-700 align-middle 
                   py-2 px-3
                   hover:bg-red-700 hover:text-white
                   `;

  return (
    <Button callBack={callBack} css={outlineStyle}>
      {children}
    </Button>
  );
}

export default Event;
