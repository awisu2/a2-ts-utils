# task

## ConcurrentRunner

exsample

```ts
var yourTaskNumber = 2;
const runner = new ConcurrentRunner(yourTaskNumber);
runner.add(async () => { ... });

// if want add high priory task
runner.addHighPriority();
runner.add(async () => { ... }, { setToHigh: true });

// you also can set priority by number
runner.add(async () => { ... }, { priority: 1 });

// if you run with specific priorities please set autoRemoveEmptyQueue: false when create
// it can reduce remove cost when task size change to empty.
const runner = new ConcurrentRunner(yourTaskNumber, {autoRemoveEmptyQueue: false});
```
