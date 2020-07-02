import dayjs from "dayjs";
import timeFormats from "../../common/timeFormats";

function createDefaultEvent(date) {
  const defaultEventStartTime = dayjs(date).add(12, "hours");
  return {
    event: {
      start: {
        date,
        datetime: defaultEventStartTime.format(timeFormats.iso),
      },
      end: {
        date,
        datetime: defaultEventStartTime.format(timeFormats.iso),
      },
      title: "Please add a title",
    },
    isAllDayEvent: false,
    readyForSubmit: false,
    startInput: {
      time: defaultEventStartTime.format(timeFormats.hourMinutes),
      valid: true,
    },
    endInput: {
      time: defaultEventStartTime.add(1, "hour").format(timeFormats.hourMinutes),
      valid: true,
    },
  };
}

export default createDefaultEvent;
