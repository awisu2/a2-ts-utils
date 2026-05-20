export type StopWatchElapsed = {
  id: string;
  total: number;
  delta: number;
};
export class StopWatch {
  private _startTime: number;
  private _latestElapsed: number = 0;
  private _onElapsed?: (elapsed: StopWatchElapsed) => void;

  constructor(onElapsed?: (elapsed: StopWatchElapsed) => void) {
    this._startTime = performance.now();
    this._onElapsed = onElapsed;
  }

  elapsed(id: string = ""): StopWatchElapsed {
    const total = performance.now() - this._startTime;
    const delta = total - this._latestElapsed;

    this._latestElapsed = total;
    const result = { id, total, delta };

    this._onElapsed?.(result);
    return result;
  }
}
