import React, { useState, useContext, useEffect } from "react";
import dayjs from "dayjs";
import CalendarYearTable from "./CalendarYearTable";
import { Button, OutlineButton } from "./Button";
import Modal from "./Modal";
import DayModal from "./DayModal";
import { EventContext, EventStore } from "./EventContext";

function App() {
  const [year, setYear] = useState(new Date().getFullYear());

  return (
    <EventStore>
      <div className="w-screen h-screen flex flex-col">
        <Header year={year} onSetYear={setYear} />
        <div className="flex-grow">
          <CalendarYearTable year={year} />
        </div>
      </div>
    </EventStore>
  );
}

function Header({ year, onSetYear }) {
  const { events } = useContext(EventContext);
  const [showModal, setShowModal] = useState(false);

  const previousYear = () => onSetYear(year - 1);
  const nextYear = () => onSetYear(year + 1);
  const today = new Date(dayjs().startOf("day"));
  const todayEvents = events[dayjs().startOf("day").format("YYYY-MM-DD")];

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
            <Button callBack={previousYear}>
              <i className="gg-arrow-left-o "></i>
            </Button>
          </li>
          <li>
            <Button callBack={nextYear}>
              <i className="gg-arrow-right-o"></i>
            </Button>
          </li>
        </ul>
        <ul className="flex flex-row h-full items-center align-middle">
          <li>
            <OutlineButton callBack={openModal}>Today</OutlineButton>
            <Modal showModal={showModal} onCloseModal={closeModal}>
              <DayModal date={today} events={todayEvents} />
            </Modal>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;
