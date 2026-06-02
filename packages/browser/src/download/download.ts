export type DownloadProgress = {
  type: DownloadProgressType;
  loaded: number;
  total: number;
  elapsed: number;
  chunks?: Uint8Array<ArrayBuffer>[] | undefined;
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
  chunks: undefined,
  error: undefined,
};

const _downloadToBlobAsync = async (
  url: string,
  oldChunks?: Uint8Array<ArrayBuffer>[],
  onProgress?: (progress: DownloadProgress) => void,
): Promise<Blob> => {
  const startTime = performance.now();

  // 以前ロードが途中で停止していたときは、Rangeヘッダーを付与して再度リクエストする
  const oldChunksLength =
    oldChunks?.reduce((acc, chunk) => acc + chunk.length, 0) ?? 0;
  const fetchOptions: RequestInit = {};
  const isResume = oldChunksLength > 0;
  if (isResume) {
    fetchOptions.headers = {
      Range: `bytes=${oldChunksLength}-`,
    };
  }

  // download =====
  const response = await fetch(url, fetchOptions);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch url. status: ${response.status} (${response.statusText}), url: ${url}`,
    );
  }

  if (!response.body) {
    throw new Error("Failed to get response body." + `url: ${url}`);
  }

  // get range parameters =====
  let loaded = 0;
  let chunks: Uint8Array<ArrayBuffer>[] = [];
  if (isResume) {
    if (response.status !== 206) {
      const errorText =
        "Server does not support Range requests. " + `url: ${url}`;

      onProgress?.({
        ..._defaultDownloadProgress,
        type: DownloadProgressType.Error,
        error: errorText,
      });
      throw new Error(errorText);
    }

    loaded = oldChunksLength;
    chunks = oldChunks ? [...oldChunks] : [];
  }

  // fix parameters =====
  const contentLength = response.headers.get("content-length");
  const total = contentLength ? parseInt(contentLength, 10) + loaded : loaded;

  const baseProgress: DownloadProgress = {
    type: DownloadProgressType.Progress,
    loaded: loaded,
    total: total,
    elapsed: 0,
    chunks: chunks,
  };

  // util function
  const _onProgress = (
    loaded: number,
    type: DownloadProgressType = DownloadProgressType.Progress,
    chunks: Uint8Array<ArrayBuffer>[],
    error: string | undefined = undefined,
  ) => {
    onProgress?.({
      ...baseProgress,
      type,
      loaded,
      elapsed: performance.now() - startTime,
      chunks,
      error,
    });
  };

  // progress status =====
  const reader = response.body.getReader();

  // start =====
  _onProgress(loaded, DownloadProgressType.Start, chunks);

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      if (!value) {
        continue;
      }

      chunks.push(value);
      loaded += value.length;
      _onProgress(loaded, DownloadProgressType.Progress, chunks);
    }

    _onProgress(loaded, DownloadProgressType.End, chunks);
    return new Blob(chunks);
  } catch (error) {
    let errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage == "") {
      errorMessage = "unknown error";
    }

    _onProgress(loaded, DownloadProgressType.Error, chunks, errorMessage);
    throw error;
  }
};

export const downloadToBlobAsync = async (
  url: string,
  onProgress?: (progress: DownloadProgress) => void,
): Promise<Blob> => {
  return await _downloadToBlobAsync(url, undefined, onProgress);
};

export const downloadToBlobWithRetryAsync = async (
  url: string,
  retry: number,
  onProgress?: (progress: DownloadProgress & { retry: number }) => void,
): Promise<Blob> => {
  let lastChunks: Uint8Array<ArrayBuffer>[] | undefined = undefined;

  for (let i = 0; i <= retry; i++) {
    try {
      const _onProgress = (progress: DownloadProgress) => {
        lastChunks = progress.chunks;
        onProgress?.({ ...progress, retry: i });
      };

      // Note: コンパイラが絶対に値が代入されないと判断しエラーをだすため、一度 any にして取得
      // 初期値が　null かつ 値のセットが、非同期のコールバック経由のため、コンパイラからは確実に null だという判断になるとのこと
      return await _downloadToBlobAsync(url, lastChunks, _onProgress);
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
