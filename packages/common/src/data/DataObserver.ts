// Data notification system
export class DataObserver<T> {
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

  next(data: T) {
    this.latestData = data;
    const _subscribers = [...this.subscribers];
    for (const subscriber of _subscribers) {
      subscriber(data);
    }
  }

  set data(data: T) {
    this.latestData = data;
  }

  // Not response data when subscribe. because this class purpose is to notify data update.
  getLatest(): T {
    return this.latestData;
  }
}
