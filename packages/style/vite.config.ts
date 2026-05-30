import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    lib: {
      // CSSではなく、TSファイルをエントリーにする
      entry: {
        index: resolve(__dirname, "src/index.css"),
        theme: resolve(__dirname, "src/theme/theme01.css"),
        reset: resolve(__dirname, "src/base/reset.css"),
      },
      formats: ["es"],
      fileName: "index",
    },
    // CSSをJSに埋め込まず、別の.cssファイルとして出力させる（通常デフォルト）
    cssCodeSplit: true,
    // specific output file name
    rollupOptions: {
      output: {
        assetFileNames: "[name].[ext]",
      },
    },
  },
});
