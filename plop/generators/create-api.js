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
  const endpointSplitted = endpoint.split('?')[0].split('/');
  const pathParams = endpointSplitted.filter((el) => el.includes('{'));
  return !!pathParams.length ? `${pathParams.map((el) => el.replace(/{/g, '').replace(/}/g, '')).join(';')};` : '';
};

const queriesFormatter = (endpoint) => {
  const queries = endpoint.split('?')[1];

  if (!queries) return '';

  const queriesSplitted = queries.split('&');
  return queriesSplitted.map((query) => `${query.replace('=', ':')};`)
};

const bodyFormatter = (payloadStr) => {
  if (!payloadStr) return '';

  return `${payloadStr.replace(/=/g, ':').replace(/@/g, ';')};`
};

const endpointFormatter = (endpoint) => {
  const endpointSplitted = endpoint.split('?')[0].split('/');
  return endpointSplitted.map((el) => (!el.includes('{') ? el : `${el.split(':')[0].replace(/{/g, '${params.paths?.')}}`)).join('/');
};

const generateServiceDirPath = (plop, { rootPath, serviceName }) =>
  plop.renderString(`${rootPath}/{{dashCase serviceName}}`, { serviceName });

const generateApiGroupDirPath = (plop, { rootPath, serviceName, groupName }) => {
  return plop.renderString(`${rootPath}/{{dashCase serviceName}}/{{dashCase groupName}}`, {
    serviceName,
    groupName
  });
};

const generateApiFilePath = (plop, { rootPath, serviceName, groupName, apiName }) => {
  return plop.renderString(`${rootPath}/{{dashCase serviceName}}/{{dashCase groupName}}/{{dashCase apiName}}.ts`, {
    serviceName,
    groupName,
    apiName
  });
}

const envFilesActions = (data) => {
  const { isUserWantCreateNewService } = data;

  const localEnvFilePath = PATH.LOCAL_ENV;
  const devEnvFilePath = PATH.DEVELOPMENT_ENV;
  const stagingEnvFilePath = PATH.STAGING_ENV;
  const prodEnvFilePath = PATH.PRODUCTION_ENV;
  const objEnvFilePath = PATH.SRC.ENV;

  return [
    {
      type: PLOP_ACTION_TYPE.MODIFY,
      path: localEnvFilePath,
      pattern: new RegExp('(# END SERVICES)', 'g'),
      template: 'VITE_{{constantCase serviceName}}_SERVICE={{lowerCase devBaseUrl}} # {{constantCase serviceName}}_SERVICE' + BREAK_LINE + '$1',
      skip: () =>
        skipAction({
          when: !isUserWantCreateNewService,
          path: localEnvFilePath,
          description: 'Add new local environment variable for new service'
        })
    },
    {
      type: PLOP_ACTION_TYPE.MODIFY,
      path: devEnvFilePath,
      pattern: new RegExp('(# END SERVICES)', 'g'),
      template: 'VITE_{{constantCase serviceName}}_SERVICE={{lowerCase devBaseUrl}} # {{constantCase serviceName}}_SERVICE' + BREAK_LINE + '$1',
      skip: () =>
        skipAction({
          when: !isUserWantCreateNewService,
          path: devEnvFilePath,
          description: 'Add new development environment variable for new service'
        })
    },
    {
      type: PLOP_ACTION_TYPE.MODIFY,
      path: stagingEnvFilePath,
      pattern: new RegExp('(# END SERVICES)', 'g'),
      template: 'VITE_{{constantCase serviceName}}_SERVICE={{lowerCase stagingBaseUrl}} # {{constantCase serviceName}}_SERVICE' + BREAK_LINE + '$1',
      skip: () =>
        skipAction({
          when: !isUserWantCreateNewService,
          path: stagingEnvFilePath,
          description: 'Add new staging environment variable for new service'
        })
    },
    {
      type: PLOP_ACTION_TYPE.MODIFY,
      path: prodEnvFilePath,
      pattern: new RegExp('(# END SERVICES)', 'g'),
      template: 'VITE_{{constantCase serviceName}}_SERVICE={{lowerCase prodBaseUrl}} # {{constantCase serviceName}}_SERVICE' + BREAK_LINE + '$1',
      skip: () =>
        skipAction({
          when: !isUserWantCreateNewService,
          path: prodEnvFilePath,
          description: 'Add new production environment variable for new service'
        })
    },
    {
      type: PLOP_ACTION_TYPE.MODIFY,
      path: objEnvFilePath,
      pattern: new RegExp('(service: {)', 'g'),
      template: "$1{{camelCase serviceName}}: { baseUrl: import.meta.env.VITE_{{constantCase serviceName}}_SERVICE ?? '' },",
      skip: () =>
        skipAction({
          when: !isUserWantCreateNewService,
          path: objEnvFilePath,
          description: 'Add new variable for new service'
        })
    }
  ];
};

const servicesActions = (data, plop) => {
  const { isUserWantCreateNewService, apiName, endpoint, method, payload, serviceName, groupName } = data;

  const serviceDirPath = generateServiceDirPath(plop, { rootPath: PATH.SRC.SERVICES, serviceName });
  const apiFilePath = generateApiFilePath(plop, { rootPath: PATH.SRC.SERVICES, serviceName, groupName, apiName });

  return [
    {
      type: PLOP_ACTION_TYPE.ADD_MANY,
      destination: serviceDirPath,
      base: PATH.PLOP.TEMPLATES.SERVICE,
      templateFiles: `${PATH.PLOP.TEMPLATES.SERVICE}/*`,
      skip: () => skipAction({ when: !isUserWantCreateNewService, path: serviceDirPath, description: 'Create root files for new service' })
    },
    {
      type: PLOP_ACTION_TYPE.ADD,
      path: apiFilePath,
      templateFile: `${PATH.PLOP.TEMPLATES.API}/${[API_METHOD.GET, API_METHOD.DELETE].includes(method) ? 'no-body' : 'has-body'}.hbs`,
      data: {
        pathsFormatted: pathsFormatter(endpoint),
        endpointFormatted: endpointFormatter(endpoint),
        queriesFormatted: queriesFormatter(endpoint),
        bodyFormatted: bodyFormatter(payload),
      }
    }
  ];
};

const reduxActions = (data, plop) => {
  const { isUserWantCreateNewGroup, isUserWantCreateNewService, serviceName, groupName, apiName } = data;

  const rootReducerFilePath = `${PATH.SRC.REDUX._self}/root-reducer.ts`;

  const serviceDirSlicePath = generateServiceDirPath(plop, { rootPath: PATH.SRC.REDUX.SLICES, serviceName });
  const groupDirSlicePath = generateApiGroupDirPath(plop, { rootPath: PATH.SRC.REDUX.SLICES, serviceName, groupName });

  const serviceDirSagaPath = generateServiceDirPath(plop, { rootPath: PATH.SRC.REDUX.SAGAS, serviceName });
  const groupDirSagaPath = generateApiGroupDirPath(plop, { rootPath: PATH.SRC.REDUX.SAGAS, serviceName, groupName });
  const apiFileSagaPath = generateApiFilePath(plop, { rootPath: PATH.SRC.REDUX.SAGAS, serviceName, groupName, apiName });

  return [
    {
      type: PLOP_ACTION_TYPE.MODIFY,
      path: rootReducerFilePath,
      pattern: new RegExp("(import { combineReducers } from 'redux';" + BREAK_LINE + BREAK_LINE + ')', 'g'),
      template: "$1import {{camelCase groupName}}Slice from './slices/{{dashCase serviceName}}/{{dashCase groupName}}/slice';",
      skip: () =>
        skipAction({ when: !isUserWantCreateNewGroup, path: rootReducerFilePath, description: 'Add new import for new api group' })
    },
    {
      type: PLOP_ACTION_TYPE.MODIFY,
      path: rootReducerFilePath,
      pattern: new RegExp(plop.renderString('({{camelCase serviceName}}: combineReducers\\({)', { serviceName }), 'g'),
      template: '$1{{camelCase groupName}}: {{camelCase groupName}}Slice.reducer,',
      skip: () =>
        skipAction({
          when: !isUserWantCreateNewGroup || isUserWantCreateNewService,
          path: rootReducerFilePath,
          description: 'Add new reducer for new api group in already exist service'
        })
    },
    {
      type: PLOP_ACTION_TYPE.MODIFY,
      path: rootReducerFilePath,
      pattern: new RegExp('(const rootReducer = {)', 'g'),
      template: '$1{{camelCase serviceName}}: combineReducers({ {{camelCase groupName}}: {{camelCase groupName}}Slice.reducer }),',
      skip: () =>
        skipAction({
          when: !isUserWantCreateNewService,
          path: rootReducerFilePath,
          description: 'Add new reducer for new service and new api group'
        })
    },
    {
      type: PLOP_ACTION_TYPE.MODIFY,
      path: `${groupDirSlicePath}/initial-state.ts`,
      pattern: new RegExp("(import { TInitialState } from '@/redux/types';)([\\S\\s]*)(const initialState: {)([\\S\\s]*)(} = {)([\S\s]*)", 'g'),
      template: "$1import { T{{pascalCase apiName}}Response } from '@/services/{{dashCase serviceName}}/{{dashCase groupName}}/{{dashCase apiName}}';$2$3{{camelCase apiName}}: TInitialState<T{{pascalCase apiName}}Response>;$4$5{{camelCase apiName}}: { data: undefined, isLoading: undefined, error: undefined },$6",
      skip: () =>
        skipAction({
          when: isUserWantCreateNewGroup,
          path: `${groupDirSlicePath}/initial-state.ts`,
          description: 'Add new api for already exist service (reducer) and already exist group (slice)'
        })
    },
    {
      type: PLOP_ACTION_TYPE.MODIFY,
      path: `${groupDirSlicePath}/slice.ts`,
      pattern: new RegExp('(reducers: {)', 'g'),
      template: "$1{{camelCase apiName}}Success: successHandler,",
      skip: () =>
        skipAction({
          when: isUserWantCreateNewGroup,
          path: `${groupDirSlicePath}/slice.ts`,
          description: 'Add new api for already exist service (reducer) and already exist group (slice)'
        })
    },
    {
      type: PLOP_ACTION_TYPE.MODIFY,
      path: `${groupDirSlicePath}/state-reducers.ts`,
      pattern: new RegExp("(import { errorHandler, requestHandler } from '@/redux/slices/utils';)([\\S\\s]*)(stateReducers = {)([\\S\\s]*)", 'g'),
      template: "$1import { T{{pascalCase apiName}}Parameters, T{{pascalCase apiName}}Response } from '@/services/{{dashCase serviceName}}/{{dashCase groupName}}/{{dashCase apiName}}';$2$3{{camelCase apiName}}Request: requestHandler<T{{pascalCase apiName}}Parameters, T{{pascalCase apiName}}Response, TResponseError>,{{camelCase apiName}}Failed: errorHandler<TResponseError>,$4",
      skip: () =>
        skipAction({
          when: isUserWantCreateNewGroup,
          path: `${groupDirSlicePath}/state-reducers.ts`,
          description: 'Add new api for already exist service (reducer) and already exist group (slice)'
        })
    },
    {
      type: PLOP_ACTION_TYPE.ADD_MANY,
      destination: groupDirSlicePath,
      base: PATH.PLOP.TEMPLATES.SLICE_GROUP,
      templateFiles: `${PATH.PLOP.TEMPLATES.SLICE_GROUP}/*`,
      skip: () => skipAction({ when: !isUserWantCreateNewGroup, path: groupDirSlicePath, description: 'Create root files for new group' })
    },
    {
      type: PLOP_ACTION_TYPE.MODIFY,
      path: `${PATH.SRC.REDUX.SAGAS}/index.ts`,
      pattern: new RegExp("(import { all, fork } from 'redux-saga\\/effects';)([\\S\\s]*)(all\\(\\[)", 'g'),
      template: "$1import {{camelCase serviceName}}RootSaga from './{{dashCase serviceName}}';$2$3fork({{camelCase serviceName}}RootSaga),",
      skip: () => skipAction({ when: !isUserWantCreateNewService, path: `${PATH.SRC.REDUX.SAGAS}/index.ts`, description: 'Add new fork for new service' })
    },
    {
      type: PLOP_ACTION_TYPE.ADD,
      path: apiFileSagaPath,
      templateFile: `${PATH.PLOP.TEMPLATES.SAGA}/api.hbs`,
    },
    {
      type: PLOP_ACTION_TYPE.ADD,
      path: `${serviceDirSagaPath}/index.ts`,
      templateFile: `${PATH.PLOP.TEMPLATES.SAGA}/service-index.hbs`,
      skip: () => skipAction({ when: !isUserWantCreateNewService, path: `${serviceDirSagaPath}/index.ts`, description: 'Add new root file for new service' })
    },
    {
      type: PLOP_ACTION_TYPE.MODIFY,
      path: `${serviceDirSagaPath}/index.ts`,
      pattern: new RegExp("(import { all, takeEvery } from 'redux-saga\\/effects';)([\\S\\s]*)(all\\(\\[)", 'g'),
      template: `$1${isUserWantCreateNewGroup ? "import {{camelCase groupName}}Slice from '@/redux/slices/{{dashCase serviceName}}/{{dashCase groupName}}/slice';"  : ""}import {{camelCase apiName}}Saga from './{{dashCase groupName}}/{{dashCase apiName}}';$2$3takeEvery({{camelCase groupName}}Slice.actions.{{camelCase apiName}}Request.type, {{camelCase apiName}}Saga),`,
      skip: () => skipAction({ when: isUserWantCreateNewService, path: `${groupDirSagaPath}/index.ts`, description: 'Add new import for new api in already exist api group' })
    }
  ];
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
        message: 'Service name?',
        validate: (input) => {
          if (!input || (input !== PROMPT_OPTION.ADD_NEW_SERVICE && !getAllDirsInDirectory(PATH.SRC.SERVICES).includes(input))) {
            return 'Please select a valid service name or choose to add a new service.';
          }
          return true;
        }
      },
      {
        type: PLOP_PROMPT_TYPE.INPUT,
        name: 'serviceName',
        message: 'New service name?',
        when: userWantCreateNewService,
        validate: (input) => {
          if (!input || /[^a-zA-Z0-9_-]/.test(input)) {
            return 'Service name must be alphanumeric and can include hyphens and underscores.';
          }
          return true;
        }
      },
      {
        type: PLOP_PROMPT_TYPE.INPUT,
        name: 'localBaseUrl',
        message: 'Base url for local environment?',
        when: userWantCreateNewService,
        validate: (input) => {
          if (!input || !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(input)) {
            return 'Please enter a valid URL for the local environment.';
          }
          return true;
        }
      },
      {
        type: PLOP_PROMPT_TYPE.INPUT,
        name: 'devBaseUrl',
        message: 'Base url for development environment?',
        when: userWantCreateNewService,
        validate: (input) => {
          if (!input || !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(input)) {
            return 'Please enter a valid URL for the development environment.';
          }
          return true;
        }
      },
      {
        type: PLOP_PROMPT_TYPE.INPUT,
        name: 'stagingBaseUrl',
        message: 'Base url for staging environment?',
        when: userWantCreateNewService,
        validate: (input) => {
          if (!input || !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(input)) {
            return 'Please enter a valid URL for the staging environment.';
          }
          return true;
        }
      },
      {
        type: PLOP_PROMPT_TYPE.INPUT,
        name: 'prodBaseUrl',
        message: 'Base url for production environment?',
        when: userWantCreateNewService,
        validate: (input) => {
          if (!input || !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(input)) {
            return 'Please enter a valid URL for the production environment.';
          }
          return true;
        }
      },
      {
        type: PLOP_PROMPT_TYPE.LIST,
        name: 'rawGroupName',
        choices: ({ rawServiceName }) => {
          const allGroups = getAllDirsInDirectory(`${PATH.SRC.SERVICES}/${rawServiceName}`);
          return [...allGroups, PROMPT_OPTION.ADD_NEW_GROUP];
        },
        message: 'Group name?',
        when: (data) => !userWantCreateNewService(data),
        validate: (input) => {
          if (!input || (input !== PROMPT_OPTION.ADD_NEW_GROUP && !getAllDirsInDirectory(`${PATH.SRC.SERVICES}/${data.rawServiceName}`).includes(input))) {
            return 'Please select a valid group name or choose to add a new group.';
          }
          return true;
        }
      },
      {
        type: PLOP_PROMPT_TYPE.INPUT,
        name: 'groupName',
        message: 'New group name?',
        when: userWantCreateNewGroup,
        validate: (input) => {
          if (!input || /[^a-zA-Z0-9_-]/.test(input)) {
            return 'Group name must be alphanumeric and can include hyphens and underscores.';
          }
          return true;
        }
      },
      {
        type: PLOP_PROMPT_TYPE.INPUT,
        name: 'apiName',
        message: 'API Name?',
        validate: (input) => {
          if (!input || /[^a-zA-Z0-9_-]/.test(input)) {
            return 'API name must be alphanumeric and can include hyphens and underscores.';
          }
          return true;
        }
      },
      {
        type: PLOP_PROMPT_TYPE.INPUT,
        name: 'endpoint',
        message: 'Endpoint? (ex: /api/get-user-by-id/{id:string})',
        validate: (input) => {
          if (!input || !/^\/[a-zA-Z0-9\/{}:]*$/.test(input)) {
            return 'Please enter a valid endpoint format.';
          }
          return true;
        }
      },
      {
        type: PLOP_PROMPT_TYPE.LIST,
        name: 'method',
        choices: () => Object.values(API_METHOD),
        message: 'Method?',
        validate: (input) => {
          if (!Object.values(API_METHOD).includes(input)) {
            return 'Please select a valid HTTP method.';
          }
          return true;
        }
      },
      {
        type: PLOP_PROMPT_TYPE.INPUT,
        name: 'payload',
        message: 'Payload? (ex: name=string@age=number@city=string@male=true)',
        when: ({ method }) => ![API_METHOD.GET, API_METHOD.DELETE].includes(method),
        validate: (input) => {
          if (!input) return 'Payload cannot be empty.';
          const pairs = input.split('@');
        
          for (const pair of pairs) {
            const [key, value] = pair.split('=');
            if (!key || !value) return 'Each key-value pair must contain exactly one "=" character.';
            if (value.includes('@') || value.includes(' ')) return 'Value cannot contain "@" or spaces.';
            if (key.includes('@') || key.includes(' ')) return 'Key cannot contain "@" or spaces.';
          }
        
          return true;
        }
      },
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
