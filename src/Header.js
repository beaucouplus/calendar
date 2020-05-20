import React, { useContext, useState } from "react";
import { Button, OutlineButton } from "./Button";
import { EventContext } from "./EventContext";
import dayjs from "dayjs";
import Modal from "./Modal";
import DayModal from "./DayModal";

function Header({
  year,
  onSetYear,
  startOfMonth,
  onSetStartOfMonth,
  currentView,
  onSelectView,
}) {
  const { events } = useContext(EventContext);
  const [showModal, setShowModal] = useState(false);

  const previousYear = () => onSetYear(year - 1);
  const nextYear = () => onSetYear(year + 1);

  const previousMonth = () =>
    onSetStartOfMonth(dayjs(startOfMonth).subtract(1, "month"));
  const nextMonth = () =>
    onSetStartOfMonth(dayjs(startOfMonth).add(1, "month"));
  const today = new Date(dayjs().startOf("day"));
  const todayEvents = events[dayjs().startOf("day").format("YYYY-MM-DD")];

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const headerStyle = `flex flew-row
                       w-full h-auto
                       font-semibold text-gray-700`;
  return (
    <div className={headerStyle}>
      <div className="flex items-center border-r border-gray-500 px-10 py-2">
        <h1 className="flex flex-row  items-center text-2xl tracking-wide">
          <i className="gg-calendar-today mr-3"></i>Calendar
        </h1>
      </div>
      <div className="flex flex-row items-center px-10 space-x-5">
        <ul className="flex flex-row h-full items-center align-middle pr-10 border-r border-gray-500">
          <li>
            <Button
              callBack={() => onSelectView("YearView")}
              css="w-16 justify-center font-semibold border-l border-t border-b border-gray-500 rounded-l py-1 hover:bg-blue-800 hover:text-white"
            >
              Y
            </Button>
          </li>
          <li>
            <Button
              callBack={() => onSelectView("MonthView")}
              css="w-16 justify-center font-semibold border border-gray-500 rounded-r py-1 hover:bg-blue-800 hover:text-white"
            >
              M
            </Button>
          </li>
        </ul>

        <CurrentViewMenu
          currentView={currentView}
          year={year}
          onPreviousYear={previousYear}
          onNextYear={nextYear}
          startOfMonth={startOfMonth}
          onPreviousMonth={previousMonth}
          onNextMonth={nextMonth}
        />
      </div>
      <div className="flex flex-grow">
        <ul className="flex flex-row h-full items-center align-middle pr-5 ">
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

function CurrentViewMenu({
  currentView,
  year,
  onPreviousYear,
  onNextYear,
  startOfMonth,
  onPreviousMonth,
  onNextMonth,
}) {
  const viewProps = {
    YearView: { period: year, previous: onPreviousYear, next: onNextYear },
    MonthView: {
      period: dayjs(startOfMonth).format("MMMM YYYY"),
      previous: onPreviousMonth,
      next: onNextMonth,
    },
  };

  return <ViewMenu {...viewProps[currentView]} />;
}

function ViewMenu({ period, previous, next }) {
  return (
    <div className="flex space-x-6 px-5 h-full items-center align-middle border-r border-gray-500">
      <ul className="flex flex-row space-x-3">
        <li>
          <Button callBack={previous}>
            <i className="gg-arrow-left-o "></i>
          </Button>
        </li>
        <li>
          <Button callBack={next}>
            <i className="gg-arrow-right-o"></i>
          </Button>
        </li>
      </ul>
      <h2 className="w-48 text-xl tracking-wide ">{period}</h2>
    </div>
  );
}

export default Header;
