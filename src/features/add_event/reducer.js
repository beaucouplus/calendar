// PACKAGES
import produce from "immer";
import dayjs from "dayjs";

// SCRIPTS
import { hourStringtoNumbers, isoDateTimeToString } from "../../utils";
import timeFormats from "../../common/timeFormats";

const MAX_DURATION = 12;

class timeHelper {
  constructor(formats) {
    this.formats = formats;
  }

  toYear = (time) => dayjs(time).format(this.formats.year);

  toHourMinute = isoDateTimeToString;
  updateHour = (currentTime, hour) => dayjs(currentTime, this.formats.iso).hour(hour).format(this.formats.iso);

  updateMinute = (currentTime, minute) => dayjs(currentTime, this.formats.iso).minute(minute).format(this.formats.iso);

  updateTime = (currentTime, hour, minute) => {
    return dayjs(currentTime, this.formats.iso).hour(hour).minute(minute).format(this.formats.iso);
  };

  validateTime = (timeString) => {
    const [currentHours, currentMinutes] = hourStringtoNumbers(timeString);
    return (
      timeString.length === 5 && currentHours >= 0 && currentHours < 24 && currentMinutes >= 0 && currentMinutes <= 59
    );
  };

  incrementTime = (time, maxTime, step = 30) => {
    let currentTime = dayjs(time, timeFormats.iso);

    const maxEndTime = dayjs(maxTime, timeFormats.iso).add(MAX_DURATION, "hours");
    currentTime = currentTime.add(step, "minutes");

    if (currentTime > maxEndTime) return maxEndTime.format(timeFormats.iso);
    return currentTime.format(timeFormats.iso);
  };

  subtractTime = (time, minTime, step = 30) => {
    let currentTime = dayjs(time, timeFormats.iso);
    const minEndTime = dayjs(minTime, timeFormats.iso);
    currentTime = currentTime.subtract(step, "minutes");

    if (currentTime < minEndTime) return minEndTime.format(timeFormats.iso);
    return currentTime.format(timeFormats.iso);
  };
}

const eventFormReducer = produce((draft, action) => {
  const timeManager = new timeHelper(timeFormats);
  switch (action.type) {
    case "updateTitle":
      draft.event.title = action.name;
      break;

    case "toggleDate":
      draft.isAllDayEvent = !draft.isAllDayEvent;
      break;

    case "addEndDateFromInput":
      draft.event.end.date = action.name;
      break;

    case "addEndDateFromPicker":
      draft.event.end.date = timeManager.toYear(action.name);
      break;

    case "addStartHourFromTimePicker":
      const newHour = timeManager.updateHour(draft.event.start.datetime, action.name);
      draft.event.start.datetime = newHour;
      draft.event.end.datetime = newHour;
      const formattedNewHour = timeManager.toHourMinute(newHour);
      draft.startInput.time = formattedNewHour;
      draft.endInput.time = formattedNewHour;
      break;

    case "addStartMinutesFromTimePicker":
      const newMinutes = timeManager.updateMinute(draft.event.start.datetime, action.name);
      draft.event.start.datetime = newMinutes;
      draft.event.end.datetime = newMinutes;
      const formattedNewMinutes = timeManager.toHourMinute(newMinutes);
      draft.startInput.time = formattedNewMinutes;
      draft.endInput.time = formattedNewMinutes;
      break;

    case "addStartTimeFromTimeInput":
      draft.startInput.time = action.name;
      const validStartTime = timeManager.validateTime(draft.startInput.time);
      draft.startInput.valid = validStartTime;
      if (validStartTime) {
        const [startHour, startMinute] = hourStringtoNumbers(action.name);
        const newStartTime = timeManager.updateTime(draft.event.start.datetime, startHour, startMinute);
        draft.event.start.datetime = newStartTime;
        draft.event.end.datetime = newStartTime;
        draft.endInput.time = action.name;
        draft.endInput.valid = true;
      }
      break;

    case "addEndTimeFromPicker":
      const futureEndTime = timeManager.incrementTime(draft.event.end.datetime, draft.event.end.datetime);
      draft.event.end.datetime = futureEndTime;
      draft.endInput.time = timeManager.toHourMinute(futureEndTime);
      break;

    case "subtractEndTimeFromPicker":
      const pastEndTime = timeManager.subtractTime(draft.event.end.datetime, draft.event.start.datetime);
      draft.event.end.datetime = pastEndTime;
      draft.endInput.time = timeManager.toHourMinute(pastEndTime);
      break;

    case "addEndTimeFromTimeInput":
      draft.endInput.time = action.name;
      const validEndTime = timeManager.validateTime(action.name);
      draft.endInput.valid = validEndTime;
      if (validEndTime) {
        const [endHour, endMinute] = hourStringtoNumbers(action.name);
        draft.event.end.datetime = timeManager.updateTime(draft.event.event.datetime, endHour, endMinute);
      }
      break;

    case "submit":
      if (draft.isAllDayEvent) {
        draft.event.start.datetime = null;
        draft.event.end.datetime = null;
      } else {
        draft.event.start.date = null;
        draft.event.end.date = null;
      }
      draft.readyForSubmit = true;
      break;

    default:
  }
});

export default eventFormReducer;
