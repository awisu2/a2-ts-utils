// get HTMLVideoElement after load
// src に対して #t=n の指定は行わないものとする
export const getVideoElementLoadedAsync: (
  src: string,
  opt: {
    seekTime: number;
    canAnonymous: boolean;
  },
) => Promise<HTMLVideoElement> = (src, opt) => {
  // get opt =====
  // src に対して #t=n の指定は行わないものとする
  // 1: onloadeddata は時間指定に関係なく src のロードが完了したときに呼ばれる
  // 2: #t=n 及び .currentTime の指定により seek が発生し onseeked で対象時間のロード完了を確認できる
  // 3: #t=0 や seek が発生しない場合 onseeked は呼ばれない。けれど onloadeddata は呼ばれる。
  // 4: seekの有り無し管理が難しい
  const isSeek = opt.seekTime > 0;

  // get element =====
  // new HTMLVideoElement(); だと、エラーになるのでdocument経由で生成
  const videoElement = document.createElement("video");

  // option =====
  videoElement.preload = "metadata";
  if (opt.canAnonymous) {
    videoElement.crossOrigin = "anonymous";
  }

  return new Promise((resolve, reject) => {
    // Note: controller.signal を利用することで、簡易なabortを実装
    const controller = new AbortController();
    const signal = controller.signal;

    // events =====
    const _resolve = () => {
      controller.abort();
      resolve(videoElement);
    };

    if (isSeek) {
      videoElement.addEventListener(
        "loadedmetadata",
        () => {
          // onloadedmetadata 後に currentTime を指定して確実にseekを発生させる
          videoElement.currentTime = opt.seekTime;
        },
        { signal },
      );
      videoElement.addEventListener("seeked", () => _resolve(), { signal });
    } else {
      videoElement.addEventListener("loadeddata", () => _resolve(), { signal });
    }

    videoElement.addEventListener(
      "error",
      (err: ErrorEvent) => {
        controller.abort();
        clearVideoElement(videoElement);
        reject(videoElement.error || err);
      },
      { signal },
    );

    videoElement.src = src;
  });
};

// clear video element
export const clearVideoElement = (element: HTMLVideoElement) => {
  element.pause();
  element.src = "";
  element.load();
};
