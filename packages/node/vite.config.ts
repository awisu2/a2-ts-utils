import { defineConfig } from "vite";
// generate .d.ts files
import dts from "vite-plugin-dts";
import { resolve } from "path";
import { readdirSync, statSync } from "fs";

// generate entries
const getEntries = () => {
  const srcPath = resolve(__dirname, "src");
  const entries: Record<string, string> = {};

  readdirSync(srcPath).forEach((dir) => {
    const fullPath = resolve(srcPath, dir);
    const entryFile = resolve(fullPath, "index.ts");

    if (statSync(fullPath).isDirectory() && statSync(entryFile).isFile()) {
      entries[dir] = entryFile;
    }
  });

  return entries;
};

export default defineConfig({
  build: {
    // build target broswer: esnext, es2020, node: node24
    target: "node24",
    lib: {
      // get correct path
      entry: getEntries(),

      // regist to globalThis with this name
      name: "A2TsUtilsNode",

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
      external: ["fs", "path", "os", "@a2-ts-utils/common"],
    },
  },
  plugins: [
    // allow to generate .d.ts files for TypeScript projects
    dts({ rollupTypes: true }),
  ],
});
