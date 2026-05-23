import { Queue } from "../sys";

// ConcurrentRunnner =====
// run tasks concurrently with setted number.
// It has multiple priority queues. e.g. if difference priority tasks we have, we can set specific priority and can use that.
// please see README.md for details
type ConcurrentRunnerOptions = {
  priority?: number;
  setToHigh?: boolean;
};
export class ConcurrentRunner {
  private _priorityQueues: Map<number, Queue<() => Promise<void>>> = new Map();
  private _concurrency: number;

  private _priorities: number[] = [];
  private _state = {
    pending: 0,
    running: 0,
  };

  private _options = {
    autoRemoveEmptyQueue: true,
    verbose: false,
  };

  constructor(
    concurrency: number = 1,
    opts: { autoRemoveEmptyQueue?: boolean; verbose?: boolean } = {},
  ) {
    this._options = { ...this._options, ...opts };
    this._concurrency = concurrency;

    this.debugLog(`initialized`, { concurrency, options: this._options });
  }

  static defaultAddOptions: ConcurrentRunnerOptions = {
    priority: undefined,
    setToHigh: true,
  };

  get highstPriority(): number {
    return this._priorities.length == 0 ? 0 : this._priorities[0];
  }

  get state() {
    return this._state;
  }

  add(task: () => Promise<void>, opts: ConcurrentRunnerOptions = {}) {
    const _opts = { ...ConcurrentRunner.defaultAddOptions, ...opts };

    // enque =====
    // priorityがセットされていたら優先して利用、なければsetToHighの値で決定する
    const priority =
      _opts.priority ?? (_opts.setToHigh ? this.highstPriority : 0);
    const queue = this.getOrCreateQueue(priority);
    queue.enqueue(task);
    this._state.pending++;

    this.debugLog(`add task`, { priority, setToHigh: _opts.setToHigh });

    // invoke =====
    this.run();
  }

  addHighPriority(): number {
    const nextPriority =
      this._priorities.length > 0 ? this._priorities[0] + 1 : 1;
    this.getOrCreateQueue(nextPriority);
    return nextPriority;
  }

  clear(): void {
    this._priorityQueues.clear();
    this._priorities = [];
    this._state.pending = 0;

    // Note: no reset runnning tasks. this function not stop running task.
    // this._state.running = 0;
  }

  private getOrCreateQueue(priority: number): Queue<() => Promise<void>> {
    let queue = this._priorityQueues.get(priority);
    if (!queue) {
      const newQueue = new Queue<() => Promise<void>>();
      this._priorityQueues.set(priority, newQueue);
      queue = newQueue;
    }
    this.setPriority(priority);

    return queue;
  }

  private deleteQueue(priority: number) {
    this._priorityQueues.delete(priority);
    this.deletePriority(priority);
  }

  private setPriority(priority: number) {
    if (this._priorities.includes(priority)) {
      return;
    }
    this._priorities.push(priority);
    this._priorities.sort((a, b) => b - a);
  }

  private deletePriority(priority: number) {
    if (!this._priorities.includes(priority)) {
      return;
    }
    this._priorities = this._priorities.filter((p) => p !== priority);
  }

  private getNextTask(): (() => Promise<void>) | undefined {
    for (let i = 0; i < this._priorities.length; i++) {
      const priority = this._priorities[i];
      const queue = this._priorityQueues.get(priority);
      this.debugLog("getNextTask", { i, priority, queue });

      if (!queue) {
        this.debugLog(`queue not found for priority`);
        continue;
      }

      const task = queue.dequeue();

      // remove queue if empty but highest priority task may be working, so check empty before dequeue
      if (queue.size === 0 && this._options.autoRemoveEmptyQueue) {
        var isHighestOrLower = i == 0 || priority == 0;
        if (!isHighestOrLower) {
          this.debugLog(`queue deleted for priority`);
          this.deleteQueue(priority);
          i--;
        }
      }

      if (!task) {
        this.debugLog(`queue is empty for priority`);
        continue;
      }
      this._state.pending--;

      return task;
    }
    return undefined;
  }

  private canNext(): boolean {
    return this._state.pending > 0 && this._state.running < this._concurrency;
  }

  private run() {
    while (this.canNext()) {
      const task = this.getNextTask();
      if (task) {
        this.debugLog("run", `run task`);

        // async call for concurrent execution
        this._state.running++; // count up before async call
        this.innerRunAsync(task);
      } else {
        this.debugLog("run", `no task to run`);
      }
    }
  }

  private async innerRunAsync(task: () => Promise<void>): Promise<void> {
    try {
      await task();
    } catch (e) {
      console.error("ConcurrentRunner task error", e);
    } finally {
      this._state.running--;

      // resume next task
      this.run();
    }
  }

  private debugLog(...args: unknown[]) {
    if (this._options.verbose) {
      const quesueSizes = this._priorities.map((p) => {
        const q = this._priorityQueues.get(p);
        return { priority: p, size: q ? q.size : 0 };
      });
      console.debug("[ConcurrentRunner]", ...args, {
        state: this.state,
        quesueSizes,
        priorityLength: this._priorities.length,
      });
    }
  }
}
