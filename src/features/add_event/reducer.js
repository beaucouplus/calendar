// PACKAGES
import produce from "immer";
import dayjs from "dayjs";

// SCRIPTS
import { numbersToHourString } from "../../utils";
import timeFormats from "../../common/timeFormats";

class timeHelper {
  constructor(formats) {
    this.formats = formats;
  }

  toYear = (time) => dayjs(time).format(this.formats.year);
  toHumanReadableTime = (hour, minute) => numbersToHourString(hour, minute);
  updateHour = (currentTime, hour) => dayjs(currentTime, this.formats.iso).hour(hour).format(this.formats.iso);
  updateMinute = (currentTime, minute) => dayjs(currentTime, this.formats.iso).minute(minute).format(this.formats.iso);

  updateTime = (currentTime, hour, minute) =>
    dayjs(currentTime, this.formats.iso).hour(hour).minute(minute).format(this.formats.iso);
}

const eventFormReducer = produce((draft, action) => {
  const timeManager = new timeHelper(timeFormats);
  let [hours, minutes] = draft.startTimeInput.inputValue.split(":");
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
      draft.event.start.datetime = timeManager.updateHour(draft.event.start.datetime, action.name);
      hours = action.name;
      draft.startTimeInput.inputValue = timeManager.toHumanReadableTime(hours, minutes);
      break;

    case "addStartMinutesFromTimePicker":
      draft.event.start.datetime = timeManager.updateMinute(draft.event.start.datetime, action.name);
      minutes = action.name;
      draft.startTimeInput.inputValue = timeManager.toHumanReadableTime(hours, minutes);
      break;

    case "addStartTimeFromTimeInput":
      draft.startTimeInput.inputValue = action.name;
      break;

    case "validateStartTime":
      draft.startTimeInput.valid = true;
      draft.startTimeInput.inputValue = timeManager.toHumanReadableTime(hours, minutes);
      draft.event.start.datetime = timeManager.updateTime(draft.event.start.datetime, hours, minutes);
      break;

    case "invalidateStartTime":
      draft.startTimeInput.valid = false;
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
