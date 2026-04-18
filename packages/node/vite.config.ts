import { defineConfig } from "vite";
// generate .d.ts files
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  build: {
    // build target broswer: esnext, es2020, node: node24
    target: "node24",
    lib: {
      // get correct path
      entry: resolve(__dirname, "index.ts"),
      // regist to globalThis with this name
      name: "A2TsUtilsNode",
      // output file name without extension (e.g. index.js or index.cjs)
      fileName: "index",
      // output format. ex: ESM, ES Module, cjs: CommonJS
      // es: using import, export
      // cjs: using require, module.exports
      formats: ["es", "cjs"],
    },
    // settings of rollup
    rollupOptions: {
      // パッキングするときに、外部のモジュールをバンドルに含めないようにする設定 (e.g. axios, lodash)
      // exclude built-in node modules (fs, path, os)
      external: ["fs", "path", "os"],
    },
  },
  plugins: [
    // allow to generate .d.ts files for TypeScript projects
    dts({ rollupTypes: true }),
  ],
});
