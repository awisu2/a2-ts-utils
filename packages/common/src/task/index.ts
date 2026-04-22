export const wait = (waitMs: number) =>
  new Promise((resolve) => setTimeout(resolve, waitMs));
