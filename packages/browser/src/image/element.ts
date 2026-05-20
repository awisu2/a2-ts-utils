// get HTMLImageElement after load
export const getImageElementAsync = (
  src: string,
  opt: { isAnnonymous?: boolean } = {},
): Promise<HTMLImageElement> => {
  const _opt = {
    isAnnonymous: false,
    ...opt,
  };

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);

    if (_opt.isAnnonymous) {
      img.crossOrigin = "anonymous";
    }

    img.src = src;
  });
};
