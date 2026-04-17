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
```
