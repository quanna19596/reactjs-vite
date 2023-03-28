import { appendFile, writeFile, readFile, insertToArray, getJSON } from '../utils.js';
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const generateEnvironmentVariables = (serviceName, host, basePath) => {
  const dotEnv = {
    files: [
      {
        path: '.env.development',
        content: readFile('.env.development')
      },
      {
        path: '.env.staging',
        content: readFile('.env.staging')
      },
      {
        path: '.env.production',
        content: readFile('.env.production')
      }
    ],
    key: `VITE_${serviceName.toUpperCase().replace(/ /g, '_')}_SERVICE`,
    value: `https://${host}${basePath}`
  };

  const envDotTSFile = {
    path: './src/env.ts',
    key: serviceName.charAt(0).toLowerCase() + serviceName.replace(/ /g, '').slice(1),
    value: `import.meta.env.${dotEnv.key} ?? ''`
  };

  dotEnv.files.forEach(({ path, content }) => {
    const serviceAlreadyExist = content.includes(dotEnv.key);
    if (!serviceAlreadyExist) {
      appendFile(path, `\n${dotEnv.key}=${dotEnv.value}`);
    } else {
      const contentSplit = content.split('\n');
      const contentEdited = contentSplit.map((line) => (line.includes(dotEnv.key) ? `${dotEnv.key}=${dotEnv.value}` : line)).join('\n');

      writeFile(path, contentEdited);
    }
  });

  const envDotTsObjStr = readFile(envDotTSFile.path);
  const envDotTsObjStrSplit = envDotTsObjStr.split('\n');

  const serviceAlreadyExistInFileEnvDotTs = envDotTsObjStr.includes(envDotTSFile.key);
  if (serviceAlreadyExistInFileEnvDotTs) {
    const positionToEditService = envDotTsObjStrSplit.findIndex((line) => line.includes(envDotTSFile.key)) + 1;
    const envDotTsObjStrEdited = envDotTsObjStrSplit
      .map((line, i) => (positionToEditService === i ? `      baseUrl: ${envDotTSFile.value}\r` : line))
      .join('\n');

    writeFile(envDotTSFile.path, envDotTsObjStrEdited);
  } else {
    const positionInsertService = envDotTsObjStrSplit.findIndex((line) => line.includes('service')) + 1;
    const newService = [`    ${envDotTSFile.key}: {\r`, `      baseUrl: ${envDotTSFile.value}\r`, '    },\r'];
    insertToArray(envDotTsObjStrSplit, positionInsertService, ...newService);
    writeFile(envDotTSFile.path, envDotTsObjStrSplit.join('\n'));
  }
};

const generateServicesDirectory = () => {
  const serviceIndexFile = {
    path: './src/services/index.ts',
    content
  };
};

(async () => {
  // const json = await getJSON('https://petstore.swagger.io/v2/swagger.json');
  // generateEnvironmentVariables(json.info.title, json.host, json.basePath);
  generateEnvironmentVariables('Swagger Petstore', 'petstore.swagger.io', '/v2');
})();
