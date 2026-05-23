export const MouseButtonCode = {
  Left: 0,
  Middle: 1,
  Right: 2,
  Back: 3,
  Forward: 4,
} as const;
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
