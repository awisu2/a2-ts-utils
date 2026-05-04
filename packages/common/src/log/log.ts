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

const canLog = (lowLevel: LogLevel, targetLevel: LogLevel): boolean => {
  return logHierarchy[targetLevel] >= logHierarchy[lowLevel];
};
type Log = (...args: unknown[]) => void;
type GLog = (groupName: string, ...args: unknown[]) => void;

const getLogger = (level: LogLevel) => {
  return (...args: unknown[]) => {
    (console[level] || console.log)(...args);
  };
};

const getGroupLogger = (
  logLevel: LogLevel,
  isCollapsed: boolean = false,
): GLog => {
  return (groupName: string, ...args: unknown[]) => {
    let isStarted = false;
    try {
      if (isCollapsed) {
        console.groupCollapsed?.(groupName);
      } else {
        console.group?.(groupName);
      }
      isStarted = true;

      const logFn = console[logLevel] || console.log;
      logFn(...args);
    } catch (error) {
      console.error(error);
    } finally {
      if (isStarted) {
        console.groupEnd?.();
      }
    }
  };
};

// filter loggers by setted level =====
let thresholdLevel: LogLevel = LogLevel.trace;

export const getThresholdLevel = () => {
  return thresholdLevel;
};

export const setThresholdLevel = (level: LogLevel) => {
  thresholdLevel = level;
  filterLoggers();
};

const _log: Record<LogLevel, Log> = {} as any;
const _glog: Record<LogLevel, GLog> = {} as any;
const _clog: Record<LogLevel, GLog> = {} as any;

const _logF: Record<LogLevel, Log> = {} as any;
const _glogF: Record<LogLevel, GLog> = {} as any;
const _clogF: Record<LogLevel, GLog> = {} as any;

const setForceLoggers = () => {
  for (const level of Object.values(LogLevel)) {
    _logF[level] = getLogger(level);
    _glogF[level] = getGroupLogger(level);
    _clogF[level] = getGroupLogger(level, true);
  }
};

const emptyLogger = () => {};

const filterLoggers = () => {
  for (const level of Object.values(LogLevel)) {
    const active = canLog(thresholdLevel, level);
    _log[level] = active ? _logF[level] : emptyLogger;
    _glog[level] = active ? _glogF[level] : emptyLogger;
    _clog[level] = active ? _clogF[level] : emptyLogger;
  }
};

// initialize =====
setForceLoggers();
filterLoggers();

export const log: Record<LogLevel, Log> = {} as any;
export const logF: Record<LogLevel, Log> = {} as any;
export const glog: Record<LogLevel, GLog> = {} as any;
export const glogF: Record<LogLevel, GLog> = {} as any;
export const clog: Record<LogLevel, GLog> = {} as any;
export const clogF: Record<LogLevel, GLog> = {} as any;

for (const level of Object.values(LogLevel)) {
  log[level] = (...args) => _log[level](...args);
  glog[level] = (name, ...args) => _glog[level](name, ...args);
  clog[level] = (name, ...args) => _clog[level](name, ...args);

  logF[level] = (...args) => _logF[level](...args);
  glogF[level] = (name, ...args) => _glogF[level](name, ...args);
  clogF[level] = (name, ...args) => _clogF[level](name, ...args);
}
