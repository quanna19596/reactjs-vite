import fs from 'fs';

const a = fs.readFileSync('./src/styles/main-classes.scss', 'utf8').toString();

console.log(JSON.stringify(a));
