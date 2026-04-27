import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    lib: {
      // CSSではなく、TSファイルをエントリーにする
      entry: resolve(__dirname, "src/index.ts"),
      name: "ui-theme",
      formats: ["es"],
      fileName: "index",
    },
    // CSSをJSに埋め込まず、別の.cssファイルとして出力させる（通常デフォルト）
    cssCodeSplit: true,
  },
});
