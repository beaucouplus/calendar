import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";
import { Button, OutlineButton } from "./Button";
import EventForm from "./EventForm";
dayjs.extend(customParseFormat);
dayjs.extend(isBetween);

function DayModal({ date, events, onAddEvent }) {
  const [displayForm, setDisplayForm] = useState(false);
  const [chosenEvent, setChosenEvent] = useState(undefined);

  function chooseCalEvent(calEvent) {
    setChosenEvent(calEvent);
  }

  const resetChosenEvent = () => setChosenEvent(undefined);

  function setCurrentPage() {
    if (chosenEvent) return "event";
    if (!chosenEvent && events) return "eventList";
    return "none";
  }

  const currentPage = setCurrentPage();
  return (
    <div className="h-full flex flex-col mx-8">
      <header className="border-b-2 border-gray-300 flex flex-row items-center">
        <h2 className="inline-block text-3xl font-medium text-gray-800 leading-loose mr-4">
          {dayjs(date).format("dddd")} {dayjs(date).format("LL")}
        </h2>
        <div className="relative flex-grow">
          <HeaderButton callBack={() => setDisplayForm(true)}>
            <i className="gg-add-r h-full mr-2"></i>Add Event
          </HeaderButton>
          <EventForm
            events={events}
            date={date}
            display={displayForm}
            onAddEvent={onAddEvent}
            onClose={() => setDisplayForm(false)}
          />
        </div>
      </header>
      <HoursList events={events} />
      <>
        {currentPage === "event" && (
          <EventDetails
            event={chosenEvent}
            onCloseEventDetails={resetChosenEvent}
          />
        )}
      </>
      <>
        {currentPage === "eventList" && (
          <EventList events={events} onChooseEvent={chooseCalEvent} />
        )}
      </>
    </div>
  );
}

DayModal.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  events: PropTypes.array,
  onAddEvent: PropTypes.func.isRequired,
};

function EventDetails({ event, onCloseEventDetails }) {
  return (
    <div className="h-full flex flex-row justify between w-full my-10 text-gray-800">
      <div className="font-bold text-3xl tracking-wider pr-4 border-r-2 border-gray-300">
        {event.time}
      </div>
      <div className="ml-5 flex flex-grow">
        <div className="flex-grow text-2xl">{event.title}</div>
        <div className="flex flex-none items-start justify-end">
          <OutlineButton callBack={() => onCloseEventDetails()}>
            ✕
          </OutlineButton>
        </div>
      </div>
    </div>
  );
}

function HoursList({ events }) {
  const sortedEvents =
    events &&
    events.sort((a, b) => {
      const aTime = dayjs(a.time, "HH:mm");
      const bTime = dayjs(b.time, "HH:mm");

      return aTime - bTime;
    });
  return (
    <>
      {events && (
        <div className="border-b-2 border-gray-300 flex flex-row">
          <ul className="flex flex-row divide-x-2 divide-gray-300 text-gray-800">
            {sortedEvents.map((event) => (
              <li className="p-2" key={event.id}>
                {event.time}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

function EventList({ events, onChooseEvent }) {
  const sortedEvents =
    events &&
    events.sort((a, b) => {
      const aTime = dayjs(a.time, "HH:mm");
      const bTime = dayjs(b.time, "HH:mm");

      return aTime - bTime;
    });

  const filterEventsBetween = (eventList, lowerLimit, upperLimit) => {
    if (!eventList) return false;
    return eventList.filter((event) => {
      const eventTime = dayjs(event.time, "HH:mm");
      return eventTime.isBetween(
        dayjs(lowerLimit, "HH:mm"),
        dayjs(upperLimit, "HH:mm"),
        null,
        "[)"
      );
    });
  };

  const morningEvents = filterEventsBetween(sortedEvents, "00:00", "11:59");
  const afternoonEvents = filterEventsBetween(sortedEvents, "12:00", "18:59");
  const eveningEvents = filterEventsBetween(sortedEvents, "19:00", "23:59");

  return (
    <div className="grid grid-cols-3 gap-8 w-full mt-10">
      <EventCol
        events={morningEvents}
        onChooseEvent={onChooseEvent}
        title="Morning"
      />
      <EventCol
        events={afternoonEvents}
        onChooseEvent={onChooseEvent}
        title="Afternoon"
      />
      <EventCol
        events={eveningEvents}
        onChooseEvent={onChooseEvent}
        title="Evening"
      />
    </div>
  );
}

EventList.propTypes = {
  events: PropTypes.array,
  onChooseEvent: PropTypes.func.isRequired,
};

function EventCol({ events, title, onChooseEvent }) {
  const titleTextColor =
    events && events.length > 0 ? "text-gray-800" : "text-gray-400";

  return (
    <div className="">
      <div className="py-2">
        <h2 className={`text-xl font-medium ${titleTextColor}`}>{title}</h2>
      </div>
      <div className="h-auto flex self-stretch mt-4 mb-6 pb-6">
        <ul className="block w-full list-inside list-disc text-gray-800">
          {events &&
            events.map((event, idx) => (
              <Event key={idx} event={event} onChooseEvent={onChooseEvent} />
            ))}
        </ul>
      </div>
    </div>
  );
}

EventCol.propTypes = {
  events: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  onChooseEvent: PropTypes.func.isRequired,
};

function Event({ event, onChooseEvent }) {
  const style = `block w-full h-auto 
    mb-4 p-4 
    border-2  border-gray-300 hover:border-blue-600
    text-lg text-gray-800
    cursor-pointer`;

  const chooseEvent = (event) => {
    onChooseEvent(event);
  };

  return (
    <li className={style} onClick={() => chooseEvent(event)}>
      <div className="h-auto py-1 font-bold tracking-wider border-b-2 border-gray-300">
        {event.time}
      </div>
      <div className="mt-2">{event.title}</div>
    </li>
  );
}

Event.propTypes = {
  event: PropTypes.object.isRequired,
  onChooseEvent: PropTypes.func.isRequired,
};

function HeaderButton({ children, callBack }) {
  const style = `flex flex-row items-center
                 bg-blue-700 hover:bg-blue-500
                 text-xs text-white font-semibold align-middle hover:text-white
                 py-2 px-4
                 rounded
                 cursor-pointer`;

  return (
    <Button callBack={callBack} css={style}>
      {children}
    </Button>
  );
}

export default DayModal;
