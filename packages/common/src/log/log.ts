export const LogLevel = {
  trace: "trace",
  debug: "debug",
  info: "info",
  warn: "warn",
  error: "error",
} as const;
export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

export const LogLevelForce = {
  traceF: "traceF",
  debugF: "debugF",
  infoF: "infoF",
  warnF: "warnF",
  errorF: "errorF",
} as const;
export type LogLevelForce = (typeof LogLevelForce)[keyof typeof LogLevelForce];

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

const getLevelForceFromLevel = (level: LogLevel): LogLevelForce => {
  return (level + "F") as LogLevelForce;
};

const _log: Record<LogLevel | LogLevelForce, Log> = {} as any;
const _glog: Record<LogLevel | LogLevelForce, GLog> = {} as any;
const _clog: Record<LogLevel | LogLevelForce, GLog> = {} as any;

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

    const levelForce = getLevelForceFromLevel(level);
    _log[levelForce] = _logF[level];
    _glog[levelForce] = _glogF[level];
    _clog[levelForce] = _clogF[level];
  }
};

// initialize =====
setForceLoggers();
filterLoggers();

export const log: Record<LogLevel | LogLevelForce, Log> = {} as any;
export const glog: Record<LogLevel | LogLevelForce, GLog> = {} as any;
export const clog: Record<LogLevel | LogLevelForce, GLog> = {} as any;

for (const level of Object.values(LogLevel)) {
  log[level] = (...args) => _log[level](...args);
  glog[level] = (name, ...args) => _glog[level](name, ...args);
  clog[level] = (name, ...args) => _clog[level](name, ...args);

  const levelForce = getLevelForceFromLevel(level);
  log[levelForce] = (...args) => _log[levelForce](...args);
  glog[levelForce] = (name, ...args) => _glog[levelForce](name, ...args);
  clog[levelForce] = (name, ...args) => _clog[levelForce](name, ...args);
}

// just try functions =====
// generate prefixed log function
export const prefixedLog = (logger: Log, ...prefixes: unknown[]): Log => {
  return (...args: unknown[]) => {
    logger(...prefixes, ...args);
  };
};

export const prefixedGLog = (logger: GLog, ...prefixes: unknown[]): GLog => {
  return (groupName: string, ...args: unknown[]) => {
    logger(groupName, ...prefixes, ...args);
  };
};
