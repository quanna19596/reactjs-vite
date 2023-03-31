import fs from 'fs';

const a = fs.readFileSync('./src/components/index.ts', 'utf8').toString();

console.log(JSON.stringify(a));
