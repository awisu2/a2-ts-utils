export const LogLevel = {
  trace: "trace",
  debug: "debug",
  info: "info",
  warn: "warn",
  error: "error",
} as const;
export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

const logHierarchy = {
  [LogLevel.trace]: 0,
  [LogLevel.debug]: 1,
  [LogLevel.info]: 2,
  [LogLevel.warn]: 3,
  [LogLevel.error]: 4,
};

export const canLog = (lowLevel: LogLevel, targetLevel: LogLevel): boolean => {
  return logHierarchy[targetLevel] >= logHierarchy[lowLevel];
};
export type Log = (...args: any[]) => void;

export let globalLogLevel: LogLevel = LogLevel.trace;

export const setGlobalLogLevel = (level: LogLevel) => {
  globalLogLevel = level;
};

export const logFunc = (level: LogLevel, isAllow: boolean = false) => {
  return (...args: any[]) => {
    if (isAllow || canLog(globalLogLevel, level)) {
      (console[level] || console.log)(...args);
    } else {
      return () => {};
    }
  };
};

export const logInfo: Log = logFunc(LogLevel.info);
export const logDebug: Log = logFunc(LogLevel.debug);
export const logWarn: Log = logFunc(LogLevel.warn);
export const logError: Log = logFunc(LogLevel.error);
export const logTrace: Log = logFunc(LogLevel.trace);

export const logInfoF: Log = logFunc(LogLevel.info, true);
export const logDebugF: Log = logFunc(LogLevel.debug, true);
export const logWarnF: Log = logFunc(LogLevel.warn, true);
export const logErrorF: Log = logFunc(LogLevel.error, true);
export const logTraceF: Log = logFunc(LogLevel.trace, true);

// alias =====
export const log = logInfo;
