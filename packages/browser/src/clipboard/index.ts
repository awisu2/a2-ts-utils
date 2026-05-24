export const writTextToClipboardAsync = (text: string): Promise<void> => {
  return navigator.clipboard.writeText(text);
};

export const readTextFromClipboardAsync = (): Promise<string> => {
  return navigator.clipboard.readText();
};
