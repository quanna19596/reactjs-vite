import { PLOP_PROMPT_TYPE, COMPONENT_TYPE, PATH, PLOP_ACTION_TYPE, BREAK_LINE, CONFIRM_CHOICE } from "../constants.js";
import { capitalize, skipAction } from "../utils.js";

export default (plop) => ({
  description: 'Create Component',
  prompts: [
    {
      type: PLOP_PROMPT_TYPE.LIST,
      name: 'componentType',
      choices: Object.values(COMPONENT_TYPE),
      message: 'Component type?'
    },
    {
      type: PLOP_PROMPT_TYPE.INPUT,
      name: 'componentName',
      message: 'Component name?'
    },
    {
      type: PLOP_PROMPT_TYPE.LIST,
      name: 'isCreateStorybook',
      choices: Object.values(CONFIRM_CHOICE),
      message: 'Create storybook?'
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
