import { grouplogger } from "./groupLog";
import { Log, LogLevel } from "./log";

// simple support lower log level and groupName
export class Logger {
  constructor(
    public level: LogLevel = LogLevel.debug,
    public groupName: string = "",
  ) {}

  private canLog(targetLevel: LogLevel): boolean {
    const hierarchy = {
      [LogLevel.trace]: 1,
      [LogLevel.debug]: 1,
      [LogLevel.info]: 2,
      [LogLevel.warn]: 3,
      [LogLevel.error]: 4,
    };
    return hierarchy[targetLevel] >= hierarchy[this.level];
  }

  private _log(level: LogLevel, isAllow: boolean = false): Log {
    if (isAllow || this.canLog(level)) {
      return (...args: any[]) => (console[level] ?? console.log)(...args);
    }
    return () => {};
  }

  private _glog(
    isCollapsed: boolean,
    level: LogLevel,
    isAllow: boolean = false,
  ): Log {
    if (isAllow || this.canLog(level)) {
      return (...args: any[]) => {
        grouplogger(isCollapsed, level)(this.groupName, ...args);
      };
    } else {
      return () => {};
    }
  }

  // log methods =====
  public get trace(): Log {
    return this._log(LogLevel.trace);
  }
  public get debug(): Log {
    return this._log(LogLevel.debug);
  }
  public get info(): Log {
    return this._log(LogLevel.info);
  }
  public get warn(): Log {
    return this._log(LogLevel.warn);
  }
  public get error(): Log {
    return this._log(LogLevel.error);
  }

  // force log methods =====
  public get debugF(): Log {
    return this._log(LogLevel.debug, true);
  }
  public get infoF(): Log {
    return this._log(LogLevel.info, true);
  }
  public get warnF(): Log {
    return this._log(LogLevel.warn, true);
  }
  public get errorF(): Log {
    return this._log(LogLevel.error, true);
  }
  public get traceF(): Log {
    return this._log(LogLevel.trace, true);
  }

  // group log methods =====
  public get gDebug(): Log {
    return this._glog(false, LogLevel.debug);
  }
  public get gInfo(): Log {
    return this._glog(false, LogLevel.info);
  }
  public get gWarn(): Log {
    return this._glog(false, LogLevel.warn);
  }
  public get gError(): Log {
    return this._glog(false, LogLevel.error);
  }
  public get gTrace(): Log {
    return this._glog(false, LogLevel.trace);
  }

  // Force group log methods =====
  public get gDebugF(): Log {
    return this._glog(false, LogLevel.debug, true);
  }
  public get gInfoF(): Log {
    return this._glog(false, LogLevel.info, true);
  }
  public get gWarnF(): Log {
    return this._glog(false, LogLevel.warn, true);
  }
  public get gErrorF(): Log {
    return this._glog(false, LogLevel.error, true);
  }
  public get gTraceF(): Log {
    return this._glog(false, LogLevel.trace, true);
  }

  // collapsible log methods =====
  public get cDebug(): Log {
    return this._glog(true, LogLevel.debug);
  }
  public get cInfo(): Log {
    return this._glog(true, LogLevel.info);
  }
  public get cWarn(): Log {
    return this._glog(true, LogLevel.warn);
  }
  public get cError(): Log {
    return this._glog(true, LogLevel.error);
  }
  public get cTrace(): Log {
    return this._glog(true, LogLevel.trace);
  }

  // Force collapse log methods =====
  public get cDebugF(): Log {
    return this._glog(true, LogLevel.debug, true);
  }
  public get cInfoF(): Log {
    return this._glog(true, LogLevel.info, true);
  }
  public get cWarnF(): Log {
    return this._glog(true, LogLevel.warn, true);
  }
  public get cErrorF(): Log {
    return this._glog(true, LogLevel.error, true);
  }
  public get cTraceF(): Log {
    return this._glog(true, LogLevel.trace, true);
  }
}
