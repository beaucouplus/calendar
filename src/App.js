import React, { useState, useContext, useEffect } from "react";
import dayjs from "dayjs";
import YearView from "./YearView";
import MonthView from "./MonthView";
import { Button, OutlineButton } from "./Button";
import Modal from "./Modal";
import DayModal from "./DayModal";
import { EventContext, EventStore } from "./EventContext";

function App() {
  const currentDate = new Date();

  const [year, setYear] = useState(currentDate.getFullYear());
  const monthStart = dayjs(currentDate).startOf("month").toDate();
  const [startOfMonth, setStartOfMonth] = useState(monthStart);
  const [currentView, setCurrentView] = useState("MonthView");

  function selectView(view) {
    setCurrentView(view);
  }

  return (
    <EventStore>
      <div className="w-screen h-screen flex flex-col">
        <Header year={year} onSetYear={setYear} onSelectView={selectView} />
        <CalendarView
          view={currentView}
          year={year}
          startOfMonth={startOfMonth}
        />
      </div>
    </EventStore>
  );
}

function Header({ year, onSetYear, onSelectView }) {
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
        <ul className="flex flex-row h-full items-center align-middle space-x-2 pr-10 border-r border-gray-500">
          <li>
            <Button callBack={() => onSelectView("YearView")}>Y</Button>
          </li>
          <li>
            <Button callBack={() => onSelectView("MonthView")}>M</Button>
          </li>
        </ul>
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

function CalendarView({ view, year, startOfMonth }) {
  const views = {
    YearView,
    MonthView,
  };

  const CurrentView = views[view];

  return (
    <div className="flex-grow">
      <CurrentView year={year} startOfMonth={startOfMonth} />
    </div>
  );
}

export default App;
