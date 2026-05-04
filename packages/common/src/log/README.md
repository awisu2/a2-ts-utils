# @a2-ts-utils/log

if you want more customizable/functionable logger.
you can use third party libraries like `pino`, `winston`, etc.

This library focus simply use default log system

```ts
// console.log("hello")
log.info("hello", ...);

// with group (indented log)
glog.info("myGroup", "hello", ...);
clog.info("myGroup", "hello", ...); // output with cloase(browser)

// with level (Debug/Info/Warn/Error/Trace)
log.warn("hello");
glog.error("myGroup", "hello", ...);
clog.trace("myGroup", "hello", ...);
```

## loglevel settings

we can set low level for logging.

```ts
setLogLevel(LogLevel.info);
log.debug("not logging");

// if some function want log tempolary, we can 'F' each function
logF.debug("force debug");
```
