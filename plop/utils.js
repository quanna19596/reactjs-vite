import fs from 'fs';

export const readFile = (path) => JSON.stringify(fs.readFileSync(path, 'utf8').toString());

export const getAllDirsInDirectory = (path) => fs.readdirSync(path).filter((dir) => !dir.includes('.'));