import fetch from 'node-fetch';
import fs from 'fs';

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const appendFile = (path, content) => fs.appendFileSync(path, content);

const readFile = (path) => fs.readFileSync(path, 'utf8').toString();

const convertObjStrToObj = (objStr) => {
  const objStrLines = objStr.split('\n');
  const obj = {};
  objStrLines.forEach((line) => {
    const valueIsObj = line.includes('{');
    
  });
};

const getJSON = async () => {
  const res = await fetch('https://petstore.swagger.io/v2/swagger.json');
  const string = await res.text();
  const json = await JSON.parse(string);
  return json;
};

const generateEnvironmentVariables = (serviceName, host, basePath) => {
  const dotEnvFiles = {
    paths: ['.env', '.env.development', '.env.production', '.env.staging'],
    key: `VITE_${serviceName.toUpperCase().replace(/ /g, '_')}_SERVICE`,
    value: `https://${host}${basePath}`
  };

  const envDotTSFile = {
    path: './src/env.ts',
    key: serviceName.charAt(0).toLowerCase() + serviceName.replace(/ /g, '').slice(1),
    value: `import.meta.env.${dotEnvFiles.key} ?? ''`
  };

  // dotEnvFiles.paths.forEach((dotEnvFilePath) => {
  //   appendFile(dotEnvFilePath, `${dotEnvFiles.key}=${dotEnvFiles.value}`);
  // });

  const envDotTsFileContent = readFile(envDotTSFile.path);
  const envDotTsObjStr = envDotTsFileContent.split(' = ')[1].split('\r\n\r\n')[0].replace(';', '');
  const envDotTsObj = convertObjStrToObj(envDotTsObjStr);
  console.log(envDotTsObj);

  // console.log(JSON.parse(envDotTsObj).siteName);
  // console.log(envDotTsObj.service);
  // envDotTsObj.service = { [envDotTSFile.key]: { baseUrl: `import.meta.env.${dotEnvFiles.key} ?? ''` } };

  // console.log(envDotTsObj);
  // appendFile(serviceInEnvDotTSFile.path);
};

(async () => {
  // const json = await getJSON();
  // generateEnvironmentVariables(json.info.title, json.host, json.basePath);
  generateEnvironmentVariables('Swagger Petstore', 'petstore.swagger.io', '/v2');
})();
