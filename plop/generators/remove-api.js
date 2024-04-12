import { PLOP_PROMPT_TYPE, PATH, PLOP_ACTION_TYPE, BREAK_LINE } from '../constants.js';
import { getAllDirsInDirectory } from '../utils.js';

export default (plop) => ({
  description: 'Remove API',
  prompts: [
    {
      type: PLOP_PROMPT_TYPE.LIST,
      name: 'serviceName',
      choices: () => {
        const allServices = getAllDirsInDirectory(PATH.SRC.SERVICES);
        return allServices;
      },
      message: 'Service name?'
    }
  ],
  actions: ({ serviceName }) => {
    const devEnvFilePath = PATH.DEVELOPMENT_ENV;
    const stagingEnvFilePath = PATH.STAGING_ENV;
    const prodEnvFilePath = PATH.PRODUCTION_ENV;
    const objEnvFilePath = PATH.SRC.ENV;

    const envVariablePattern = plop.renderString(
      '(VITE_{{constantCase serviceName}}_SERVICE)([\\S\\s]*)(# {{constantCase serviceName}}_SERVICE)' + BREAK_LINE,
      { serviceName }
    );

    const objEnvFilePattern = plop.renderString('{{camelCase serviceName}}: {' + BREAK_LINE + "      baseUrl: import.meta.env.VITE_{{constantCase serviceName}}_SERVICE ?? ''" + BREAK_LINE +     '}', { serviceName })

    return [
      // {
      //   type: PLOP_ACTION_TYPE.REMOVE,
      //   path: `${PATH.SRC.SERVICES}/${serviceName}`
      // },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: devEnvFilePath,
        pattern: new RegExp(envVariablePattern, 'g'),
        template: ''
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: stagingEnvFilePath,
        pattern: new RegExp(envVariablePattern, 'g'),
        template: ''
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: prodEnvFilePath,
        pattern: new RegExp(envVariablePattern, 'g'),
        template: ''
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
      },
      { type: PLOP_ACTION_TYPE.PRETTIER }
    ];
  }
});
