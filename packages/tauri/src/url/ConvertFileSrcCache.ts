import { convertFileSrc } from "@tauri-apps/api/core";

export class ConvertFileSrcCache {
  private cache: Record<string, string> = {};

  get(src: string): string {
    if (!this.cache[src]) {
      this.cache[src] = convertFileSrc(src);
    }
    return this.cache[src];
  }

  clear() {
    this.cache = {};
  }

  // static instance if needed =====
  private static _it?: ConvertFileSrcCache = undefined;
  static get it(): ConvertFileSrcCache {
    if (!this._it) {
      this._it = new ConvertFileSrcCache();
    }
    return this._it;
  }
}
