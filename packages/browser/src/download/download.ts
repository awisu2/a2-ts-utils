import { Bytes, Chunks, getChunksLength } from "@a2-ts-utils/common";

// ダウンロード時のデータ全般、一部progress用のデータも持つ
export class DownloadData {
  loaded: number = 0;
  chunks: Chunks = [];
  fullSize: number = 0;
  startTime: number = performance.now();
  isFailedRangeRequest: boolean = false;

  pushChunk(chunk: Bytes): void {
    this.chunks.push(chunk);
    this.loaded += chunk.length;
  }
}

export type DownloadProgress = {
  type: DownloadProgressType;
  loaded: number;
  total: number;
  elapsed: number;
  isFailedRangeRequest?: boolean;
  chunks: Chunks;
  error?: string | undefined;
};

export const DownloadProgressType = {
  Start: "start",
  Progress: "progress",
  End: "end",
  Error: "error",
} as const;
export type DownloadProgressType =
  (typeof DownloadProgressType)[keyof typeof DownloadProgressType];

const _defaultDownloadProgress: DownloadProgress = {
  type: DownloadProgressType.Start,
  loaded: 0,
  total: 0,
  elapsed: 0,
  isFailedRangeRequest: false,
  chunks: [],
  error: undefined,
};

const createFetchRequest = (range: number): RequestInit => {
  const request: RequestInit = {};
  if (range > 0) {
    request.headers = {
      Range: `bytes=${range}-`,
    };
  }
  return request;
};

const getProgressByData = (
  data: DownloadData,
  type: DownloadProgressType = DownloadProgressType.Progress,
  error: string | undefined = undefined,
  isFailedRangeRequest: boolean = false,
): DownloadProgress => {
  return {
    ..._defaultDownloadProgress,
    type,
    loaded: data.loaded,
    total: data.fullSize,
    chunks: data.chunks,
    elapsed: performance.now() - data.startTime,
    error,
    isFailedRangeRequest,
  };
};

// fetch() 関数を利用したダウンロード
// oldChunks を渡すことで resume する。oldChunksは onProgress により最新値が共有される
const _downloadAsync = async (
  url: string,
  oldChunks?: Chunks,
  onProgress?: (progress: DownloadProgress) => void,
): Promise<Chunks> => {
  // util function =====
  const _onProgress = (
    data: DownloadData,
    type: DownloadProgressType = DownloadProgressType.Progress,
    error: string | undefined = undefined,
    isFailedRangeRequest: boolean = false,
  ) => {
    if (onProgress == null) {
      return;
    }
    onProgress(getProgressByData(data, type, error, isFailedRangeRequest));
  };

  // download =====
  const data = new DownloadData();
  let response: Response;
  try {
    const oldChunksLength = oldChunks ? getChunksLength(oldChunks) : 0;
    data.chunks = oldChunks ? [...oldChunks] : [];
    data.loaded = oldChunksLength;

    // 以前ロードが途中で停止していたときは、Rangeヘッダーを付与して再度リクエストする
    const request = createFetchRequest(oldChunksLength);
    response = await fetch(url, request);
    if (!response.ok) {
      const errorText = `Failed to fetch url. status: ${response.status} (${response.statusText}), url: ${url}`;
      throw new Error(errorText);
    }

    if (!response.body) {
      const errorText = `Failed to get response body. url: ${url}`;
      throw new Error(errorText);
    }

    // get range parameters =====
    const isResume = oldChunksLength > 0;
    if (isResume) {
      if (response.status !== 206) {
        // Rangeに対応していないと思われるためデータクリア
        data.chunks = [];
        data.loaded = 0;
        data.isFailedRangeRequest = true;

        const errorText =
          "Server does not support Range requests. " + `url: ${url}`;
        throw new Error(errorText);
      }
    }

    // fix parameters =====
    const contentLength = response.headers.get("content-length");
    if (contentLength != null) {
      // content-length は ダウンロードするサイズ、コンテンツ全体のsizeではないため、resume時は合算する必要がある
      data.fullSize = parseInt(contentLength, 10) + data.loaded;
    }
  } catch (error) {
    let errorMessage = error instanceof Error ? error.message : String(error);
    _onProgress(data, DownloadProgressType.Error, errorMessage);
    throw error;
  }

  // start =====
  _onProgress(data, DownloadProgressType.Start);

  try {
    // progress status =====
    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      if (!value) {
        continue;
      }

      data.pushChunk(value);
      _onProgress(data, DownloadProgressType.Progress);
    }

    _onProgress(data, DownloadProgressType.End);
    return data.chunks;
  } catch (error) {
    let errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage == "") {
      errorMessage = "unknown error";
    }

    _onProgress(
      data,
      DownloadProgressType.Error,
      errorMessage,
      data.isFailedRangeRequest,
    );
    throw error;
  }
};

export const downloadToBlobAsync = async (
  url: string,
  onProgress?: (progress: DownloadProgress) => void,
): Promise<Blob> => {
  const chunks = await _downloadAsync(url, undefined, onProgress);
  return new Blob(chunks);
};

export const downloadToBlobWithRetryAsync = async (
  url: string,
  retry: number,
  onProgress?: (progress: DownloadProgress & { retry: number }) => void,
): Promise<Blob> => {
  let lastChunks: Chunks | undefined = undefined;
  let isFailedRangeRequest = false;

  for (let i = 0; i <= retry; i++) {
    try {
      isFailedRangeRequest = false;
      const _onProgress = (progress: DownloadProgress) => {
        lastChunks = progress.chunks;
        onProgress?.({ ...progress, retry: i });
        if (progress.isFailedRangeRequest) {
          isFailedRangeRequest = true;
        }
      };

      const _lastChunks = isFailedRangeRequest ? undefined : lastChunks;
      const chunks = await _downloadAsync(url, _lastChunks, _onProgress);
      return new Blob(chunks);
    } catch (error) {
      if (i === retry) {
        throw new Error(
          `Failed to download ${retry} times. url: ${url}, error: ${error}`,
        );
      }
    }
  }

  throw new Error(`Failed to download after ${retry} retries. url: ${url}`);
};

export const downloadToFile = (url: string, filename: string) => {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;

  // Note: 一度 DOMに所属させることでクリック処理を確定させる(textがないため表示に影響は出ない)
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const downloadBlobToFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  downloadToFile(url, filename);
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
};

// generate text functions =====
export const getTextStatus = (progress: DownloadProgress): string => {
  switch (progress.type) {
    case DownloadProgressType.Start:
      return "Download started";
    case DownloadProgressType.Progress:
      return `Downloading...`;
    case DownloadProgressType.End:
      return "Download completed";
    case DownloadProgressType.Error:
      return "Download failed";
    default:
      return "";
  }
};

export const getTextPercentage = (progress: DownloadProgress): string => {
  if (progress.total === 0) {
    return "0%";
  }
  const percentage = ((progress.loaded / progress.total) * 100).toFixed(1);
  return `${percentage}%`;
};

export const getTextSize = (progress: DownloadProgress): string => {
  if (progress.total === 0) {
    return "0 MB";
  }
  const loadedMB = (progress.loaded / (1024 * 1024)).toFixed(2);
  const totalMB = (progress.total / (1024 * 1024)).toFixed(2);
  return `${loadedMB}/${totalMB} MB`;
};

export const getTextElapsed = (progress: DownloadProgress): string => {
  if (progress.total === 0) {
    return "";
  }
  const elapsedSeconds = (progress.elapsed / 1000).toFixed(2);
  return `${elapsedSeconds}s`;
};

export const getSampleTextDownloadProgress = (
  progress: DownloadProgress,
): string => {
  let text = getTextStatus(progress);
  text += " " + getTextPercentage(progress);
  text += ` (${getTextSize(progress)})`;
  text += " " + getTextElapsed(progress);
  if (progress.error) {
    text += ` error: ${progress.error}`;
  }

  return text;
};
