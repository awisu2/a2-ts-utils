# style

## tailwindcss note

```bash
pnpm init

pnpm add -D tailwindcss @tailwindcss/vite
pnpm add -D @iconify/tailwind4 @iconify/json
```

## 2: 設定ファイルを用意

- vite.config.ts
- tsconfig.json
- package.json

他の jsコードの変換と違い、index.cssを最終的に生成できればよい
そのため、vite.conffig.tsなどでexclude設定などは特に不要

## 出力されるファイル

- index.css: このパッケージで作成している class の読み込み
- reset.css: html, body など基本タグのリセット処理
- theme.css: reset.cssに更に自前のstyleを割り当てたもの

e.g.: `import @a2-ts-utils/style/base.css/index.css`
