import React, { useEffect } from "react";
import moment from "moment";

function App() {
  const year = "2020";
  const monthDays = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
  ];

  return (
    <div className="px-2 w-screen h-screen">
      <h1 className="font-semibold text-gray-700">Year plan {year}</h1>
      <table className="table-fixed w-full border text-xs bg-white">
        <thead className="border border-gray-500">
          <tr>
            <Months />
          </tr>
          <tr>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((x) => (
              <td className="border border-gray-500 py-6">&nbsp;</td>
            ))}
          </tr>
          {monthDays.map((monthDay) => (
            <DateLine monthDay={monthDay} year={year} key={monthDay} />
          ))}
        </thead>
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

function DateLine({ monthDay, year }) {
  const tdClass = "border border-gray-500 font-semibold";

  const columns = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

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
