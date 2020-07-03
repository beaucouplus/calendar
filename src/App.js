import React, { useState } from "react";

// PACKAGES
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import dayjs from "dayjs";

// COMPONENTS
import Header from "./features/menu/Header";
import YearView from "./features/calendar_views/year_view/YearView";
import MonthView from "./features/calendar_views/month_view/MonthView";
import { EventStore } from "./common/EventContext";

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
        <CalendarView view={currentView} year={year} startOfMonth={startOfMonth} />
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

CalendarView.propTypes = exact({
  view: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  startOfMonth: PropTypes.string.isRequired,
});

export default App;
