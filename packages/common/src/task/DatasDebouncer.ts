import { debounce } from "es-toolkit/compat";

// 一定時間内の呼び出しを一度にまとめて実行するクラス
// ここでの呼び出しは、データの追加。主に更新通知をまとめるために利用
export class DatasDebouncer<T> {
  private processor: () => void;
  private queue: Set<T> = new Set();

  constructor(
    private onProcess: (datas: T[]) => void | Promise<void>,
    waitMs: number = 300,
    maxWaitMs: number = 1000,
  ) {
    // Note:
    // es-toolkit の debounce を利用
    // debounce: dd- bounce を組み合わせた造語で、一定時間内の複数の呼び出しを、指定時間でまとめて一度だけ実行する
    this.processor = debounce(() => this.flush(), waitMs, {
      maxWait: maxWaitMs,
    });
  }

  add(datas: T[]): void {
    for (const data of datas) {
      this.queue.add(data);
    }
    this.processor();
  }

  flush(): void {
    if (this.queue.size === 0) {
      return;
    }

    const datas = Array.from(this.queue);
    this.queue.clear();

    this.onProcess(datas);
  }
}
