import { Bytes } from "@a2-ts-utils/common";

export const getBytesAsync = async (blob: Blob): Promise<Bytes> => {
  return await getBytesByBlobAsync(blob);
};

const getBytesByBlobAsync = async (blob: Blob): Promise<Bytes> => {
  const buffer = await blob.arrayBuffer();
  return new Uint8Array<ArrayBuffer>(buffer);
};
