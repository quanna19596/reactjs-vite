import { PLOP_PROMPT_TYPE, PATH, PLOP_ACTION_TYPE, BREAK_LINE } from '../constants.js';
import { getAllDirsInDirectory, getAllFilesInDirectory, skipAction } from '../utils.js';

const PROMPT_OPTION = {
  ADD_NEW_SERVICE: 'Add new a service',
  ADD_NEW_GROUP: 'Add new a group'
};

export default (plop) => {
  const userWantCreateNewService = ({ rawServiceName }) => rawServiceName === PROMPT_OPTION.ADD_NEW_SERVICE;
  const userWantCreateNewGroup = ({ rawGroupName, rawServiceName }) =>
    rawGroupName === PROMPT_OPTION.ADD_NEW_GROUP || rawServiceName === PROMPT_OPTION.ADD_NEW_SERVICE;

  return {
    description: 'Create API',
    prompts: [
      {
        type: PLOP_PROMPT_TYPE.LIST,
        name: 'rawServiceName',
        choices: () => {
          const allServices = getAllDirsInDirectory(PATH.SRC.SERVICES);
          return [...allServices, PROMPT_OPTION.ADD_NEW_SERVICE];
        },
        message: 'Service name?'
      },
      {
        type: PLOP_PROMPT_TYPE.INPUT,
        name: 'serviceName',
        message: 'New service name?',
        when: userWantCreateNewService
      },
      {
        type: PLOP_PROMPT_TYPE.INPUT,
        name: 'devBaseUrl',
        message: 'Base url for development environment?',
        when: userWantCreateNewService
      },
      {
        type: PLOP_PROMPT_TYPE.INPUT,
        name: 'stagingBaseUrl',
        message: 'Base url for staging environment?',
        when: userWantCreateNewService
      },
      {
        type: PLOP_PROMPT_TYPE.INPUT,
        name: 'prodBaseUrl',
        message: 'Base url for production environment?',
        when: userWantCreateNewService
      },
      {
        type: PLOP_PROMPT_TYPE.LIST,
        name: 'rawGroupName',
        choices: ({ rawServiceName }) => {
          const allGroups = getAllDirsInDirectory(`${PATH.SRC.SERVICES}/${rawServiceName}`);
          return [...allGroups, PROMPT_OPTION.ADD_NEW_GROUP];
        },
        message: 'Group name?',
        when: (data) => !userWantCreateNewService(data)
      },
      {
        type: PLOP_PROMPT_TYPE.INPUT,
        name: 'groupName',
        message: 'New group name?',
        when: userWantCreateNewGroup
      },
      {
        type: PLOP_PROMPT_TYPE.INPUT,
        name: 'apiName',
        message: 'API Name?'
      },
      {
        type: PLOP_PROMPT_TYPE.INPUT,
        name: 'endpoint',
        message: 'Endpoint?'
      },
      {
        type: PLOP_PROMPT_TYPE.LIST,
        name: 'method',
        choices: () => {
          return ['GET', 'POST', 'POST FORM', 'PUT', 'PUT FORM', 'PATCH', 'PATCH FORM', 'DELETE'];
        },
        message: 'Method?'
      }
    ],
    actions: (data) => {
      const { apiName, endpoint, method } = data;
      const isUserWantCreateNewService = data.rawServiceName === PROMPT_OPTION.ADD_NEW_SERVICE;
      data.serviceName = isUserWantCreateNewService ? data.serviceName : data.rawServiceName;
      const isUserWantCreateNewGroup = isUserWantCreateNewService || data.rawGroupName === PROMPT_OPTION.ADD_NEW_GROUP;
      data.groupName = isUserWantCreateNewGroup ? data.groupName : data.rawGroupName;
      const serviceName = data.serviceName;
      const groupName = data.groupName;

      const devEnvFilePath = PATH.DEVELOPMENT_ENV;
      const stagingEnvFilePath = PATH.STAGING_ENV;
      const prodEnvFilePath = PATH.PRODUCTION_ENV;
      const objEnvFilePath = PATH.SRC.ENV;

      const newServiceDirPath = plop.renderString(`${PATH.SRC.SERVICES}/{{camelCase serviceName}}`, { serviceName });
      const newApiFilePath = plop.renderString(`${PATH.SRC.SERVICES}/{{camelCase serviceName}}/{{camelCase groupName}}/{{dashCase apiName}}.ts`, { serviceName, groupName, apiName });
      const groupDirPath = plop.renderString(`${PATH.SRC.SERVICES}/{{camelCase serviceName}}/{{camelCase groupName}}`, { serviceName, groupName });

      const pathsFormatter = (endpoint) => {
        const endpointSplitted = endpoint.split('/');
        return `${endpointSplitted.filter((el) => el.includes('{')).map((el) => el.replace(/{/g, '').replace(/}/g, '')).join(';')};`;
      };

      const endpointFormatter = (endpoint) => {
        const endpointSplitted = endpoint.split('/');
        return endpointSplitted.map((el) => !el.includes('{') ? el : `${el.split(':')[0].replace(/{/g, '${params.paths?.')}}`).join('/');
      };

      // console.log(`${PATH.PLOP.TEMPLATES.API}/${['get', 'delete'].includes(method) ? 'no-body' : 'has-body'}.hbs`);
      // console.log({
      //   pathsFormatted: pathsFormatter(endpoint),
      //   endpointFormatted: endpointFormatter(endpoint),
      // })

      return [
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: devEnvFilePath,
          pattern: new RegExp('(# END SERVICES)', 'g'),
          template: 'VITE_{{constantCase serviceName}}_SERVICE={{lowerCase devBaseUrl}}' + BREAK_LINE + '$1',
          skip: () => skipAction(!isUserWantCreateNewService, devEnvFilePath)
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: stagingEnvFilePath,
          pattern: new RegExp('(# END SERVICES)', 'g'),
          template: 'VITE_{{constantCase serviceName}}_SERVICE={{lowerCase stagingBaseUrl}}' + BREAK_LINE + '$1',
          skip: () => skipAction(!isUserWantCreateNewService, stagingEnvFilePath)
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: prodEnvFilePath,
          pattern: new RegExp('(# END SERVICES)', 'g'),
          template: 'VITE_{{constantCase serviceName}}_SERVICE={{lowerCase prodBaseUrl}}' + BREAK_LINE + '$1',
          skip: () => skipAction(!isUserWantCreateNewService, prodEnvFilePath)
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: objEnvFilePath,
          pattern: new RegExp('(service: {)', 'g'),
          template: "$1{{camelCase serviceName}}: { baseUrl: import.meta.env.VITE_{{constantCase serviceName}}_SERVICE ?? '' },",
          skip: () => skipAction(!isUserWantCreateNewService, objEnvFilePath)
        },
        {
          type: PLOP_ACTION_TYPE.ADD_MANY,
          destination: newServiceDirPath,
          base: PATH.PLOP.TEMPLATES.SERVICE,
          templateFiles: `${PATH.PLOP.TEMPLATES.SERVICE}/*`,
          skip: () => skipAction(!isUserWantCreateNewService, newServiceDirPath)
        },
        {
          type: PLOP_ACTION_TYPE.ADD,
          path: newApiFilePath,
          templateFile: `${PATH.PLOP.TEMPLATES.API}/${['get', 'delete'].includes(method) ? 'no-body' : 'has-body'}.hbs`,
          data: {
            pathsFormatted: pathsFormatter(endpoint),
            endpointFormatted: endpointFormatter(endpoint),
          }
        },
        {
          type: PLOP_ACTION_TYPE.ADD,
          path: `${groupDirPath}/index.ts`,
          template: `export * from './{{dashCase apiName}}';`,
          skip: () => skipAction(!isUserWantCreateNewGroup, `${groupDirPath}/index.ts`)
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: `${groupDirPath}/index.ts`,
          template: getAllFilesInDirectory(groupDirPath)
            .filter((fileName) => !fileName.includes('index'))
            .map((fileName) => `export * from './${fileName.split('.')[0]}';`),
          skip: () => skipAction(isUserWantCreateNewGroup, `${groupDirPath}/index.ts`)
        },
        { type: PLOP_ACTION_TYPE.PRETTIER }
      ];
    }
  };
};
