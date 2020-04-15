import React, { useState } from "react";
import CalendarYearTable from "./CalendarYearTable";
import { Modal, ModalStore } from "./Modal";
import { Button } from "./Button";

function App() {
  const [year, setYear] = useState(new Date().getFullYear());

  return (
    <div className="px-2 w-screen h-screen">
      <Header year={year} onSetYear={setYear} />
      <CalendarYearTable year={year} />
    </div>
  );
}

function Header({ year, onSetYear }) {
  const previousYear = () => onSetYear(year - 1);
  const nextYear = () => onSetYear(year + 1);

  return (
    <div className="font-semibold text-gray-700">
      Year plan
      <Button callBack={previousYear}>{"<"}</Button>
      {year}
      <Button callBack={nextYear}>{">"}</Button>
      <Modal />
    </div>
  );
}

export default App;
