// Queue =====
// it almost similar with array. but it has O(1) enqueue and dequeue operation.
export class Queue<T> {
  private _items: T[] = [];

  // Note: for quick dequeue, use this pointer instead of shift() which is O(n)
  private _offset = 0;
  private _size = 0;
  private _cleanupThreshold: number;

  constructor(
    items?: T[],
    opts: { cleanupThreshold?: number } = { cleanupThreshold: 1000 },
  ) {
    const { cleanupThreshold = 1000 } = opts;

    this._cleanupThreshold = cleanupThreshold;
    if (items) {
      this._items = items;
      this._size = items.length;
    }
  }

  enqueue(item: T): void {
    this._items.push(item);
    this._size++;
  }

  dequeue(): T | undefined {
    if (this._size === 0) return undefined;

    const item = this._items[this._offset];
    this._offset++;
    this._size--;

    // remove dequeued items if offset is large to avoid memory leak
    if (this._offset >= this._cleanupThreshold) {
      this._items = this._items.slice(this._offset);
      this._offset = 0;
      this._size = this._items.length;
    }

    return item;
  }

  peek(): T | undefined {
    return this._items[this._offset];
  }

  get size(): number {
    return this._size;
  }

  clear(): void {
    this._items = [];
    this._offset = 0;
    this._size = 0;
  }

  // iteration support
  *[Symbol.iterator]() {
    for (let i = this._offset; i < this._size; i++) {
      yield this._items[i];
    }
  }
}
