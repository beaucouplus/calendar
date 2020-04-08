import React, { useEffect } from "react";
import moment from "moment";

function range(start, end) {
  if (start === end) return [start];
  return [start, ...range(start + 1, end)];
}

function App() {
  const year = "2020";
  const monthDays = range(1, 31);
  const columns = range(1, 14);

  const css = {
    cellBorders: "border border-gray-500",
  };

  return (
    <div className="px-2 w-screen h-screen">
      <h1 className="font-semibold text-gray-700">Year plan {year}</h1>
      <table className="table-fixed w-full border text-xs bg-white">
        <thead className={`${css.cellBorders}`}>
          <tr>
            <Months />
          </tr>
          <tr>
            {columns.map((x) => (
              <td className={`${css.cellBorders} py-6`}>&nbsp;</td>
            ))}
          </tr>
        </thead>
        {monthDays.map((monthDay) => (
          <DateLine monthDay={monthDay} year={year} key={monthDay} css={css} />
        ))}
      </table>
    </div>
  );
}

function Months() {
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

  const thClass = "text-gray-700 border border-gray-500 px-1";
  return (
    <>
      <th className={`w-8 ${thClass}`}></th>
      {months.map((month, id) => (
        <th key={id} className={thClass}>
          {month}
        </th>
      ))}
      <th className={`w-8 ${thClass}`}></th>
    </>
  );
}

function DateLine({ monthDay, year, css }) {
  const tdClass = `${css.cellBorders} font-semibold`;

  const columns = range(0, 11);

  const twoDigitsMonthDay = monthDay < 10 ? `0${monthDay}` : `${monthDay}`;
  const baseDate = `${year}-01-${twoDigitsMonthDay}`;

  function addMonths(months) {
    const nextDate = moment(baseDate).clone().add(months, "months");
    const formattedDate = {
      monthDay: nextDate.date(),
      weekDayName: nextDate.format("dddd"),
    };
    return monthDay <= formattedDate.monthDay ? formattedDate : undefined;
  }

  const dates = columns.map((months) => addMonths(months));

  return (
    <tr>
      <td className={`text-center text-gray-700 ${tdClass} `}>{monthDay}</td>
      {dates.map((weekday, id) => (
        <td
          className={`px-2 ${tdClass} ${
            !!weekday && weekday.weekDayName === "Sunday"
              ? "bg-red-300 text-red-600"
              : "text-gray-700 "
          }`}
          key={id}
        >
          {weekday && weekday.weekDayName[0]}
        </td>
      ))}
      <td className={`text-center text-gray-700 ${tdClass}`}>{monthDay}</td>
    </tr>
  );
}

export default App;
