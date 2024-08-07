import { PLOP_PROMPT_TYPE, COMPONENT_TYPE, PATH, PLOP_ACTION_TYPE, BREAK_LINE, CONFIRM_CHOICE } from "../constants.js";
import { capitalize, skipAction } from "../utils.js";

export default (plop) => ({
  description: 'Create Component',
  prompts: [
    {
      type: PLOP_PROMPT_TYPE.LIST,
      name: 'componentType',
      choices: Object.values(COMPONENT_TYPE),
      message: 'Component type?',
      validate: (input) => {
        if (!Object.values(COMPONENT_TYPE).includes(input)) {
          return 'Invalid component type. Please select a valid type.';
        }
        return true;
      }
    },
    {
      type: PLOP_PROMPT_TYPE.INPUT,
      name: 'componentName',
      message: 'Component name?',
      validate: (input) => {
        const validNamePattern = /^[a-zA-Z0-9_]+$/;
        if (!input) {
          return 'Component name is required.';
        }
        if (!validNamePattern.test(input)) {
          return 'Component name can only contain letters, numbers, and underscores.';
        }
        return true;
      }
    },
    {
      type: PLOP_PROMPT_TYPE.LIST,
      name: 'isCreateStorybook',
      choices: Object.values(CONFIRM_CHOICE),
      message: 'Create storybook?',
      validate: (input) => {
        if (!Object.values(CONFIRM_CHOICE).includes(input)) {
          return 'Please select a valid choice for creating storybook.';
        }
        return true;
      }
    }
  ],
  actions: ({ componentType, isCreateStorybook }) => {
    const componentDirPath = `${PATH.SRC._self}/${componentType}/{{pascalCase componentName}}`;
    const storyFilePath = `${PATH.STORYBOOK}/${componentType}/{{pascalCase componentName}}.stories.ts`;
    const skipStorybook = isCreateStorybook === CONFIRM_CHOICE.NO;

    return [
      {
        type: PLOP_ACTION_TYPE.ADD_MANY,
        destination: componentDirPath,
        base: PATH.PLOP.TEMPLATES.COMPONENT,
        templateFiles: `${PATH.PLOP.TEMPLATES.COMPONENT}/*`
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: PATH.SRC.STYLES.MAIN_CLASSES,
        pattern: new RegExp('(// \\[END\\] ' + capitalize(componentType) + ')' ,'g'), 
        template: "${{pascalCase componentName}}: '.{{pascalCase componentName}}';" + BREAK_LINE + '$1'
      },
      {
        type: PLOP_ACTION_TYPE.ADD,
        path: storyFilePath,
        templateFile: `${PATH.PLOP.TEMPLATES._self}/storybook.hbs`,
        skip: () =>
          skipAction({
            when: skipStorybook,
            path: storyFilePath,
            description: `Add ${componentType} storybook`
          })
      },
      { type: PLOP_ACTION_TYPE.PRETTIER }
    ];
  }
});
