import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import EventForm from "./EventForm";
import Event from "./Event";
import { sortEvents } from "./calendar";
import { EventContext } from "./EventContext";

dayjs.extend(isBetween);

function DayView({ events, chosenEventId, date, displayForm, onCloseForm }) {
  const { onAddEvent } = useContext(EventContext);

  function setCurrentView() {
    if (displayForm) return "EventForm";
    if (events) return "DayPlanning";
    return "EmptyPlanning";
  }

  const currentView = setCurrentView();
  const sortedEvents = sortEvents(events);

  const views = { EventForm, DayPlanning, EmptyPlanning };

  const viewProps = {
    EventForm: {
      events,
      date,
      onAddEvent,
      display: true,
      onClose: onCloseForm,
    },
    DayPlanning: { events: sortedEvents, chosenEventId },
    EmptyPlanning: {},
  };
  const CurrentDayPlanningView = views[currentView];

  return (
    <div className="flex flex-col flex-grow bg-gray-200 px-6 shadow-inner">
      <CurrentDayPlanningView {...viewProps[currentView]} />
    </div>
  );
}

DayView.propTypes = exact({
  events: PropTypes.array,
  chosenEventId: PropTypes.number,
  date: PropTypes.string.isRequired,
  displayForm: PropTypes.bool.isRequired,
  onCloseForm: PropTypes.func.isRequired,
});

const EmptyPlanning = () => (
  <div className="mt-10 text-blue-700 text-2xl tracking-wider">
    No events today.
  </div>
);

function DayPlanning({ events, chosenEventId }) {
  const filterEventsBetween = (eventList, lowerLimit, upperLimit) => {
    if (!eventList) return false;
    return eventList.filter((event) => {
      const eventTime = dayjs(event.start.datetime, "HH:mm");
      return eventTime.isBetween(
        dayjs(lowerLimit, "HH:mm"),
        dayjs(upperLimit, "HH:mm"),
        null,
        "[)"
      );
    });
  };
  const timedEvents = events.filter((e) => !e.allDay);
  const allDayevents = events.filter((e) => e.allDay);
  const morningEvents = filterEventsBetween(timedEvents, "00:00", "11:59");
  const afternoonEvents = filterEventsBetween(timedEvents, "12:00", "18:59");
  const eveningEvents = filterEventsBetween(timedEvents, "19:00", "23:59");

  return (
    <div className="grid grid-rows mt-10 mb-20">
      <EventList
        events={allDayevents}
        title="All Day"
        isShown={allDayevents.length > 0}
        chosenEventId={chosenEventId}
        marginBottom={8}
      />
      <EventList
        events={morningEvents}
        title="Morning"
        isShown={morningEvents.length > 0}
        chosenEventId={chosenEventId}
      />
      <EventList
        events={afternoonEvents}
        title="Afternoon"
        isShown={afternoonEvents.length > 0}
        chosenEventId={chosenEventId}
      />
      <EventList
        events={eveningEvents}
        title="Evening"
        isShown={eveningEvents.length > 0}
        chosenEventId={chosenEventId}
      />
    </div>
  );
}

DayPlanning.propTypes = exact({
  events: PropTypes.array,
  chosenEventId: PropTypes.number,
});

function EventList({
  events,
  chosenEventId,
  title,
  isShown,
  marginBottom = 2,
}) {
  return (
    <>
      {isShown && (
        <div className={`mb-${marginBottom}`}>
          <div className="h-auto flex self-stretch">
            <ul className="block w-full space-y-2">
              <h2 className="pl-4 text-md text-blue-700">{title}</h2>
              {events &&
                events.map((event) => (
                  <Event
                    key={event.id}
                    event={event}
                    chosenEventId={chosenEventId}
                  />
                ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

EventList.propTypes = exact({
  events: PropTypes.array.isRequired,
  chosenEventId: PropTypes.number,
  title: PropTypes.string.isRequired,
  isShown: PropTypes.bool.isRequired,
});

export default DayView;
