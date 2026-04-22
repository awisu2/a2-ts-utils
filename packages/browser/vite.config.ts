import { defineConfig } from "vite";
// generate .d.ts files
import dts from "vite-plugin-dts";
import { resolve } from "path";
import { existsSync, readdirSync, statSync } from "fs";

// generate entries (e.g. {test: ./src/test/index.ts}) for library mode
const getEntries = () => {
  const srcPath = resolve(__dirname, "src");
  const entries: Record<string, string> = {};

  const indexFile = resolve(srcPath, "index.ts");
  if (existsSync(indexFile)) {
    entries["index"] = indexFile;
  }

  readdirSync(srcPath).forEach((dir) => {
    const fullPath = resolve(srcPath, dir);
    const entryFile = resolve(fullPath, "index.ts");

    if (statSync(fullPath).isDirectory() && existsSync(entryFile)) {
      entries[dir] = entryFile;
    }
  });

  return entries;
};

export default defineConfig({
  build: {
    // build target broswer: esnext, es2020, node: node24
    target: "es2020",
    lib: {
      // get correct path
      entry: getEntries(),

      // regist to window with this name
      name: "A2TsUtilsBrowser",

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
      external: ["@a2-ts-utils/common"],
    },
  },
  plugins: [
    // allow to generate .d.ts files for TypeScript projects
    dts({ rollupTypes: true }),
  ],
});
