import { hello as browserHello } from '@a2-ts-utils/browser/test';
import { hello as nodeHello } from '@a2-ts-utils/node/test';

console.log('--- 実行結果 ---');
console.log(browserHello());
console.log(nodeHello());
