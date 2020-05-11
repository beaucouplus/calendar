import React, { useEffect } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

function MonthView({ startOfMonth }) {
  let viewStart = dayjs(startOfMonth, "YYYY-MM-DD");

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
    daysInMonth[viewStart.format("YYYY-MM-DD")] = [];
    viewStart = viewStart.add(1, "day");
  }

  useEffect(() =>
    console.log(
      "monthview",
      viewStart.format("YYYY-MM-DD"),
      viewEnd.format("YYYY-MM-DD")
    )
  );

  return (
    <div className="grid grid-cols-7 h-full border divide-y divide-x">
      {Object.keys(daysInMonth).map((d) => (
        <div>{d}</div>
      ))}
    </div>
  );
}

export default MonthView;
