# a2-ts-utils

自分用の js/node の utils

- 何度か似たものを作っているが、場合分けできるようになっているので、ほぼ最終形と思う

## とはいえもっと便利なutilsは存在している

ので、それらでカバーだれているものはここには実装しない

- utils: Radash (旧: Lodash)
  - [doc](https://radash-docs.vercel.app/docs/getting-started)
- 時間の扱い: datefns (旧: moment.js)

```bash
pnpm add radash date-fns
yarn add radash date-fns
```

## startup

```bash
pnpm install
./scripts/bin.sh
```

## Note

- videoのサムネイルを取得するときは、表示がされてからにしたほうがいい seeked または loadeddata イベント後が良い
  - seekedがベストだが、時間指定をしなかった場合発生しないので、loadeddata で初期フレームが表示されたタイミングとなる
- type は index.ts に記載しても .d.ts に出力されない(rollupの仕様)ため、別のファイル(type.tsなど)に記載する
- pacakge.jsonでdevendencyは記載できるが、最新のものが個別に欲しい場合などはそれぞれ個別取得(e.g. `yarn add`)しておく必要がある
