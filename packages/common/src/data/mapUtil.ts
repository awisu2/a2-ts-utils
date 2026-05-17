export const mapFilter = <K, V>(
  map: Map<K, V>,
  filter: (key: K, data: V) => boolean,
): Map<K, V> => {
  var filtered = map.entries().filter(([key, data]) => filter(key, data));
  return new Map(filtered);
};

export class MapUtil {
  static first<K, V>(map: Map<K, V>): [K, V] | undefined {
    return map.entries().next().value;
  }

  static firstKey<K, V>(map: Map<K, V>): K | undefined {
    return this.first(map)?.[0];
  }

  static firstValue<K, V>(map: Map<K, V>): V | undefined {
    return this.first(map)?.[1];
  }
}
