export const KeyEventType = {
  KeyDown: "keydown",
  KeyUp: "keyup",
} as const;
export type KeyEventType = (typeof KeyEventType)[keyof typeof KeyEventType];

export const KeyCode = {
  ArrowUp: "ArrowUp",
  ArrowDown: "ArrowDown",
  ArrowLeft: "ArrowLeft",
  ArrowRight: "ArrowRight",
  Enter: "Enter",
  Space: " ",
  Backspace: "Backspace",
  Escape: "Escape",
  F11: "F11",
  N1: "1",
  N2: "2",
  N3: "3",
  N4: "4",
  N5: "5",
  N6: "6",
  N7: "7",
  N8: "8",
  N9: "9",
  N0: "0",
} as const;
export type KeyCode = (typeof KeyCode)[keyof typeof KeyCode];
