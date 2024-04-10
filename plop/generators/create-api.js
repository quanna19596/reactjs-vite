import { PLOP_PROMPT_TYPE, PATH, PLOP_ACTION_TYPE, BREAK_LINE } from '../constants.js';
import { getAllDirsInDirectory, getAllFilesInDirectory, skipAction } from '../utils.js';

const PROMPT_OPTION = {
  ADD_NEW_SERVICE: 'Add new a service',
  ADD_NEW_GROUP: 'Add new a group'
};

const API_METHOD = {
  GET: 'GET',
  POST: 'POST',
  POST_FORM: 'POST FORM',
  PUT: 'PUT',
  PUT_FORM: 'PUT FORM',
  PATCH: 'PATCH',
  PATCH_FORM: 'PATCH FORM',
  DELETE: 'DELETE'
};

const pathsFormatter = (endpoint) => {
  const endpointSplitted = endpoint.split('/');
  const pathParams = endpointSplitted.filter((el) => el.includes('{'));
  return !!pathParams.length ? `${pathParams.map((el) => el.replace(/{/g, '').replace(/}/g, '')).join(';')};` : '';
};

const endpointFormatter = (endpoint) => {
  const endpointSplitted = endpoint.split('/');
  return endpointSplitted.map((el) => (!el.includes('{') ? el : `${el.split(':')[0].replace(/{/g, '${params.paths?.')}}`)).join('/');
};

const envFilesActions = (data) => {
  const { isUserWantCreateNewService } = data;

  const devEnvFilePath = PATH.DEVELOPMENT_ENV;
  const stagingEnvFilePath = PATH.STAGING_ENV;
  const prodEnvFilePath = PATH.PRODUCTION_ENV;
  const objEnvFilePath = PATH.SRC.ENV;

  return [
    {
      type: PLOP_ACTION_TYPE.MODIFY,
      path: devEnvFilePath,
      pattern: new RegExp('(# END SERVICES)', 'g'),
      template: 'VITE_{{constantCase serviceName}}_SERVICE={{lowerCase devBaseUrl}}' + BREAK_LINE + '$1',
      skip: () => skipAction({ when: !isUserWantCreateNewService, path: devEnvFilePath, actionType: PLOP_ACTION_TYPE.MODIFY })
    },
    {
      type: PLOP_ACTION_TYPE.MODIFY,
      path: stagingEnvFilePath,
      pattern: new RegExp('(# END SERVICES)', 'g'),
      template: 'VITE_{{constantCase serviceName}}_SERVICE={{lowerCase stagingBaseUrl}}' + BREAK_LINE + '$1',
      skip: () => skipAction({ when: !isUserWantCreateNewService, path: stagingEnvFilePath, actionType: PLOP_ACTION_TYPE.MODIFY })
    },
    {
      type: PLOP_ACTION_TYPE.MODIFY,
      path: prodEnvFilePath,
      pattern: new RegExp('(# END SERVICES)', 'g'),
      template: 'VITE_{{constantCase serviceName}}_SERVICE={{lowerCase prodBaseUrl}}' + BREAK_LINE + '$1',
      skip: () => skipAction({ when: !isUserWantCreateNewService, path: prodEnvFilePath, actionType: PLOP_ACTION_TYPE.MODIFY })
    },
    {
      type: PLOP_ACTION_TYPE.MODIFY,
      path: objEnvFilePath,
      pattern: new RegExp('(service: {)', 'g'),
      template: "$1{{camelCase serviceName}}: { baseUrl: import.meta.env.VITE_{{constantCase serviceName}}_SERVICE ?? '' },",
      skip: () => skipAction({ when: !isUserWantCreateNewService, path: objEnvFilePath, actionType: PLOP_ACTION_TYPE.MODIFY })
    }
  ];
};

const servicesActions = (data, plop) => {
  const { isUserWantCreateNewService, isUserWantCreateNewGroup, apiName, endpoint, method, serviceName, groupName } = data;
  const serviceDirPath = plop.renderString(`${PATH.SRC.SERVICES}/{{dashCase serviceName}}`, { serviceName });
  const apiFilePath = plop.renderString(`${PATH.SRC.SERVICES}/{{dashCase serviceName}}/{{dashCase groupName}}/{{dashCase apiName}}.ts`, {
    serviceName,
    groupName,
    apiName
  });
  const groupDirPath = plop.renderString(`${PATH.SRC.SERVICES}/{{dashCase serviceName}}/{{dashCase groupName}}`, {
    serviceName,
    groupName
  });

  return [
    {
      type: PLOP_ACTION_TYPE.ADD_MANY,
      destination: serviceDirPath,
      base: PATH.PLOP.TEMPLATES.SERVICE,
      templateFiles: `${PATH.PLOP.TEMPLATES.SERVICE}/*`,
      skip: () => skipAction({ when: !isUserWantCreateNewService, path: serviceDirPath, actionType: PLOP_ACTION_TYPE.ADD_MANY })
    },
    {
      type: PLOP_ACTION_TYPE.ADD,
      path: apiFilePath,
      templateFile: `${PATH.PLOP.TEMPLATES.API}/${[API_METHOD.GET, API_METHOD.DELETE].includes(method) ? 'no-body' : 'has-body'}.hbs`,
      data: {
        pathsFormatted: pathsFormatter(endpoint),
        endpointFormatted: endpointFormatter(endpoint)
      }
    },
    {
      type: PLOP_ACTION_TYPE.ADD,
      path: `${groupDirPath}/index.ts`,
      template: `export * from './{{dashCase apiName}}';`,
      skip: () => skipAction({ when: !isUserWantCreateNewGroup, path: `${groupDirPath}/index.ts`, actionType: PLOP_ACTION_TYPE.ADD })
    },
    {
      type: PLOP_ACTION_TYPE.MODIFY,
      path: `${groupDirPath}/index.ts`,
      pattern: new RegExp('([\\S\\s]*' + BREAK_LINE + ')', 'g'),
      template: "$1export * from './{{dashCase apiName}}';",
      skip: () => skipAction({ when: isUserWantCreateNewGroup, path: `${groupDirPath}/index.ts`, actionType: PLOP_ACTION_TYPE.MODIFY })
    },
    {
      type: PLOP_ACTION_TYPE.MODIFY,
      path: `${serviceDirPath}/index.ts`,
      pattern: new RegExp('([\\S\\s]*' + BREAK_LINE + ')', 'g'),
      template: "$1export * from './{{dashCase groupName}}';",
      skip: () => skipAction({ when: isUserWantCreateNewService, path: `${serviceDirPath}/index.ts`, actionType: PLOP_ACTION_TYPE.MODIFY })
    }
  ];
};

const reduxActions = (data, plop) => {
  const rootReducerFilePath = `${PATH.SRC.REDUX}/root-reducer.ts`;

  return [];
};

export default (plop) => {
  const userWantCreateNewService = ({ rawServiceName }) => rawServiceName === PROMPT_OPTION.ADD_NEW_SERVICE;
  const userWantCreateNewGroup = ({ rawGroupName, rawServiceName }) => {
    return rawGroupName === PROMPT_OPTION.ADD_NEW_GROUP || rawServiceName === PROMPT_OPTION.ADD_NEW_SERVICE;
  };

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
        choices: () => Object.values(API_METHOD),
        message: 'Method?'
      }
    ],
    actions: (data) => {
      const isUserWantCreateNewService = data.rawServiceName === PROMPT_OPTION.ADD_NEW_SERVICE;
      data.serviceName = isUserWantCreateNewService ? data.serviceName : data.rawServiceName;
      const isUserWantCreateNewGroup = isUserWantCreateNewService || data.rawGroupName === PROMPT_OPTION.ADD_NEW_GROUP;
      data.groupName = isUserWantCreateNewGroup ? data.groupName : data.rawGroupName;

      const combinedData = { ...data, isUserWantCreateNewService, isUserWantCreateNewGroup };

      return [
        ...envFilesActions(combinedData),
        ...servicesActions(combinedData, plop),
        ...reduxActions(combinedData, plop),
        { type: PLOP_ACTION_TYPE.PRETTIER }
      ];
    }
  };
};
