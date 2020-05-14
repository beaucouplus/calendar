import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useContext,
  useRef,
} from "react";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import dayjs from "dayjs";
import { monthViewDays } from "./calendar";
import Modal from "./Modal";
import DayModal from "./DayModal";
import { EventContext } from "./EventContext";

function MonthView({ startOfMonth }) {
  const { events } = useContext(EventContext);
  const [maxItemHeight, setMaxItemHeight] = useState(0);
  const monthDaysContainerRef = useRef();

  const daysInView = monthViewDays(startOfMonth, events);
  const currentMonth = dayjs(startOfMonth).month();
  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useLayoutEffect(() => {
    const maxHeight =
      monthDaysContainerRef.current.offsetHeight /
      Math.ceil(Object.keys(daysInView).length / 7);
    setMaxItemHeight(maxHeight);
  }, []);

  return (
    <div className="flex flex-col flex-grow h-full border-t border-gray-500">
      <div className="grid grid-cols-7 divide-x divide-gray-300 border-b border-gray-300">
        {weekDays.map((wDay) => (
          <div
            className="px-2 py-2 text-md font-semibold text-gray-800"
            key={wDay}
          >
            {wDay}
          </div>
        ))}
      </div>
      <div
        className="grid grid-cols-7 h-full divide-x divide-gray-300"
        ref={monthDaysContainerRef}
      >
        {Object.keys(daysInView).map((date) => (
          <MonthDay
            date={dayjs(date, "YYYY-MM-DD").toDate()}
            month={currentMonth}
            events={daysInView[date]}
            maxHeight={maxItemHeight}
            key={date}
          />
        ))}
      </div>
    </div>
  );
}

MonthView.propTypes = exact({
  startOfMonth: PropTypes.instanceOf(Date).isRequired,
});

function MonthDay({ date, month, events, maxHeight }) {
  const [showModal, setShowModal] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const titleRef = useRef();

  const monthDay = dayjs(date).date();

  const chooseStyle = () => {
    const today = dayjs().startOf("day");
    const currentDate = dayjs(date).startOf("day");
    if (month !== currentDate.month() || currentDate.isBefore(today))
      return "past";
    if (currentDate.isSame(today)) return "today";
    return "future";
  };

  const styles = {
    past: "text-gray-500",
    today: "bg-blue-100 text-blue-600",
    future: "text-gray-700",
  };

  useLayoutEffect(() => {
    const finalHeight = maxHeight - titleRef.current.offsetHeight - 20;
    setContentHeight(finalHeight);
  });

  const closeModal = () => setShowModal(false);
  return (
    <>
      <div
        className={`${
          styles[chooseStyle()]
        } p-2  border-b border-b-500 cursor-pointer`}
        onClick={() => setShowModal(true)}
      >
        <div className={`text-md font-semibold`} ref={titleRef}>
          {monthDay}
        </div>
        <ul
          className={`block overflow-hidden text-xs text-gray-700`}
          style={{ height: `${contentHeight}px` }}
        >
          {events &&
            events.map((event) => (
              <li className="truncate">
                {event.time} {event.title}
              </li>
            ))}
        </ul>
      </div>
      <Modal showModal={showModal} onCloseModal={closeModal}>
        <DayModal date={date} events={events} />
      </Modal>
    </>
  );
}
MonthDay.propTypes = exact({
  date: PropTypes.instanceOf(Date).isRequired,
  month: PropTypes.string.isRequired,
  events: PropTypes.array.isRequired,
  maxHeight: PropTypes.number.isRequired,
});

export default MonthView;
