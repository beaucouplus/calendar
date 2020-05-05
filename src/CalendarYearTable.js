import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import Modal from "./Modal";
import { range } from "./utils";
import { createYearCalendarCells, dummyEvents } from "./calendar";
import DayModal from "./DayModal";
dayjs.extend(LocalizedFormat);

function CalendarYearTable({ year }) {
  const monthDays = range(1, 31);
  const columns = range(1, 14);
  const css = { cellBorders: "border border-gray-500" };

  const [events, setEvents] = useState(dummyEvents);
  const cells = createYearCalendarCells(year, events);

  function addEvent(event) {
    const newEvent = { ...event, id: events.length + 1 };
    setEvents([...events, newEvent]);
  }

  function deleteEvent(event) {
    setEvents(events.filter((e) => e.id !== event.id));
  }

  return (
    <table className="table-fixed w-full border text-xs bg-white">
      <thead className={`${css.cellBorders}`}>
        <MonthsRow css={css} />
      </thead>
      <tbody>
        <tr>
          {columns.map((x, id) => (
            <td className={`${css.cellBorders} py-6`} key={id}>
              &nbsp;
            </td>
          ))}
        </tr>
        {monthDays.map((monthDay) => {
          return (
            <DaysRow
              days={cells[monthDay]}
              key={monthDay}
              css={css}
              onAddEvent={addEvent}
              onDeleteEvent={deleteEvent}
            />
          );
        })}
      </tbody>
    </table>
  );
}

function MonthsRow({ css }) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const thClass = `${css.cellBorders} text-gray-700`;
  return (
    <tr>
      <th className={`w-8 ${thClass}`}></th>
      {months.map((month, id) => (
        <th key={id} className={thClass}>
          {month}
        </th>
      ))}
      <th className={`w-8 ${thClass}`}></th>
    </tr>
  );
}

function DaysRow({ days, css, onAddEvent, onDeleteEvent }) {
  const tdClass = `${css.cellBorders} font-semibold text-center text-gray-700`;
  const monthDay = dayjs(days[0].date).format("D");

  return (
    <tr>
      <td className={tdClass}>{monthDay}</td>
      {days.map((day, id) =>
        day.hasDate ? (
          <DayCell
            date={day.date}
            events={day.events}
            css={css}
            key={id}
            onAddEvent={onAddEvent}
            onDeleteEvent={onDeleteEvent}
          />
        ) : (
          <EmptyCell css={css} key={id} />
        )
      )}
      <td className={tdClass}>{monthDay}</td>
    </tr>
  );
}

function EmptyCell({ css }) {
  return <td className={`${css.cellBorders}`}></td>;
}

function DayCell({ date, events, css, onAddEvent, onDeleteEvent }) {
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);

  const weekday = dayjs(date).format("dddd");

  const cellStyle = {
    event: {
      past: {
        sunday:
          "bg-orange-200 text-red-500 hover:bg-orange-400 hover:text-white",
        allWeek:
          "bg-orange-200 text-orange-500 hover:bg-orange-400 hover:text-white",
      },
      now: {
        sunday: "bg-teal-300 text-teal-700 hover:bg-teal-400 hover:text-white",
        allWeek: "bg-teal-300 text-teal-700 hover:bg-teal-400 hover:text-white",
      },
      future: {
        sunday:
          "bg-orange-300 text-red-600 hover:bg-orange-400 hover:text-white",
        allWeek:
          "bg-orange-300 text-orange-800 hover:bg-orange-400 hover:text-white",
      },
    },
    empty: {
      past: {
        sunday: "hover:bg-gray-200 text-red-300",
        allWeek: "hover:bg-gray-200 text-gray-500",
      },
      now: {
        sunday: "bg-blue-200 text-blue-600 hover:bg-blue-400 hover:text-white",
        allWeek: "bg-blue-200 text-blue-600 hover:bg-blue-400 hover:text-white",
      },
      future: {
        sunday: "bg-gray-300 text-red-600 hover:bg-gray-400",
        allWeek: "hover:bg-gray-200 text-gray-700",
      },
    },
  };

  const getTDStyle = () => {
    const today = dayjs().startOf("day");
    const currentDate = dayjs(date).startOf("day");
    const isCurrentYear = currentDate.year() === dayjs(new Date()).year();
    const isPast = currentDate.isBefore(today);
    const isToday = currentDate.isSame(today);

    if (events.length > 0 && !isPast && weekday !== "Tuesday" && !isToday)
      return cellStyle.event.future.allWeek;
    if (events.length > 0 && !isPast && weekday !== "Tuesday" && isToday)
      return cellStyle.event.now.allWeek;
    if (events.length > 0 && !isPast && weekday === "Tuesday" && isToday)
      return cellStyle.event.now.sunday;
    if (events.length > 0 && !isPast && weekday === "Tuesday")
      return cellStyle.event.future.sunday;
    if (events.length > 0 && isPast && weekday === "Tuesday")
      return cellStyle.event.past.sunday;
    if (events.length > 0 && isPast && weekday !== "Tuesday")
      return cellStyle.event.past.allWeek;
    if (isCurrentYear && isPast && weekday === "Tuesday")
      return cellStyle.empty.past.sunday;
    if (isCurrentYear && isPast) return cellStyle.empty.past.allWeek;
    if (isToday && weekday === "Tuesday") return cellStyle.empty.now.sunday;
    if (isToday) return cellStyle.empty.now.allWeek;
    if (weekday === "Tuesday") return cellStyle.empty.future.sunday;
    return cellStyle.empty.future.allWeek;
  };

  const tdStyle = getTDStyle();

  return (
    <>
      <td
        className={`px-2 ${css.cellBorders} ${tdStyle} font-semibold cursor-pointer`}
        onClick={() => setShowModal(true)}
      >
        {weekday[0]}
      </td>
      <Modal showModal={showModal} onCloseModal={closeModal}>
        <DayModal
          date={date}
          events={events}
          onAddEvent={onAddEvent}
          onDeleteEvent={onDeleteEvent}
        />
      </Modal>
    </>
  );
}

DayCell.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  events: PropTypes.array,
  css: PropTypes.object,
};

export default CalendarYearTable;
