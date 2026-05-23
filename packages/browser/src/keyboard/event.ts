import { KeyEventType } from "./type";

export const listenKeyboardEvent = (
  type: KeyEventType,
  handler: (e: KeyboardEvent) => void,
  target: Window | HTMLElement | Document = document,
): (() => void) => {
  const _handler = (e: Event) => handler(e as KeyboardEvent);

  target.addEventListener(type, _handler);
  return () => target.removeEventListener(type, _handler);
};
