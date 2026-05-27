import { MouseEventType, WheelDirection } from "./type";

export const listenMouseEvent = (
  mouseEventType: MouseEventType,
  handler: (event: MouseEvent) => void,
  target: Window | HTMLElement | Document = document,
  isPassive: boolean = true,
): (() => void) => {
  const _handler = (event: Event) => {
    handler(event as MouseEvent);
  };
  target.addEventListener(mouseEventType, _handler, { passive: isPassive });

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
  target.addEventListener("wheel", _handler, { passive: true });

  const unsubscribe = () => {
    target.removeEventListener("wheel", _handler);
  };

  return unsubscribe;
};

export const getWheelDirectionByEvent = (event: WheelEvent): WheelDirection => {
  return event.deltaY < 0 ? WheelDirection.Up : WheelDirection.Down;
};
