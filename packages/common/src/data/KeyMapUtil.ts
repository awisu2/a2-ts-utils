export class KeyMap<T> extends Map<string, T> {}

export type KeyMapUtilSetsOptions = {
  isNew?: boolean;
  isUpdateOnly?: boolean;
  useCanUpdate?: boolean;
};

export type KeyMapUtilSetsResult<T> = {
  map: KeyMap<T>;
  keys: string[];
  updateKeys: string[];
};

export abstract class KeyMapUtil<T> {
  abstract getKey(data: T): string;
  abstract canUpdate(a: T, b: T): boolean;

  sets(
    map: KeyMap<T>,
    updates: T[] | KeyMap<T> | Set<T>,
    option?: KeyMapUtilSetsOptions,
  ): KeyMapUtilSetsResult<T> {
    // option =====
    const isNew = option?.isNew ?? false;
    const isUpdateOnly = option?.isUpdateOnly ?? false;
    const useCanUpdate = option?.useCanUpdate ?? false;

    // gather =====
    const values = updates instanceof KeyMap ? updates.values() : updates;
    const newMap = isNew ? new KeyMap(map) : map;
    const keys = [];
    const updateKeys = [];

    // set =====
    for (const value of values) {
      const key = this.getKey(value);
      keys.push(key);

      const oldValue = map.get(key);
      if (isUpdateOnly && !oldValue) {
        continue;
      }

      if (useCanUpdate && oldValue) {
        if (!this.canUpdate(oldValue, value)) {
          continue;
        }
      }

      newMap.set(key, value);
      updateKeys.push(key);
    }

    return {
      map: newMap,
      keys,
      updateKeys,
    };
  }

  pick(map: KeyMap<T>, keys: string[]): T[] {
    const results: T[] = [];
    for (const key of keys) {
      const value = map.get(key);
      if (!value) continue;
      results.push(value);
    }
    return results;
  }

  has(map: KeyMap<T>, value: T): boolean {
    const key = this.getKey(value);
    return map.has(key);
  }

  get(map: KeyMap<T>, value: T): T | undefined {
    const key = this.getKey(value);
    return map.get(key);
  }
}
