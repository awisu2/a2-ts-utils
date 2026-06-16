export type Bytes = Uint8Array<ArrayBuffer>;
export type Chunks = Bytes[];

export const isBytes = (data: unknown): data is Bytes => {
  return data instanceof Uint8Array && data.buffer instanceof ArrayBuffer;
};

export function bytesToBase64(bytes: Bytes): string {
  // Node.js =====
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64");
  }

  // browser =====
  // one time convert may got crash, so convert by chunk
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export const getChunksLength = (chunks: Chunks): number => {
  // reduce: 各要素を集約して一つの値にまとめる (複数を一つに減らすため reduce という名前らしい)
  return chunks.reduce((sum, chunk) => sum + chunk.length, 0);
};
