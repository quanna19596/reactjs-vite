import { PLOP_PROMPT_TYPE, PATH, PLOP_ACTION_TYPE, BREAK_LINE } from '../constants.js';
import { getAllDirsInDirectory } from '../utils.js';

const OPTION_ADD_NEW = {
  SERVICE: 'Add new a service',
  GROUP: 'Add new a group'
};

export default (plop) => {
  const userWantCreateNewService = ({ rawServiceName }) => rawServiceName === OPTION_ADD_NEW.SERVICE;
  const userWantCreateNewGroup = ({ rawGroupName, rawServiceName }) =>
    rawGroupName === OPTION_ADD_NEW.GROUP || rawServiceName === OPTION_ADD_NEW.SERVICE;

  return {
    description: 'Create API',
    prompts: [
      {
        type: PLOP_PROMPT_TYPE.LIST,
        name: 'rawServiceName',
        choices: () => {
          const allServices = getAllDirsInDirectory(PATH.SRC.SERVICES);
          return [...allServices, OPTION_ADD_NEW.SERVICE];
        },
        message: 'Service name?'
      },
      {
        type: PLOP_PROMPT_TYPE.INPUT,
        name: 'serviceName',
        when: userWantCreateNewService,
        message: 'New service name?'
      },
      {
        type: PLOP_PROMPT_TYPE.INPUT,
        name: 'devBaseUrl',
        when: userWantCreateNewService,
        message: 'Base url for development environment?'
      },
      {
        type: PLOP_PROMPT_TYPE.INPUT,
        name: 'stagingBaseUrl',
        when: userWantCreateNewService,
        message: 'Base url for staging environment?'
      },
      {
        type: PLOP_PROMPT_TYPE.INPUT,
        name: 'prodBaseUrl',
        when: userWantCreateNewService,
        message: 'Base url for production environment?'
      },
      {
        type: PLOP_PROMPT_TYPE.LIST,
        name: 'rawGroupName',
        when: !userWantCreateNewService,
        choices: ({ rawServiceName }) => {
          const allGroups = getAllDirsInDirectory(`${PATH.SRC.SERVICES}/${rawServiceName}`);
          return [...allGroups, OPTION_ADD_NEW.GROUP];
        },
        message: 'Group name?'
      },
      {
        type: PLOP_PROMPT_TYPE.INPUT,
        name: 'groupName',
        when: userWantCreateNewGroup,
        message: 'New group name?'
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
      const { devBaseUrl, stagingBaseUrl, prodBaseUrl, apiName, endpoint, method } = data;
      const isUserWantCreateNewService = data.rawServiceName === OPTION_ADD_NEW.SERVICE;
      data.serviceName = isUserWantCreateNewService ? data.serviceName : data.rawServiceName;
      const isUserWantCreateNewGroup = isUserWantCreateNewService || data.rawGroupName === OPTION_ADD_NEW.GROUP;
      data.groupName = isUserWantCreateNewGroup ? data.groupName : data.rawGroupName;
      const serviceName = data.serviceName;
      const groupName = data.groupName;

      const rootServicesIndexFilePath = `${PATH.SRC.SERVICES}/index.tsx`;
      // const enumFileInIconDirPath = `${PATH.SRC.COMPONENTS}/Icon/Icon.enums.ts`;
      // const indexFileInIconDirPath = `${PATH.SRC.COMPONENTS}/Icon/Icon.tsx`;

      return [
        // {
        //   type: PLOP_ACTION_TYPE.ADD,
        //   path: newIconFilePath,
        //   templateFile: `${PATH.PLOP.TEMPLATES._self}/icon.hbs`
        // },
        // {
        //   type: PLOP_ACTION_TYPE.MODIFY,
        //   path: enumFileInIconDirPath,
        //   pattern: new RegExp('(export[\\S\\s]*)(' + BREAK_LINE + '})', 'g'),
        //   template: "$1,{{constantCase iconName}} = '{{dashCase iconName}}'$2"
        // },
        // {
        //   type: PLOP_ACTION_TYPE.MODIFY,
        //   path: indexFileInIconDirPath,
        //   pattern: new RegExp("(import[\\S\\s]*)(import './Icon.scss';)", 'g'),
        //   template: "$1import {{pascalCase iconName}} from './{{pascalCase iconName}}';$2"
        // },
        // {
        //   type: PLOP_ACTION_TYPE.MODIFY,
        //   path: indexFileInIconDirPath,
        //   pattern: new RegExp('(import[\\S\\s]*)(default:)', 'g'),
        //   template: "$1case EIconName.{{constantCase iconName}}: return <{{pascalCase iconName}} {...colorProps} />;$2"
        // },
        // { type: PLOP_ACTION_TYPE.PRETTIER }
      ];
    }
  };
};
