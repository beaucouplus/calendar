import React, { useEffect, useContext } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { Modal, ModalStore, ModalContext } from "./Modal";
import { range, createCells } from "./utils";

dayjs.extend(LocalizedFormat);

function CalendarYearTable({ year }) {
  const monthDays = range(1, 31);
  const columns = range(1, 14);
  const css = { cellBorders: "border border-gray-500" };
  const events = {
    "2020-04-13": [{ title: "go to the beach" }, { title: "play FF7" }],
    "2020-04-19": [{ title: "confinement" }],
    "2020-05-20": [{ title: "poule au pot" }],
  };

  const cells = createCells(year, events);

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
          return <DaysRow days={cells[monthDay]} key={monthDay} css={css} />;
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

function DaysRow({ days, css }) {
  const tdClass = `${css.cellBorders} font-semibold text-center text-gray-700`;
  const monthDay = dayjs(days[0].date).format("D");
  return (
    <ModalStore>
      <tr>
        <td className={tdClass}>{monthDay}</td>
        {days.map((day, id) =>
          day.hasDate ? (
            <Modal key={id}>
              <DayCell
                date={day.date}
                events={day.events}
                css={css}
                key={id}
                triggerText={"prout"}
              />
            </Modal>
          ) : (
            <EmptyCell css={css} key={id} />
          )
        )}
        <td className={tdClass}>{monthDay}</td>
      </tr>
    </ModalStore>
  );
}

function EmptyCell({ css }) {
  return <td className={`${css.cellBorders}`}></td>;
}

function DayCell({ date, events, css }) {
  const { onShowModal } = useContext(ModalContext);

  const weekday = dayjs(date).format("dddd");

  const getTDStyle = () => {
    const today = dayjs().startOf("day");
    const currentDate = dayjs(date).startOf("day");
    const isCurrentYear = currentDate.year() === dayjs(new Date()).year();
    const isPast = currentDate.isBefore(today);
    const isToday = currentDate.isSame(today);

    if (events)
      return `bg-orange-300 text-orange-800 hover:bg-orange-400 hover:text-white`;
    if (isCurrentYear && isPast && weekday === "Sunday")
      return `hover:bg-gray-200 text-red-300`;
    if (isCurrentYear && isPast) return `hover:bg-gray-200 text-gray-500`;
    if (isToday)
      return `bg-blue-200 text-blue-600 hover:bg-blue-400 hover:text-white`;
    if (weekday === "Sunday")
      return `bg-red-300 text-red-600 hover:bg-red-400 hover:text-white`;
    return `hover:bg-gray-200 text-gray-700`;
  };

  const tdStyle = getTDStyle();

  return (
    <td
      className={`px-2 ${css.cellBorders} ${tdStyle} font-semibold cursor-pointer`}
      onClick={() => onShowModal(<EventList date={date} events={events} />)}
    >
      {weekday[0]}
    </td>
  );
}

DayCell.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  events: PropTypes.array,
  css: PropTypes.object,
};

function EventList({ date, events }) {
  return (
    <div className="mx-2">
      <h2 className="text-xl font-medium text-gray-800 leading-loose border-b-2 border-yellow-600">
        {dayjs(date).format("LL")}
      </h2>
      <ul className="list-inside list-disc mt-2 text-gray-800">
        {events && events.map((event, idx) => <li key={idx}>{event.title}</li>)}
      </ul>
    </div>
  );
}

export default CalendarYearTable;
