export const mapFilter = <K, V>(
  map: Map<K, V>,
  filter: (key: K, data: V) => boolean,
): Map<K, V> => {
  var filtered = map.entries().filter(([key, data]) => filter(key, data));
  return new Map(filtered);
};
