export const waitAsync = (waitMs: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, waitMs);
  });
};
