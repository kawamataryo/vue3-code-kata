export const triggerCustomEvent = (
  selector: string,
  eventName: string
): void => {
  const target = document.querySelector(selector);
  target?.dispatchEvent(new Event(eventName));
};
