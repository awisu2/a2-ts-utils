// group log
// e.g. glog("myGroup", yourdata...);
import { canLog, LogLevel, globalLogLevel } from "./log";

export type Glog = (groupName: string, ...args: any[]) => void;

export const grouplogger = (
  isCollapsed: boolean = false,
  logLevel: LogLevel,
  isAllow: boolean = false,
): Glog => {
  return (groupName: string, ...args: any[]) => {
    if (!isAllow && !canLog(globalLogLevel, logLevel)) {
      return;
    }

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

// group log =====
export const glogInfo = grouplogger(false, LogLevel.info);
export const glogDebug = grouplogger(false, LogLevel.debug);
export const glogWarn = grouplogger(false, LogLevel.warn);
export const glogError = grouplogger(false, LogLevel.error);
export const glogTrace = grouplogger(false, LogLevel.trace);
export const clogInfo = grouplogger(true, LogLevel.info);
export const clogDebug = grouplogger(true, LogLevel.debug);
export const clogWarn = grouplogger(true, LogLevel.warn);
export const clogError = grouplogger(true, LogLevel.error);
export const clogTrace = grouplogger(true, LogLevel.trace);

export const glog = glogInfo;
export const clog = clogInfo;

export const glogInfoF = grouplogger(false, LogLevel.info, true);
export const glogDebugF = grouplogger(false, LogLevel.debug, true);
export const glogWarnF = grouplogger(false, LogLevel.warn, true);
export const glogErrorF = grouplogger(false, LogLevel.error, true);
export const glogTraceF = grouplogger(false, LogLevel.trace, true);
export const clogInfoF = grouplogger(true, LogLevel.info, true);
export const clogDebugF = grouplogger(true, LogLevel.debug, true);
export const clogWarnF = grouplogger(true, LogLevel.warn, true);
export const clogErrorF = grouplogger(true, LogLevel.error, true);
export const clogTraceF = grouplogger(true, LogLevel.trace, true);

export const glogF = glogInfoF;
export const clogF = clogInfoF;
