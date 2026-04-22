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

## browser, node から commonを利用する方法について

common の tsconfig.json に　以下を追加

```json
{}
  "compilerOptions": {
    // common target
    "target": "es2020",
    ...
    // refarenced project settings from ohter project
    "composite": true
```

```bash
# package.jsonを更新し、 node_modulesにリンクが貼られる
pnpm --filter @a2-ts-utils/browser add @a2-ts-utils/common@workspace:*
pnpm --filter @a2-ts-utils/common add @a2-ts-utils/common@workspace:*
```

それぞれの tsconfig.jsonに以下を追加

```json
  "references": [
    {"path": "../common"}
  ]
```

## ローカルnpmサーバ verdaccio

```bash
npm install -g verdaccio
# サーバ起動(ただし同期実行で開きっぱなしの必要) =====
verdaccio
```

```bash
# バックグラウンド及び自動実行設定 =====
# windows (ただ、linux系ならsystmctlで設定できるので実質windowsのみ)
npm install -g pm2 pm2-windows-startup
# npm install -g pm2

# pm2の起動をレジストリに登録 =====
pm2-startup install

# 起動及び設定 =====
# Note: verdaccio や where verdaccio で調べたパスだと、pm2がうまく扱えないため直接jsファイルを実行
pm2 start "C:\Users\awisu\AppData\Roaming\npm\node_modules\verdaccio\build\lib\cli.js" --name verdaccio
pm2 list

pm2 save

# 停止及び削除 =====
pm2 stop verdaccio
# idでも良い (pm2 delete 0)
pm2 delete verdaccio

# 全削除と、自動実行停止 =====
pm2 delete all
pm2-startup uninstall
```

### 利用方法

```bash
# urlはvardaccionデフォルトのもの。不明な場合は一度確かめておくといい
URL=http://localhost:4873
# ユーザ登録 (登録後 ログインも行われる)
# (id: user, pass: pasword, email: user@local.host)
npm adduser --registry $URL --auth-type=legacy

# ログインする (何等かでログ案とした場合)
# 各パッケージマネージャでもログイン可能だが共有のため、これでOK
npm login --registry $URL
```

## verdaccioを利用するようにする

レジストリを登録することで、あまり存在を気にせずに管理可能

```bash
# set default registry
npm config set registry http://localhost:4873
npm config get registry
```

- これだけで npm, yarn(v1), pnpm でロカル及び npm registryを参照するようになる
  - verdaccio 側で、対象パッケージがないときに npm registoryにリダイレクトする

## yarn v2~ の場合

パッケージの管理をプロジェクトごとに行っているため、別途設定が必要

.yarnrc.yml

```bash
npmScopes:
  a2-ts-utils:
    npmRegistryServer: 'http://localhost:4873'

unsafeHttpWhitelist:
  - 'localhost'
```

- `yarn remove "@a2-ts-utils/browser"`
