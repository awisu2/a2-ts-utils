export class StopWatch {
  private _startTime: number;
  private _latestElapsed: number = 0;

  constructor() {
    this._startTime = performance.now();
  }

  elapsed(): { total: number; delta: number } {
    const total = performance.now() - this._startTime;
    const delta = total - this._latestElapsed;

    this._latestElapsed = total;
    return { total, delta };
  }
}
