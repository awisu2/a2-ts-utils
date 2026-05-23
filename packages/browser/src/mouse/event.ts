import { MouseEventType } from "./type";

export const listenMouseEvent = (
  mouseEventType: MouseEventType,
  handler: (event: MouseEvent) => void,
  target: Window | HTMLElement | Document = document,
): (() => void) => {
  const _handler = (event: Event) => {
    handler(event as MouseEvent);
  };
  target.addEventListener(mouseEventType, _handler);

  const unsubscribe = () => {
    target.removeEventListener(mouseEventType, _handler);
  };

  return unsubscribe;
};

export const listenMouseWheel = (
  handler: (event: WheelEvent) => void,
  target: Window | HTMLElement | Document = document,
): (() => void) => {
  const _handler = (event: Event) => {
    handler(event as WheelEvent);
  };
  target.addEventListener("wheel", _handler);

  const unsubscribe = () => {
    target.removeEventListener("wheel", _handler);
  };

  return unsubscribe;
};
