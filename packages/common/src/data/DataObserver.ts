// Data notification system
export class DataObserver<T> {
  // Note: use Array for simple manage insted of Set.
  private subscribers: ((data: T) => void)[] = [];
  private latestData: T;

  constructor(data: T) {
    this.latestData = data;
  }

  subscribe(onUpdate: (data: T) => void): () => void {
    this.subscribers.push(onUpdate);

    const unsubscribe = () => {
      this.unsubscribe(onUpdate);
    };
    return unsubscribe;
  }

  unsubscribe(onUpdate: (data: T) => void) {
    const index = this.subscribers.indexOf(onUpdate);
    if (index !== -1) {
      this.subscribers.splice(index, 1);
    }
  }

  // set data without notify.
  set(data: T) {
    this.latestData = data;
  }

  // Not response data when subscribe. because this class purpose is to notify data update.
  get(): T {
    return this.latestData;
  }

  next(data: T) {
    this.set(data);

    // notify =====
    const _subscribers = [...this.subscribers];
    for (const subscriber of _subscribers) {
      subscriber(data);
    }
  }
}
