import fs from 'fs';

export const readFile = (path) => JSON.stringify(fs.readFileSync(path, 'utf8').toString());

const alreadyExistPaths = readFile('./src/router/paths.ts')
      ?.split('const PATHS = {')[1]?.split('PAGE: {')[0]
      ?.match(/'(.*?)'/g)
      ?.map((w) => w.replace(/'(.*?)'/g, '$1'));

console.log(alreadyExistPaths)