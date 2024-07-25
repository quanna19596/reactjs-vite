import fs from 'fs';
import { BREAK_LINE } from './constants.js';

export const readFile = (path) => fs.readFileSync(path, 'utf8').toString();

export const getAllDirsInDirectory = (path) => fs.readdirSync(path).filter((dir) => !dir.includes('.'));

export const getAllFilesInDirectory = (path) => fs.readdirSync(path);

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const skipAction = ({ when, path, description }) => when ? `[SKIPPED] ${description} | ${path}` : null;

export const regex = {
  getLinesEqualAndAfterMatching: (marker, numberOfLines) => new RegExp(`(${marker})(.*` + BREAK_LINE + `){${numberOfLines}}` ,'g'),
  getLastLines: (numberOfLines) => new RegExp('(.*([' + BREAK_LINE + `|$)){${numberOfLines}}$` ,'g'),
};

const routerConfigStr = readFile('src/router/config.ts');
const rg = /const routerConfig[\s\S]+\n}/g;
const found = routerConfigStr.match(rg);

const beautified = found[0].replace('const routerConfig: TRouteConfig = ', '');

// console.log();
console.log(typeof JSON.parse(JSON.stringify(beautified)));
// Expected output: Array ["T", "I"]
