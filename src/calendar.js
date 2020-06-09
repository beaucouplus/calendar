import dayjs from "dayjs";
import isLeapYear from "dayjs/plugin/isLeapYear";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { range } from "./utils";
dayjs.extend(isLeapYear);
dayjs.extend(isSameOrBefore);

function groupEventsByDateAndType(events) {
  const groupedEvents = {};

  events.forEach((event) => {
    if (event.start.date) {
      const duration =
        dayjs(event.end.date).diff(dayjs(event.start.date), "d") + 1;
      const datesToUpdate = [];
      let currentDate = dayjs(event.start.date);
      let position = 1;

      while (currentDate.isSameOrBefore(dayjs(event.end.date))) {
        datesToUpdate.push({
          date: currentDate.format("YYYY-MM-DD"),
          event: {
            ...event,
            allDay: true,
            position: position,
            duration: duration,
            displayed:
              currentDate.format("dddd") === "Monday" || position === 1,
          },
        });
        currentDate = currentDate.add(1, "day");
        position = position + 1;
      }

      datesToUpdate.forEach((date) => {
        updateEventList(groupedEvents, date.event, date.date);
      });
    } else {
      const eventDate = dayjs(event.start.datetime).format("YYYY-MM-DD");
      const eventToAdd = { ...event, allDay: false };
      updateEventList(groupedEvents, eventToAdd, eventDate);
    }
  });
  return groupedEvents;
}
function updateEventList(eventList, event, date) {
  const existingDate = eventList[date];
  existingDate ? existingDate.push(event) : (eventList[date] = [event]);
}

const sortEvents = (events) => {
  if (events) {
    return events.sort((a, b) => {
      if (a.allDay && !b.allDay) return -1;
      const firstDate = a.start.date ? b.start.date : a.start.datetime;
      const secondDate = b.start.date ? b.start.date : b.start.datetime;
      const aTime = dayjs(firstDate);
      const bTime = dayjs(secondDate);

      return aTime - bTime;
    });
  } else {
    return [];
  }
};

function createYearCalendarCells(year, eventsByDate) {
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
        const dailyEvents = eventsByDate[dayjs(date).format("YYYY-MM-DD")];
        daysInMonth[day].push({
          month: month,
          day: day,
          hasDate: true,
          date: date,
          events: dailyEvents,
          hasEvents: dailyEvents && dailyEvents.length > 0,
        });
      }
    });
  });
  return daysInMonth;
}

function monthViewDays(startOfMonth, eventsByDate) {
  let viewStart = dayjs(startOfMonth);

  if (viewStart.format("dddd") !== "Monday") {
    while (viewStart.format("dddd") !== "Monday") {
      viewStart = viewStart.subtract(1, "day");
    }
  }
  let viewEnd = dayjs(startOfMonth).endOf("month");
  if (viewEnd.format("dddd") !== "Sunday") {
    while (viewEnd.format("dddd") !== "Sunday") {
      viewEnd = viewEnd.add(1, "day");
    }
  }
  const daysInMonth = {};

  while (viewStart.isBefore(viewEnd)) {
    const dailyEvents = eventsByDate[viewStart.format("YYYY-MM-DD")];
    daysInMonth[viewStart.format("YYYY-MM-DD")] = dailyEvents;
    viewStart = viewStart.add(1, "day");
  }

  return daysInMonth;
}

const theme = {
  calendarYearTable: {
    cellStyle: {
      event: {
        past: {
          sunday:
            "bg-orange-200 text-red-500 hover:bg-orange-400 hover:text-white",
          default:
            "bg-orange-200 text-orange-500 hover:bg-orange-400 hover:text-white",
        },
        today: {
          sunday:
            "bg-teal-300 text-teal-700 hover:bg-teal-400 hover:text-white",
          default:
            "bg-teal-300 text-teal-700 hover:bg-teal-400 hover:text-white",
        },
        future: {
          sunday:
            "bg-orange-300 text-red-600 hover:bg-orange-400 hover:text-white",
          default:
            "bg-orange-300 text-orange-800 hover:bg-orange-400 hover:text-white",
        },
      },
      noEvent: {
        past: {
          sunday: "hover:bg-gray-200 text-red-300",
          default: "hover:bg-gray-200 text-gray-500",
        },
        today: {
          sunday:
            "bg-blue-200 text-blue-600 hover:bg-blue-400 hover:text-white",
          default:
            "bg-blue-200 text-blue-600 hover:bg-blue-400 hover:text-white",
        },
        future: {
          sunday: "bg-gray-300 text-red-600 hover:bg-gray-400",
          default: "hover:bg-gray-200 text-gray-700",
        },
      },
    },
  },
};

function getDateStatus(date) {
  const today = dayjs().startOf("day");
  const currentDate = dayjs(date).startOf("day");

  if (currentDate.isBefore(today)) return "past";
  if (
    currentDate.isAfter(today) ||
    currentDate.year() < dayjs(new Date()).year()
  )
    return "future";
  return "today";
}

function getWeekday(date) {
  const weekday = dayjs(date).format("dddd");

  if (weekday === "Sunday") return "sunday";
  return "default";
}

function getEventStatus(events) {
  if (events) return "event";
  return "noEvent";
}

const calendarCellStyle = (date, events) => {
  return theme.calendarYearTable.cellStyle[getEventStatus(events)][
    getDateStatus(date)
  ][getWeekday(date)];
};

export {
  groupEventsByDateAndType,
  sortEvents,
  createYearCalendarCells,
  monthViewDays,
  calendarCellStyle,
};
