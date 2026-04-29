export function bytesToBase64(bytes: Uint8Array): string {
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
