// classと同名のnamespaceで宣言することで、追加オプションをグループ化
export namespace KeyMap {
  export type SetOptions = {
    onlyExists?: boolean;
  };
}

// Map を補助するクラス =====
// 基本思想としては, ファイラーアプリでの大量のファイル情報管理の補助としての利用を想定
// mapを直接操作されてもよい設計で補助的な関数を追加している
export abstract class KeyMap<T> {
  private map: Map<string, T> = new Map();

  abstract getKey(data: T): string;

  abstract isSame(a: T, b: T): boolean;

  constructor(map?: Map<string, T>) {
    this.map = map ?? new Map();
  }

  // return is updated
  set(data: T, option?: KeyMap.SetOptions): boolean {
    const key = this.getKey(data);

    // validate before set =====
    const _data = this.map.get(key);
    if (_data) {
      if (this.isSame(_data, data)) {
        return false;
      }
    } else {
      if (option?.onlyExists) {
        return false;
      }
    }

    // set =====
    this.map.set(key, data);
    return true;
  }

  // return updated datas
  sets(datas: T[], option?: KeyMap.SetOptions): Map<string, T> {
    let updates: Map<string, T> = new Map();
    for (const data of datas) {
      const isUpdated = this.set(data, option);
      if (isUpdated) {
        updates.set(this.getKey(data), data);
      }
    }
    return updates;
  }

  get(key: string): T | undefined {
    return this.map.get(key);
  }

  getMap(): Map<string, T> {
    return this.map;
  }

  clear(): void {
    this.map.clear();
  }

  resets(datas: T[], option?: KeyMap.SetOptions): void {
    this.map.clear();
    this.sets(datas, option);
  }

  delete(key: string): boolean {
    return this.map.delete(key);
  }

  deleteByData(data: T): boolean {
    const key = this.getKey(data);
    return this.delete(key);
  }

  values(): IterableIterator<T> {
    return this.map.values();
  }

  entries(): IterableIterator<[string, T]> {
    return this.map.entries();
  }

  keys(): IterableIterator<string> {
    return this.map.keys();
  }

  getArrayEntries(): [string, T][] {
    return Array.from(this.map.entries());
  }

  getArrayValues(): T[] {
    return Array.from(this.map.values());
  }

  getArrayKeys(): string[] {
    return Array.from(this.map.keys());
  }

  filter(filter: (data: T) => boolean): Map<string, T> {
    let muchs: Map<string, T> = new Map();
    for (const [key, data] of this.map.entries()) {
      if (filter(data)) {
        muchs.set(key, data);
      }
    }
    return muchs;
  }

  get size(): number {
    return this.map.size;
  }
}
