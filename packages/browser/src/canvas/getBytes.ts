export const getBytesAsync = async (blob: Blob): Promise<Uint8Array> => {
  return await getBytesByBlobAsync(blob);
};

const getBytesByBlobAsync = async (blob: Blob): Promise<Uint8Array> => {
  const buffer = await blob.arrayBuffer();
  return new Uint8Array(buffer);
};
