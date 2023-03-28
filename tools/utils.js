import fetch from 'node-fetch';
import fs from 'fs';

export const appendFile = (path, content) => fs.appendFileSync(path, content);

export const readFile = (path) => fs.readFileSync(path, 'utf8').toString();

export const writeFile = (path, content) => fs.writeFileSync(path, content);

export const insertToArray = (arr, idx, ...els) => arr.splice(idx, 0, ...els);

export const getJSON = async (jsonFileUrl) => {
  try {
    const res = await fetch(jsonFileUrl);
    const string = await res.text();
    const json = await JSON.parse(string);
    return json;
  } catch (err) {
    console.log(err);
    throw new Error('Invalid Url. Expected JSON file url. Ex: https://petstore.swagger.io/v2/swagger.json');
  }
};
