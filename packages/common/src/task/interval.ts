export const getSetInterval = (
  callback: () => void,
  delay?: number | undefined,
): (() => void) => {
  const timeout = setInterval(callback, delay);
  return () => clearInterval(timeout);
};
