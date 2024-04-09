import { PLOP_PROMPT_TYPE, PATH, PLOP_ACTION_TYPE, BREAK_LINE } from "../constants.js";

export default (plop) => ({
  description: 'Create Service',
  prompts: [
    {
      type: PLOP_PROMPT_TYPE.INPUT,
      name: 'serviceName',
      message: 'Service name?'
    },
    // {
    //   type: PLOP_PROMPT_TYPE.INPUT,
    //   name: 'devBaseUrl',
    //   message: 'Base url for development environment?'
    // },
    // {
    //   type: PLOP_PROMPT_TYPE.INPUT,
    //   name: 'stagingBaseUrl',
    //   message: 'Base url for staging environment?'
    // },
    // {
    //   type: PLOP_PROMPT_TYPE.INPUT,
    //   name: 'prodBaseUrl',
    //   message: 'Base url for production environment?'
    // },
  ],
  actions: ({ serviceName, devBaseUrl, stagingBaseUrl, prodBaseUrl }) => {
    const devEnvFilePath = PATH.DEVELOPMENT_ENV;
    const stagingEnvFilePath = PATH.STAGING_ENV;
    const prodEnvFilePath = PATH.PRODUCTION_ENV;
    const objEnvFilePath = PATH.SRC.ENV;
    const rootServicesIndexFilePath = `${PATH.SRC.SERVICES}/index.ts`;
    const serviceDirPath = `${PATH.SRC.SERVICES}/{{camelCase serviceName}}`;

    return [
      // {
      //   type: PLOP_ACTION_TYPE.MODIFY,
      //   path: devEnvFilePath,
      //   pattern: new RegExp('(# END SERVICES)','g'),
      //   template: 'VITE_{{constantCase serviceName}}_SERVICE={{lowerCase devBaseUrl}}' + BREAK_LINE + '$1'
      // },
      // {
      //   type: PLOP_ACTION_TYPE.MODIFY,
      //   path: stagingEnvFilePath,
      //   pattern: new RegExp('(# END SERVICES)','g'),
      //   template: 'VITE_{{constantCase serviceName}}_SERVICE={{lowerCase stagingBaseUrl}}' + BREAK_LINE + '$1'
      // },
      // {
      //   type: PLOP_ACTION_TYPE.MODIFY,
      //   path: prodEnvFilePath,
      //   pattern: new RegExp('(# END SERVICES)','g'),
      //   template: 'VITE_{{constantCase serviceName}}_SERVICE={{lowerCase prodBaseUrl}}' + BREAK_LINE + '$1'
      // },
      // {
      //   type: PLOP_ACTION_TYPE.MODIFY,
      //   path: objEnvFilePath,
      //   pattern: new RegExp('(service: {)','g'),
      //   template: "$1{{camelCase serviceName}}: { baseUrl: import.meta.env.VITE_{{constantCase serviceName}}_SERVICE ?? '' },"
      // },
      // {
      //   type: PLOP_ACTION_TYPE.MODIFY,
      //   path: rootServicesIndexFilePath,
      //   pattern: new RegExp('(export type)','g'),
      //   template: "export * from './{{camelCase serviceName}}';$1"
      // },
      {
        type: PLOP_ACTION_TYPE.ADD_MANY,
        destination: serviceDirPath,
        base: PATH.PLOP.TEMPLATES.SERVICE,
        templateFiles: `${PATH.PLOP.TEMPLATES.SERVICE}/*`
      },
      { type: PLOP_ACTION_TYPE.PRETTIER }
    ];
  }
});
