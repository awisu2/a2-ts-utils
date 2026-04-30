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
  public map: Map<string, T> = new Map();

  abstract getKey(data: T): string;

  abstract isSame(a: T, b: T): boolean;

  set(data: T, option?: KeyMap.SetOptions): void {
    const key = this.getKey(data);

    // validate before set =====
    const _data = this.map.get(key);
    if (_data) {
      if (this.isSame(_data, data)) {
        return;
      }
    } else {
      if (option?.onlyExists) {
        return;
      }
    }

    // set =====
    this.map.set(key, data);
  }

  sets(datas: T[], option?: KeyMap.SetOptions): void {
    for (const data of datas) {
      this.set(data, option);
    }
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

  getArrayEntries(): [string, T][] {
    return Array.from(this.map.entries());
  }

  getArrayValues(): T[] {
    return Array.from(this.map.values());
  }

  getArrayKeys(): string[] {
    return Array.from(this.map.keys());
  }
}
