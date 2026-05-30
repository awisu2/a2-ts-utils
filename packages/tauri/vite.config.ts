import { defineConfig } from "vite";
// generate .d.ts files
import dts from "vite-plugin-dts";
import { resolve } from "path";
import { existsSync, readdirSync, statSync } from "fs";

export default defineConfig({
  build: {
    // build target broswer: esnext, es2020, node: node24
    target: "node24",
    lib: {
      // get correct path
      entry: [resolve(__dirname, "src", "index.ts")],

      // regist to globalThis with this name
      name: "A2TsUtilsTauri",

      // output format. ex: ESM, ES Module, cjs: CommonJS
      // es: using import, export
      // cjs: using require, module.exports
      formats: ["es", "cjs"],

      // output file name without extension (e.g. index.js or index.cjs)
      fileName: (format, entryName) =>
        `${entryName}.${format == "es" ? "js" : "cjs"}`,
    },
    // settings of rollup
    rollupOptions: {
      // パッキングするときに、外部のモジュールをバンドルに含めないようにする設定 (e.g. axios, lodash)
      // exclude built-in node modules (fs, path, os)
      external: [/^@tauri-apps\/api/],
      output: {
        // 必要に応じてグローバル変数をマッピング
        globals: {
          "@tauri-apps/api": "window.__TAURI__",
          "@tauri-apps/api/core": "window.__TAURI__.core",
          "@tauri-apps/api/event": "window.__TAURI__.event",
        },
      },
    },
  },
  plugins: [
    // allow to generate .d.ts files for TypeScript projects
    dts({ rollupTypes: true }),
  ],
});
