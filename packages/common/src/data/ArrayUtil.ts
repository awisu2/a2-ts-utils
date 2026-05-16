export abstract class ArrayUtil<T> {
  abstract getKey(data: T): string;

  sets(
    map: Map<string, T>,
    updates: T[] | Map<string, T> | Set<T>,
    option?: {
      isUpdateOnly?: boolean;
      isNew?: boolean;
    },
  ): Map<string, T> {
    const isOnlyUpdate = option?.isUpdateOnly ?? false;
    const isNew = option?.isNew ?? false;

    updates.forEach((data) => {
      const key = this.getKey(data);
      if (isOnlyUpdate && !map.has(key)) {
        return;
      }
      map.set(key, data);
    });

    if (isNew) {
      map = new Map(map);
    }

    return map;
  }

  hasMuch(map: Map<string, T>, value: T): boolean {
    const key = this.getKey(value);
    return map.has(key);
  }

  getMuch(map: Map<string, T>, value: T): T | undefined {
    const key = this.getKey(value);
    return map.get(key);
  }
}
