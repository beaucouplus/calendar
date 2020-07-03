import React, { useContext } from "react";

// PACKAGES
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

// COMPONENTS
import EventForm from "../../add_event/EventForm";
import Event from "../../event/Event";

// SCRIPTS
import { sortEvents } from "../../../common/calendar";

// CONTEXT
import { EventContext } from "../../../common/EventContext";

// DAYJS PLUGINS
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
    DayPlanning: { events: sortedEvents, chosenEventId, date },
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

const EmptyPlanning = () => <div className="mt-10 text-blue-700 text-2xl tracking-wider">No events today.</div>;

function DayPlanning({ events, chosenEventId, date }) {
  const filterEventsBetween = (eventList, lowerLimit, upperLimit) => {
    const createIsoDateTime = (date, time) => date + "T" + time + ":00+02:00";

    if (!eventList) return false;
    return eventList.filter((event) => {
      const eventDayLowerLimit = createIsoDateTime(date, lowerLimit);
      const eventDayUpperLimit = createIsoDateTime(date, upperLimit);
      const eventTime = dayjs(event.start.datetime);
      return eventTime.isBetween(dayjs(eventDayLowerLimit), dayjs(eventDayUpperLimit), null, "[)");
    });
  };
  const timedEvents = events.filter((e) => !e.allDay);
  const allDayEvents = events.filter((e) => e.allDay);
  const morningEvents = filterEventsBetween(timedEvents, "00:00", "11:59");
  const afternoonEvents = filterEventsBetween(timedEvents, "12:00", "18:59");
  const eveningEvents = filterEventsBetween(timedEvents, "19:00", "23:59");

  return (
    <div className="grid grid-rows mt-10 mb-20">
      <EventList
        events={allDayEvents}
        title="All Day"
        isShown={allDayEvents.length > 0}
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
  date: PropTypes.string.isRequired,
});

function EventList({ events, chosenEventId, title, isShown, marginBottom = 2 }) {
  return (
    <>
      {isShown && (
        <div className={`mb-${marginBottom}`}>
          <div className="h-auto flex self-stretch">
            <ul className="block w-full space-y-2">
              <h2 className="pl-4 text-md text-blue-700">{title}</h2>
              {events && events.map((event) => <Event key={event.id} event={event} chosenEventId={chosenEventId} />)}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

EventList.defaultProps = {
  marginBottom: 2,
};

EventList.propTypes = exact({
  events: PropTypes.array.isRequired,
  chosenEventId: PropTypes.number,
  title: PropTypes.string.isRequired,
  isShown: PropTypes.bool.isRequired,
  marginBottom: PropTypes.number.isRequired,
});

export default DayView;
