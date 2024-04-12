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
      template: 'VITE_{{constantCase serviceName}}_SERVICE={{lowerCase stagingBaseUrl}}' + BREAK_LINE + '$1',
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
      template: 'VITE_{{constantCase serviceName}}_SERVICE={{lowerCase prodBaseUrl}}' + BREAK_LINE + '$1',
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
  const { isUserWantCreateNewService, isUserWantCreateNewGroup, apiName, endpoint, method, serviceName, groupName } = data;

  const serviceDirPath = generateServiceDirPath(plop, { rootPath: PATH.SRC.SERVICES, serviceName });
  const apiFilePath = generateApiFilePath(plop, { rootPath: PATH.SRC.SERVICES, serviceName, groupName, apiName });
  const groupDirPath = generateApiGroupDirPath(plop, { rootPath: PATH.SRC.SERVICES, serviceName, groupName });

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
        endpointFormatted: endpointFormatter(endpoint)
      }
    },
    {
      type: PLOP_ACTION_TYPE.ADD,
      path: `${groupDirPath}/index.ts`,
      template: `export * from './{{dashCase apiName}}';`,
      skip: () =>
        skipAction({ when: !isUserWantCreateNewGroup, path: `${groupDirPath}/index.ts`, description: 'Create root file for new api group' })
    },
    {
      type: PLOP_ACTION_TYPE.MODIFY,
      path: `${groupDirPath}/index.ts`,
      pattern: new RegExp('([\\S\\s]*' + BREAK_LINE + ')', 'g'),
      template: "$1export * from './{{dashCase apiName}}';",
      skip: () =>
        skipAction({ when: isUserWantCreateNewGroup, path: `${groupDirPath}/index.ts`, description: 'Add new export from new api' })
    },
    {
      type: PLOP_ACTION_TYPE.MODIFY,
      path: `${serviceDirPath}/index.ts`,
      pattern: new RegExp('([\\S\\s]*' + BREAK_LINE + ')', 'g'),
      template: "$1export * from './{{dashCase groupName}}';",
      skip: () =>
        skipAction({
          when: isUserWantCreateNewService || !isUserWantCreateNewGroup,
          path: `${serviceDirPath}/index.ts`,
          description: 'Add new export for new api group'
        })
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
      template: "$1import { {{camelCase groupName}}Slice } from './slices/{{dashCase serviceName}}';",
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
      pattern: new RegExp("(import { TInitialState } from '@/redux';)([\\S\\s]*)(const initialState: {)([\\S\\s]*)(} = {)([\S\s]*)", 'g'),
      template: "$1import { T{{pascalCase apiName}}Response } from '@/services/{{dashCase serviceName}}';$2$3{{camelCase apiName}}: TInitialState<T{{pascalCase apiName}}Response>;$4$5{{camelCase apiName}}: { data: undefined, isLoading: undefined, error: undefined },$6",
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
      template: "$1{{camelCase apiName}}Success: (state, action) => successHandler(state, action, { data: action.payload }),",
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
      pattern: new RegExp("(import { errorHandler, requestHandler } from '@/redux';)([\\S\\s]*)(stateReducers = {)([\\S\\s]*)", 'g'),
      template: "$1import { T{{pascalCase apiName}}Parameters, T{{pascalCase apiName}}Response } from '@/services/{{dashCase serviceName}}';$2$3{{camelCase apiName}}Request: requestHandler<T{{pascalCase apiName}}Parameters, T{{pascalCase apiName}}Response, TResponseError>,{{camelCase apiName}}Failed: errorHandler<TResponseError>,$4",
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
      path: `${serviceDirSlicePath}/index.ts`,
      pattern: new RegExp('([\\S\\s]*' + BREAK_LINE + ')', 'g'),
      template: "$1export * from './{{dashCase groupName}}/slice';",
      skip: () => skipAction({ when: !isUserWantCreateNewGroup || isUserWantCreateNewService, path: `${serviceDirSlicePath}/index.ts`, description: 'Add new export for new api group' })
    },
    {
      type: PLOP_ACTION_TYPE.ADD,
      path: `${serviceDirSlicePath}/index.ts`,
      template: "export * from './{{dashCase groupName}}/slice';",
      skip: () => skipAction({ when: !isUserWantCreateNewService, path: `${serviceDirSlicePath}/index.ts`, description: 'Add new root file for new service' })
    },
    {
      type: PLOP_ACTION_TYPE.ADD,
      path: `${serviceDirSagaPath}/index.ts`,
      templateFile: `${PATH.PLOP.TEMPLATES.SAGA}/index.hbs`,
      skip: () => {
        const hasAtLeastOneService = !!getAllDirsInDirectory(serviceDirSagaPath).length;
        return skipAction({ when: hasAtLeastOneService, path: `${serviceDirSagaPath}/index.ts`, description: 'Add new root file for new service' })
      }
    },
    {
      type: PLOP_ACTION_TYPE.MODIFY,
      path: `${serviceDirSagaPath}/index.ts`,
      pattern: new RegExp("(import { all, fork } from 'redux-saga/effects';)([\\S\\s]*)(all([)", 'g'),
      template: "$1import {{camelCase serviceName}}RootSaga from './{{dashCase serviceName}}';$2$3fork({{camelCase serviceName}}RootSaga),",
      skip: () => skipAction({ when: !isUserWantCreateNewService, path: `${serviceDirSagaPath}/index.ts`, description: 'Add new fork for new service' })
    },
    {
      type: PLOP_ACTION_TYPE.ADD,
      path: apiFileSagaPath,
      templateFile: `${PATH.PLOP.TEMPLATES.SAGA}/api.hbs`,
    },
    {
      type: PLOP_ACTION_TYPE.ADD,
      path: `${groupDirSagaPath}/index.ts`,
      template: "export * from './{{dashCase apiName}}';",
      skip: () => skipAction({ when: !isUserWantCreateNewGroup, path: `${groupDirSagaPath}/index.ts`, description: 'Add new file for new api group' })
    },
    {
      type: PLOP_ACTION_TYPE.MODIFY,
      path: `${groupDirSagaPath}/index.ts`,
      pattern: new RegExp('([\\S\\s]*' + BREAK_LINE + ')', 'g'),
      template: "$1export * from './{{dashCase apiName}}';",
      skip: () => skipAction({ when: isUserWantCreateNewGroup, path: `${groupDirSagaPath}/index.ts`, description: 'Add new import for new api in already exist api group' })
    },
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
