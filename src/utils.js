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
        const date = new Date(year, month - 1, day, 0, 0, 0, 0);
        daysInMonth[day].push({
          month: month,
          day: day,
          hasDate: true,
          date: date,
        });
      }
    });
  });
  return daysInMonth;
}

export { range, createCells };
