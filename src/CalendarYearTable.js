import React, { useEffect, useContext } from "react";
import dayjs from "dayjs";
import { Modal, ModalStore, ModalContext } from "./Modal";
import { range, createCells } from "./utils";

function CalendarYearTable({ year }) {
  const monthDays = range(1, 31);
  const columns = range(1, 14);
  const css = { cellBorders: "border border-gray-500" };
  const events = {
    "2020-04-13": [{ title: "go to the beach" }],
    "2020-04-19": [{ title: "confinement" }],
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

    if (events) return `bg-orange-300 text-orange-800`;
    if (isCurrentYear && isPast && weekday === "Sunday") return `text-red-300`;
    if (isCurrentYear && isPast) return `text-gray-500`;
    if (isToday) return `bg-blue-200 text-blue-600`;
    if (weekday === "Sunday") return `bg-red-300 text-red-600`;
    return `text-gray-700`;
  };

  const tdStyle = getTDStyle();

  return (
    <td
      className={`px-2 ${css.cellBorders} ${tdStyle} font-semibold cursor-pointer`}
      onClick={() => onShowModal(weekday)}
    >
      {weekday[0]}
    </td>
  );
}

export default CalendarYearTable;
