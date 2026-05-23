export declare const MouseButtonCode: {
  readonly Left: 0;
  readonly Middle: 1;
  readonly Right: 2;
  readonly Back: 3;
  readonly Forward: 4;
};
export type MouseButtonCode =
  (typeof MouseButtonCode)[keyof typeof MouseButtonCode];

export const MouseEventType = {
  Click: "click",
  DblClick: "dblclick",
  ContextMenu: "contextmenu",

  // Mouse Events =====
  MouseDown: "mousedown",
  MouseUp: "mouseup",
  MouseMove: "mousemove",
  MouseEnter: "mouseenter",
  MouseLeave: "mouseleave",
  MouseOver: "mouseover",
  MouseOut: "mouseout",
} as const;
export type MouseEventType =
  (typeof MouseEventType)[keyof typeof MouseEventType];

export const listenMouseEvent = (
  mouseEventType: MouseEventType,
  callback: (event: MouseEvent) => void,
  element: Window | HTMLElement | Document = window,
): (() => void) => {
  const handler = (event: Event) => {
    callback(event as MouseEvent);
  };
  element.addEventListener(mouseEventType, handler);

  const unsubscribe = () => {
    element.removeEventListener(mouseEventType, handler);
  };

  return unsubscribe;
};

export const listenMouseWheel = (
  callback: (event: WheelEvent) => void,
  element: Window | HTMLElement | Document = window,
): (() => void) => {
  const handler = (event: Event) => {
    callback(event as WheelEvent);
  };
  element.addEventListener("wheel", handler);

  const unsubscribe = () => {
    element.removeEventListener("wheel", handler);
  };

  return unsubscribe;
};
