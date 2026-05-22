import { ImageMimeType } from "../type";

// DataViewにすることで、byte単位の読み書きを可能にし、解析可能にする
export namespace getHeadDataView {
  export const ByBytes = (
    bytes: Uint8Array,
    length: number = 2048,
  ): DataView => {
    const actualLength = Math.min(length, bytes.byteLength);
    const buffer = bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteOffset + actualLength,
    );
    return new DataView(buffer);
  };

  export const ByBlobAsync = async (
    blob: Blob,
    length: number = 2048,
  ): Promise<DataView> => {
    const buffer = await blob.slice(0, length).arrayBuffer();
    return new DataView(buffer);
  };
}

// MimeTypeの取得 (基本は DataViewからの取得で bytes, blob経由でも行えるようにする)
export namespace getImageMimeType {
  export const ByDataView = (view: DataView): ImageMimeType => {
    if (
      view.byteLength >= 8 &&
      view.getUint32(0) === 0x89504e47 &&
      view.getUint32(4) === 0x0d0a1a0a
    ) {
      return ImageMimeType.PNG;
    }
    if (view.byteLength >= 4 && view.getUint32(0) === 0x47494638) {
      return ImageMimeType.GIF;
    }
    if (view.byteLength >= 2 && view.getUint16(0) === 0xffd8) {
      return ImageMimeType.JPEG;
    }
    return ImageMimeType.UNKNOWN;
  };

  export const ByBytes = (bytes: Uint8Array): ImageMimeType => {
    const view = getHeadDataView.ByBytes(bytes);
    return ByDataView(view);
  };

  export const ByBlobAsync = async (blob: Blob): Promise<ImageMimeType> => {
    const view = await getHeadDataView.ByBlobAsync(blob);
    return ByDataView(view);
  };
}

// 画像サイズの取得 (基本は DataViewからの取得で bytes, blob経由でも行えるようにする)
export namespace getImageSize {
  export const ByDataView = (
    view: DataView,
  ): { width: number; height: number } | undefined => {
    const type = getImageMimeType.ByDataView(view);

    switch (type) {
      case ImageMimeType.PNG:
        return {
          width: view.getUint32(16),
          height: view.getUint32(20),
        };

      case ImageMimeType.GIF:
        return {
          width: view.getUint16(6, true),
          height: view.getUint16(8, true),
        };

      case ImageMimeType.JPEG: {
        return getJpegSize(view);
      }
    }
  };

  const getJpegSize = (
    view: DataView,
  ): { width: number; height: number } | undefined => {
    const length = view.byteLength;

    if (length < 4 || view.getUint16(0) !== 0xffd8) return undefined;

    let offset = 2;

    while (offset < length) {
      // marker prefix 0xff まで進める
      while (offset < length && view.getUint8(offset) !== 0xff) offset++;
      if (offset >= length) return undefined;

      // fill byte 0xff をスキップ
      while (offset < length && view.getUint8(offset) === 0xff) offset++;
      if (offset >= length) return undefined;

      const marker = 0xff00 | view.getUint8(offset);
      offset += 1;

      if (marker === 0xffd9 || marker === 0xffda) return undefined;

      // standalone markers
      if (marker === 0xff01 || (marker >= 0xffd0 && marker <= 0xffd7)) {
        continue;
      }

      if (offset + 2 > length) return undefined;

      const segmentLength = view.getUint16(offset);
      if (segmentLength < 2 || offset + segmentLength > length)
        return undefined;

      const isSof =
        (marker >= 0xffc0 && marker <= 0xffc3) ||
        (marker >= 0xffc5 && marker <= 0xffc7) ||
        (marker >= 0xffc9 && marker <= 0xffcb) ||
        (marker >= 0xffcd && marker <= 0xffcf);

      if (isSof) {
        if (segmentLength < 7) return undefined;

        return {
          height: view.getUint16(offset + 3),
          width: view.getUint16(offset + 5),
        };
      }

      offset += segmentLength;
    }

    return undefined;
  };

  export const ByBytes = (
    bytes: Uint8Array,
  ): { width: number; height: number } | undefined => {
    const view = getHeadDataView.ByBytes(bytes);
    return getImageSize.ByDataView(view);
  };

  export const ByBlobAsync = async (
    blob: Blob,
  ): Promise<{ width: number; height: number } | undefined> => {
    const view = await getHeadDataView.ByBlobAsync(blob);
    return getImageSize.ByDataView(view);
  };
}
