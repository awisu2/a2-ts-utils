# @a2-ts-utils/log

if you want more customizable/functionable logger.
you can use third party libraries like `pino`, `winston`, etc.

This library focus simply use default log system

```ts
// console.log("hello")
log("hello", ...);

// with group (indented log)
glog("myGroup", "hello", ...);
clog("myGroup", "hello", ...); // output with cloase(browser)

// with level (Debug/Info/Warn/Error/Trace)
logWarn("hello");
glogError("myGroup", "hello", ...);
clogTrace("myGroup", "hello", ...);
```

## loglevel settings

we can set low level for logging.

```ts
gloalLogLevel = LogLevel.info;
logDebug("not logging");

// if some function want log tempolary, we can 'F' each function
logDebugF("force debug");
```
