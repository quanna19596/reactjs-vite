import fs from 'fs';

export const readFile = (path) => fs.readFileSync(path, 'utf8').toString();

export const getAllDirsInDirectory = (path) => fs.readdirSync(path).filter((dir) => !dir.includes('.'));

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
