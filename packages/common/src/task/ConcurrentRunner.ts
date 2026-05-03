import { Queue } from "../sys/queue";

// ConcurrentRunnner =====
// run tasks concurrently with setted number.
// It has multiple priority queues. e.g. if difference priority tasks we have, we can set specific priority and can use that.
// please see README.md for details
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
  };

  constructor(
    concurrency: number = 1,
    opts: { autoRemoveEmptyQueue?: boolean } = {},
  ) {
    this._options = { ...this._options, ...opts };
    this._concurrency = concurrency;
  }

  static defaultAddOptions = {
    priority: 0,
    setToHigh: false,
  };

  get highstPriority(): number {
    return this._priorities.length == 0 ? 0 : this._priorities[0];
  }

  get state() {
    return this._state;
  }

  add(
    task: () => Promise<void>,
    opts: {
      priority?: number;
      setToHigh?: boolean;
    } = {},
  ) {
    const _opts = { ...ConcurrentRunner.defaultAddOptions, ...opts };

    // enque =====
    const priority = _opts.setToHigh ? this.highstPriority + 1 : _opts.priority;
    const queue = this.getOrCreateQueue(priority);
    queue.enqueue(task);
    this._state.pending++;

    // invoke =====
    this.run();
  }

  addHighPriority(): number {
    const nextPriority =
      this._priorities.length > 0 ? this._priorities[0] + 1 : 1;
    this.getOrCreateQueue(nextPriority);
    return nextPriority;
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

  private DeleteQueue(priority: number) {
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
      if (!queue) {
        continue;
      }

      const task = queue.dequeue();
      this._state.pending--;

      // remove queue if empty but highest priority task may be working, so check empty before dequeue
      if (this._options.autoRemoveEmptyQueue) {
        var isHighestOrLower = i == 0 || priority == 0;
        if (queue.size === 0 && !isHighestOrLower) {
          this.DeleteQueue(priority);
          i--;
          continue;
        }
      }

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
        // async call for concurrent execution
        this._state.running++; // count up before async call
        this.innerRunAsync(task);
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
}
