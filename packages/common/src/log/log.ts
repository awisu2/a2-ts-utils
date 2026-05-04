export const LogLevel = {
  trace: "trace",
  debug: "debug",
  info: "info",
  warn: "warn",
  error: "error",
} as const;
export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

export type Log = (...args: any[]) => void;

export const logInfo: Log = (...args: any[]) => console.info(...args);
export const logDebug: Log = (...args: any[]) => console.debug(...args);
export const logWarn: Log = (...args: any[]) => console.warn(...args);
export const logError: Log = (...args: any[]) => console.error(...args);
export const logTrace: Log = (...args: any[]) => console.trace(...args);

// alias =====
export const log = logInfo;
