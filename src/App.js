// packages
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

// local files
import Header from "./Header";
import YearView from "./YearView";
import MonthView from "./MonthView";
import { EventStore } from "./EventContext";

function App() {
  const currentDate = new Date();

  const [year, setYear] = useState(currentDate.getFullYear());
  const monthStart = dayjs(currentDate).startOf("month").format("YYYY-MM-DD");
  const [startOfMonth, setStartOfMonth] = useState(monthStart);
  const [currentView, setCurrentView] = useState("MonthView");

  function selectView(view) {
    setCurrentView(view);
  }

  return (
    <EventStore>
      <div className="w-screen h-screen flex flex-col">
        <Header
          year={year}
          onSetYear={setYear}
          currentView={currentView}
          onSelectView={selectView}
          startOfMonth={startOfMonth}
          onSetStartOfMonth={setStartOfMonth}
        />
        <CalendarView
          view={currentView}
          year={year}
          startOfMonth={startOfMonth}
        />
      </div>
    </EventStore>
  );
}

function CalendarView({ view, year, startOfMonth }) {
  const views = {
    YearView,
    MonthView,
  };

  const viewProps = {
    YearView: { year },
    MonthView: { startOfMonth },
  };

  const CurrentView = views[view];

  return (
    <div className="flex-grow">
      <CurrentView {...viewProps[view]} />
    </div>
  );
}

export default App;
