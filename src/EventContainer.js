import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { Button } from "./Button";
import EventForm from "./EventForm";
import { EventContext } from "./EventContext";

dayjs.extend(isBetween);

function EventContainer({ events, date, displayForm, onCloseForm }) {
  const { onAddEvent, onDeleteEvent } = useContext(EventContext);

  const [chosenEvent, setChosenEvent] = useState(undefined);

  const choosePage = (calEvent) => {
    calEvent ? setChosenEvent(calEvent) : setChosenEvent(undefined);
  };
  function setCurrentPage() {
    if (displayForm) return "form";
    if (chosenEvent) return "event";
    if (!chosenEvent && events) return "eventList";
    return "none";
  }

  function handleDeleteEvent(event) {
    setChosenEvent(undefined);
    onDeleteEvent(event);
  }

  const currentPage = setCurrentPage();
  const sortedEvents =
    events &&
    events.sort((a, b) => {
      const aTime = dayjs(a.time, "HH:mm");
      const bTime = dayjs(b.time, "HH:mm");

      return aTime - bTime;
    });
  return (
    <div className="h-full bg-gray-200 pt-4 px-8 shadow-inner">
      <EventsMenu
        events={sortedEvents}
        isDisplayed={currentPage !== "none" && currentPage !== "form"}
        chosenEvent={chosenEvent}
        onChoosePage={choosePage}
      />
      <EventForm
        events={events}
        date={date}
        display={currentPage === "form"}
        onAddEvent={onAddEvent}
        onClose={onCloseForm}
      />
      {currentPage === "event" && (
        <EventDetails event={chosenEvent} onDeleteEvent={handleDeleteEvent} />
      )}
      <>
        {currentPage === "eventList" && (
          <EventList events={sortedEvents} onChooseEvent={choosePage} />
        )}
      </>
      <>
        {currentPage === "none" && (
          <div className="text-blue-700 text-2xl tracking-wider">
            No events today.
          </div>
        )}
      </>
    </div>
  );
}

function EventsMenu({ events, isDisplayed, onChoosePage, chosenEvent }) {
  return (
    <>
      {isDisplayed && (
        <div className="flex mb-10 space-x-2">
          <HorizontalMenu>
            <MenuItem callBack={() => onChoosePage()} isSelected={!chosenEvent}>
              <i className="gg-list mr-3"></i> Planning
            </MenuItem>
          </HorizontalMenu>
          <>
            {events && (
              <HorizontalMenu>
                {events.map((event) => (
                  <MenuItem
                    key={event.id}
                    callBack={() => onChoosePage(event)}
                    isSelected={event === chosenEvent}
                  >
                    {event.time}
                  </MenuItem>
                ))}
              </HorizontalMenu>
            )}
          </>
        </div>
      )}
    </>
  );
}

function HorizontalMenu({ children }) {
  return (
    <ul className="bg-white flex flex-row text-sm rounded px-3 pt-3 items-center">
      {children}
    </ul>
  );
}

function MenuItem({ children, isSelected, callBack }) {
  const style = `flex px-4 pb-2 border-b-4 border-white hover:border-blue-600 cursor-pointer`;
  const selectedStyle = isSelected ? "border-blue-600" : "";

  return (
    <li className={`${style} ${selectedStyle}`} onClick={callBack}>
      {children}
    </li>
  );
}

function EventDetails({ event, onDeleteEvent }) {
  return (
    <div className="flex flex-row justify between w-full space-x-5 p-10 bg-white text-gray-800 rounded-lg">
      <div className="font-bold text-2xl text-blue-700 tracking-wider pr-4 border-r-2 border-gray-300">
        {event.time}
      </div>
      <div className="flex flex-grow">
        <div className="flex-grow text-2xl">{event.title}</div>
      </div>
      <div className="justify-end">
        <DeleteButton callBack={() => onDeleteEvent(event)}>
          <i className="gg-trash mr-3"></i> Delete
        </DeleteButton>
      </div>
    </div>
  );
}

function EventList({ events, onChooseEvent }) {
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

  const morningEvents = filterEventsBetween(events, "00:00", "11:59");
  const afternoonEvents = filterEventsBetween(events, "12:00", "18:59");
  const eveningEvents = filterEventsBetween(events, "19:00", "23:59");

  return (
    <div className="grid grid-rows w-full gap-2">
      <EventCol
        events={morningEvents}
        onChooseEvent={onChooseEvent}
        title="Morning"
        isShown={morningEvents.length > 0}
      />
      <EventCol
        events={afternoonEvents}
        onChooseEvent={onChooseEvent}
        title="Afternoon"
        isShown={afternoonEvents.length > 0}
      />
      <EventCol
        events={eveningEvents}
        onChooseEvent={onChooseEvent}
        title="Evening"
        isShown={eveningEvents.length > 0}
      />
    </div>
  );
}

EventList.propTypes = {
  events: PropTypes.array,
  onChooseEvent: PropTypes.func.isRequired,
};

function EventCol({ events, title, onChooseEvent, isShown }) {
  return (
    <>
      {isShown && (
        <div className="grid grid-cols-4 gap-6 mb-2">
          <div className="py-4 align-middle text-right"></div>
          <div className="h-auto col-span-3 flex self-stretch">
            <ul className="block w-full space-y-2">
              <h2 className="pl-4 text-md text-blue-700">{title}</h2>
              {events &&
                events.map((event, idx) => (
                  <Event
                    key={idx}
                    event={event}
                    onChooseEvent={onChooseEvent}
                  />
                ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

EventCol.propTypes = {
  events: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  onChooseEvent: PropTypes.func.isRequired,
};

function Event({ event, onChooseEvent }) {
  const style = `flex items-center 
    w-full h-auto 
    py-2 px-4
    bg-white 
    border-2 border-transparent rounded-lg hover:border-blue-600 shadow-sm
    text-md text-gray-800
    cursor-pointer`;

  const chooseEvent = (event) => {
    onChooseEvent(event);
  };

  return (
    <li className={style} onClick={() => chooseEvent(event)}>
      <div className="w-1/8 py-1 text-blue-700 font-semibold tracking-wider text-right">
        {event.time}
      </div>
      <div className="pl-4">{event.title}</div>
    </li>
  );
}

Event.propTypes = {
  event: PropTypes.object.isRequired,
  onChooseEvent: PropTypes.func.isRequired,
};

function DeleteButton({ children, callBack }) {
  const outlineStyle = `flex flex-row items-center
                 bg-transparent hover:bg-red-800
                 text-sm text-red-700 align-middle hover:text-white
                 py-2 px-4
                 border border-red-700 hover:border-transparent rounded
                 `;

  return (
    <Button callBack={callBack} css={outlineStyle}>
      {children}
    </Button>
  );
}

export default EventContainer;
