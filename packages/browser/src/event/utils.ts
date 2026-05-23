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
