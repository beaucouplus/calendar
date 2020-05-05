import dayjs from "dayjs";
import isLeapYear from "dayjs/plugin/isLeapYear";
import { range } from "./utils";
dayjs.extend(isLeapYear);

function createYearCalendarCells(year, events) {
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
        const date = new Date(year, month - 1, day, 0, 0, 0, 0);
        const dailyEvents = events.filter(
          (event) => event.date === dayjs(date).format("YYYY-MM-DD")
        );

        daysInMonth[day].push({
          month: month,
          day: day,
          hasDate: true,
          date: date,
          events: dailyEvents,
        });
      }
    });
  });
  return daysInMonth;
}

const dummyEvents = [
  { id: 1, date: "2020-04-13", time: "11:00", title: "go to the beach" },
  {
    id: 2,
    date: "2020-04-13",
    time: "17:00",
    title: "play FF7 with Ryan and Simon",
  },
  {
    id: 3,
    date: "2020-04-13",
    time: "21:00",
    title: "Drinks with Natasha and Pepito at the hacienda near the cemetery.",
  },
  { id: 4, date: "2020-04-19", time: "15:00", title: "confinement" },
  { id: 5, date: "2020-05-20", time: "15:00", title: "poule au pot" },
];

export { createYearCalendarCells, dummyEvents };
