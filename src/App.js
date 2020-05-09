import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import CalendarYearTable from "./CalendarYearTable";
import { Button, OutlineButton } from "./Button";
import Modal from "./Modal";
import DayModal from "./DayModal";
import { dummyEvents } from "./calendar";

function App() {
  const [year, setYear] = useState(new Date().getFullYear());

  const [events, setEvents] = useState(dummyEvents);

  function addEvent(event) {
    const newEvent = { ...event, id: events.length + 1 };
    setEvents([...events, newEvent]);
  }

  function deleteEvent(event) {
    setEvents(events.filter((e) => e.id !== event.id));
  }

  useEffect(() => console.log("prout"));

  return (
    <div className="w-screen h-screen flex flex-col">
      <Header
        year={year}
        onSetYear={setYear}
        events={events}
        onAddEvent={addEvent}
        onDeleteEvent={deleteEvent}
      />
      <div className="flex-grow">
        <CalendarYearTable
          year={year}
          events={events}
          onAddEvent={addEvent}
          onDeleteEvent={deleteEvent}
        />
      </div>
    </div>
  );
}

function Header({ year, onSetYear, events, onAddEvent, onDeleteEvent }) {
  const [showModal, setShowModal] = useState(false);

  const previousYear = () => onSetYear(year - 1);
  const nextYear = () => onSetYear(year + 1);
  const today = new Date(dayjs().startOf("day"));
  const todayEvents = events.filter(
    (event) => event.date === dayjs().startOf("day").format("YYYY-MM-DD")
  );

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const headerStyle = `flex flew-row
                       h-auto
                       font-semibold text-gray-700`;
  return (
    <div className={headerStyle}>
      <div className="flex items-center border-r border-gray-500 px-10 py-2">
        <h1 className="flex flex-row  items-center text-2xl tracking-wide">
          <i className="gg-calendar-today mr-3"></i>Calendar
        </h1>
      </div>
      <div className="flex flex-row items-center px-10 space-x-5">
        <h2 className="text-xl tracking-wide">{year}</h2>
        <ul className="flex flex-row h-full items-center align-middle space-x-2 pr-10 border-r border-gray-500">
          <li>
            <Button callBack={previousYear} css="flex items-center">
              <i className="gg-arrow-left-o "></i>
            </Button>
          </li>
          <li>
            {" "}
            <Button callBack={nextYear} css="flex items-center">
              <i className="gg-arrow-right-o"></i>
            </Button>
          </li>
        </ul>
        <ul className="flex flex-row h-full items-center align-middle">
          <li>
            <OutlineButton callBack={openModal}>Today</OutlineButton>
            <Modal showModal={showModal} onCloseModal={closeModal}>
              <DayModal
                date={today}
                events={todayEvents}
                onAddEvent={onAddEvent}
                onDeleteEvent={onDeleteEvent}
              />
            </Modal>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;
