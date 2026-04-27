import { convertFileSrc } from "@tauri-apps/api/core";

export class FileSrcManager {
  convertFileSrcs: Record<string, string> = {};

  convertFileSrcUnique(src: string): string {
    if (!this.convertFileSrcs[src]) {
      this.convertFileSrcs[src] = convertFileSrc(src);
    }
    return this.convertFileSrcs[src];
  }
}
