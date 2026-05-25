// 配列から指定された範囲の用を取得
// startが負数であっても問題なく取得する
export function sliceLoop<T>(
  array: readonly T[],
  start: number,
  num: number,
  isInRange: boolean = true,
): T[] {
  // validation =====
  const length = array.length;
  if (length === 0 || num <= 0) return [];

  // fix start and num =====
  const _start =
    start >= 0
      ? start % length
      : (length - (Math.abs(start) % length)) % length;

  let _num = num;
  if (isInRange && num > length) {
    _num = length;
  }

  // main =====
  const result: T[] = [];
  for (let i = 0; i < _num; i++) {
    const index = (_start + i) % length;
    result.push(array[index]);
  }

  return result;
}
