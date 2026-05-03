export const LogLevel = {
  trace: "trace",
  debug: "debug",
  info: "info",
  warn: "warn",
  error: "error",
} as const;
export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

export const logs = (level: LogLevel, ...args: any[]) => {
  switch (level) {
    case LogLevel.info:
      logInfo(...args);
      break;
    case LogLevel.warn:
      logWarn(...args);
      break;
    case LogLevel.error:
      logError(...args);
      break;
    case LogLevel.debug:
      logDebug(...args);
      break;
    case LogLevel.trace:
      logTrace(...args);
      break;
  }
};

export const logInfo = (...args: any[]) => console.info(...args);
export const logDebug = (...args: any[]) => console.debug(...args);
export const logWarn = (...args: any[]) => console.warn(...args);
export const logError = (...args: any[]) => console.error(...args);
export const logTrace = (...args: any[]) => console.trace(...args);

// alias =====
export const log = logInfo;
