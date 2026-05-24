import { open } from "@tauri-apps/plugin-dialog";

export async function openDialog(options?: {
  multiple?: boolean;
  directory?: boolean;
}): Promise<string | null> {
  const result = await open(options);
  if (typeof result !== "string") {
    throw new Error("result is not a string");
  }
  return result;
}
