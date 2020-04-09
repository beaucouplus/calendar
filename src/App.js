import React, { useEffect } from "react";
import dayjs from "dayjs";
import isLeapYear from "dayjs/plugin/isLeapYear";
dayjs.extend(isLeapYear);

function range(start, end) {
  if (start === end) return [start];
  return [start, ...range(start + 1, end)];
}

function createCells(year) {
  const months = range(1, 12);
  const monthDays = range(1, 31);

  const daysPerMonth = {
    1: 31,
    2: dayjs(`${year}-01-01`).isLeapYear() ? 29 : 28,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31,
  };

  const daysInMonth = {};
  monthDays.forEach((day) => (daysInMonth[day] = []));

  months.forEach(function (month) {
    monthDays.forEach(function (day) {
      if (day > daysPerMonth[month]) {
        daysInMonth[day].push({
          month: month,
          day: day,
          hasDate: false,
          date: undefined,
        });
      } else {
        daysInMonth[day].push({
          month: month,
          day: day,
          hasDate: true,
          date: new Date(year, month - 1, day),
        });
      }
    });
  });
  return daysInMonth;
}

function App() {
  const year = "2020";
  const monthDays = range(1, 31);
  const columns = range(1, 14);
  const css = { cellBorders: "border border-gray-500" };
  const cells = createCells(year);

  return (
    <div className="px-2 w-screen h-screen">
      <h1 className="font-semibold text-gray-700">Year plan {year}</h1>
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
    </div>
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
    <tr>
      <td className={tdClass}>{monthDay}</td>
      {days.map((day, id) =>
        day.hasDate ? (
          <DayCell
            weekday={dayjs(day.date).format("dddd")}
            css={css}
            key={id}
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

function DayCell({ weekday, css }) {
  const isSunday =
    weekday === "Sunday" ? "bg-red-300 text-red-600" : "text-gray-700 ";

  return (
    <td className={`px-2 ${css.cellBorders} font-semibold ${isSunday}`}>
      {weekday[0]}
    </td>
  );
}

export default App;
