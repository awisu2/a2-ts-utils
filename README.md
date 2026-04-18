# a2-ts-utils

## setup note

browser, node 用の自前ライブラリを pnpm で構成することを目的とする

### 1: pnpm の設定

pnmp では複数のpackageを統合して管理でき、その設定がこちら

pnpm-workspace.yaml
グループ管理された環境を "モノレポ" という

```bash
packages:
  - "packages/*"
```

### 2: 各packageの初期化

```bash
DIR="packages"
mkdir -p $DIR/common $DIR/browser $DIR/node

cd $DIR/common
pnpm init
# package.json > name を @a2-ts-utils/common

cd ../browser
pnpm init
# package.json > name を @a2-ts-utils/browser

cd ../node
pnpm init
# package.json > name を @a2-ts-utils/node
```

### 3: pnpmに パッケージを認識させる

```bash
cd $ROOT_DIR
pnpm install
```

## packageの追加方法

モノレポ環境のため、ルートで実行すれば良いとのこと

```bash
pnpm add -Dw typescript
pnpm add -Dw @types/node
```

ビルドツール vite。内部的には esbuild(ビルド), rollup(パッケージ化) を利用している
vite-plugin-dts: vite単体では生成できない .d.ts (型定義ファイル) 用

```bash
pnpm add -Dw vite vite-plugin-dts
```

### pnpmにおける設定ファイルについて

- ルートに `pnpm-workspace.yaml` を設置することにより、pnpm管理下において 複数のパッケージがまとめて管理される
- ルートディレクトリに設置される `pacakge.json` は 共通設定になる
- 今回の構成では `tsconfig.json` も共通設定として扱われるが、各packageの `tsconfig.json` の `extends` 設定で読み込んでいるからで, pnpmで管理されているわけではない

### update settings

packages/browser/vite.config.ts

```ts
import { defineConfig } from "vite";
// generate .d.ts files
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      // get correct path
      entry: resolve(__dirname, "index.ts"),
      // regist to window with this name
      name: "A2TsUtilsBrowser",
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
      external: [],
    },
  },
  plugins: [
    // allow to generate .d.ts files for TypeScript projects
    dts({ rollupTypes: true }),
  ],
});
```

packages/browser/package.json, packages/node/package.json

```bash
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    ...
    "build": "vite build"
  },
```

ビルド

```bash
pnpm -r run build
```

### 他packageでこれらを利用したい場合

#### ローカルリンク

```bash
cd $ROOT_DIR
mkdir test && test

#
pnpm add ../packages/browser ../packages/node
```

具体的な挙動

- package.json の dependencies には以下のように `"{package}": "link: {path}"` という 記載が追加され、node_modules にlinkが貼られる
- この "link: {path}" という記載は、pnpm または yarn に有効な記載で それぞれの install で動作する
  - == npm install では動作しない
- また、相対パスが記録されるので、1リポジトリで管理しておくか、それぞれの配置を固定化しておく必要あり

```json
  "dependencies": {
    "@a2-ts-utils/browser": "link:..\\packages\\browser",
    "@a2-ts-utils/node": "link:..\\packages\\node"
  }
```
