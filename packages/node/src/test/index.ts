import { hello as commonHello } from "@a2-ts-utils/common/test";
export const hello = () =>
  "Hello from Node3!" + " with common: " + commonHello();
