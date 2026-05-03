// group log
// e.g. glog("myGroup", yourdata...);
import { LogLevel, logs } from "./log";

export const grouplogs = (
  level: LogLevel,
  isCollapsed: boolean,
  groupName: string,
  ...args: any[]
) => {
  if (isCollapsed) {
    console.groupCollapsed(groupName);
  } else {
    console.group(groupName);
  }
  try {
    logs(level, ...args);
  } finally {
    console.groupEnd();
  }
};

// group log =====
export const grouplogInfo = (groupName: string, ...args: any[]) =>
  grouplogs(LogLevel.info, false, groupName, ...args);

export const grouplogDebug = (groupName: string, ...args: any[]) =>
  grouplogs(LogLevel.debug, false, groupName, ...args);

export const grouplogWarn = (groupName: string, ...args: any[]) =>
  grouplogs(LogLevel.warn, false, groupName, ...args);

export const grouplogError = (groupName: string, ...args: any[]) =>
  grouplogs(LogLevel.error, false, groupName, ...args);

export const grouplogTrace = (groupName: string, ...args: any[]) =>
  grouplogs(LogLevel.trace, false, groupName, ...args);

// collapsed group log =====
export const collapselogInfo = (groupName: string, ...args: any[]) =>
  grouplogs(LogLevel.info, true, groupName, ...args);

export const collapselogDebug = (groupName: string, ...args: any[]) =>
  grouplogs(LogLevel.debug, true, groupName, ...args);

export const collapselogWarn = (groupName: string, ...args: any[]) =>
  grouplogs(LogLevel.warn, true, groupName, ...args);

export const collapselogError = (groupName: string, ...args: any[]) =>
  grouplogs(LogLevel.error, true, groupName, ...args);

export const collapselogTrace = (groupName: string, ...args: any[]) =>
  grouplogs(LogLevel.trace, true, groupName, ...args);

// alias =====
export const glog = grouplogInfo;
export const grouplog = grouplogInfo;
export const clog = collapselogInfo;
export const collapselog = collapselogInfo;

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
