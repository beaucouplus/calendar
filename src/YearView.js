import React, { useEffect, useContext, useState } from "react";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import Modal from "./Modal";
import { range } from "./utils";
import { createYearCalendarCells, calendarCellStyle } from "./calendar";
import DayModal from "./DayModal";
import { EventContext } from "./EventContext";
dayjs.extend(LocalizedFormat);

function YearView({ year }) {
  const { events } = useContext(EventContext);

  const monthDays = range(1, 31);
  const css = { cellBorders: "border border-gray-500" };

  const cells = createYearCalendarCells(year, events);

  return (
    <table className="table-fixed w-full h-full border text-xs bg-white">
      <thead className={`${css.cellBorders}`}>
        <MonthsRow css={css} />
      </thead>
      <tbody>
        {monthDays.map((monthDay) => {
          return <DaysRow days={cells[monthDay]} key={monthDay} css={css} />;
        })}
      </tbody>
    </table>
  );
}

YearView.propTypes = exact({
  year: PropTypes.number.isRequired,
});

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
    <tr>
      <td className={tdClass}>{monthDay}</td>
      {days.map((day, id) =>
        day.hasDate ? (
          <DayCell date={day.date} events={day.events} css={css} key={id} />
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

function DayCell({ date, events, css }) {
  const [showModal, setShowModal] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const closeModal = () => setShowModal(false);

  const weekday = dayjs(date).format("dddd");

  const tdStyle = calendarCellStyle(date, events);

  return (
    <>
      <td
        className={`px-2 ${css.cellBorders} ${tdStyle} font-semibold cursor-pointer`}
        onClick={() => setShowModal(true)}
        onMouseEnter={() => setShowDate(true)}
        onMouseLeave={() => setShowDate(false)}
      >
        {weekday[0]} <CellDate date={date} isShown={showDate} />
      </td>
      <Modal showModal={showModal} onCloseModal={closeModal}>
        <DayModal date={date} events={events} />
      </Modal>
    </>
  );
}

DayCell.propTypes = exact({
  date: PropTypes.instanceOf(Date).isRequired,
  events: PropTypes.array,
  css: PropTypes.object,
});

function CellDate({ isShown, date }) {
  return (
    <>{isShown && <span className="px-1">{dayjs(date).format("D")}</span>}</>
  );
}

export default YearView;