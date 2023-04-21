import fs from 'fs';

export const readFile = (path) => fs.readFileSync(path, 'utf8').toString();

export const BREAK_LINE = process.platform.startsWith('win') ? '\r\n' : '\n';

const regexMark = 'path: PATHS.PAGE.PRODUCTS()'

const routerConfig = readFile('./src/router/config.ts');

const pageConfigRegex = new RegExp(
      `{([${BREAK_LINE}].*?)(.*?(?:${regexMark}).*)(([${BREAK_LINE}]+([^${BREAK_LINE}]+)){7})`,
      'g'
    );


const a = routerConfig.match(pageConfigRegex)

console.log(a)