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
