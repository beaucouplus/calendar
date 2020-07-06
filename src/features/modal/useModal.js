import { useReducer } from "react";

function modalReducer(state, action) {
  switch (action.type) {
    case "display":
      return { date: action.date, displayed: true, chosenEventId: null };
    case "chooseEvent":
      return { date: action.date, displayed: true, chosenEventId: action.eventId };
    case "close":
      return { date: null, displayed: false, chosenEventId: null };
    default:
      return state;
  }
}

function useModal() {
  const [status, dispatch] = useReducer(modalReducer, { displayed: false, date: null, chosenEventId: null });

  const display = (date) => dispatch({ type: "display", date });
  const chooseEvent = (date, eventId) => dispatch({ type: "chooseEvent", date, eventId });
  const close = () => dispatch({ type: "close" });

  return { status, display, chooseEvent, close };
}

export default useModal;
