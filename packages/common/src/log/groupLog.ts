// group log
// e.g. glog("myGroup", yourdata...);
import { LogLevel } from "./log";

export const grouplogger = (
  isCollapsed: boolean = false,
  logLevel: LogLevel,
): ((groupName: string, ...args: any[]) => void) => {
  return (groupName: string, ...args: any[]) => {
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
export const grouplogInfo = grouplogger(false, LogLevel.info);
export const grouplogDebug = grouplogger(false, LogLevel.debug);
export const grouplogWarn = grouplogger(false, LogLevel.warn);
export const grouplogError = grouplogger(false, LogLevel.error);
export const grouplogTrace = grouplogger(false, LogLevel.trace);

// collapsed group log =====
export const collapselogInfo = grouplogger(true, LogLevel.info);
export const collapselogDebug = grouplogger(true, LogLevel.debug);
export const collapselogWarn = grouplogger(true, LogLevel.warn);
export const collapselogError = grouplogger(true, LogLevel.error);
export const collapselogTrace = grouplogger(true, LogLevel.trace);

// alias =====
export const glog = grouplogInfo;
export const clog = collapselogInfo;

export const glogInfo = grouplogInfo;
export const glogDebug = grouplogDebug;
export const glogWarn = grouplogWarn;
export const glogError = grouplogError;
export const glogTrace = grouplogTrace;

export const clogInfo = collapselogInfo;
export const clogDebug = collapselogDebug;
export const clogWarn = collapselogWarn;
export const clogError = collapselogError;
export const clogTrace = collapselogTrace;
