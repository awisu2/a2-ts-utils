// event から 値が取得できる場合は取得
export const getValueByEvent = (event: Event): string => {
  const target = event.target;
  if (target && "value" in target) {
    return String((target as any).value);
  }

  const tagName = target instanceof Element ? target.tagName : "Unknown";
  throw new Error(
    `[getValueByEvent] target does not have a value property. tagName: ${tagName}`,
  );
};

export const getNumByEvent = (event: Event): number => {
  const value = getValueByEvent(event);

  // avoid empty 0 =====
  if (value.trim() === "") {
    throw new Error("[getNumByEvent] Value is empty.");
  }

  // check cast result =====
  const num = Number(value);
  if (Number.isNaN(num)) {
    throw new Error(
      `[getNumByEvent] Converted value is NaN. Raw value: ${value}`,
    );
  }
  return num;
};
