import fs from 'fs';

const a = fs.readFileSync('./src/router/enums.ts', 'utf8').toString();

const x = JSON.stringify(fs.readFileSync('./src/router/enums.ts', 'utf8').toString())
  .split('export enum EPagePath')[0]
  .match(regex)
  .map((w) => w.replace(regex, '$1'));

const regex = /'(.*?)'/g;

console.log(
  x
    .split('export enum EPagePath')[0]
    .match(regex)
    .map((w) => w.replace(regex, '$1'))
);
