import { PLOP_PROMPT_TYPE, COMPONENT_TYPE, PATH, PLOP_ACTION_TYPE, BREAK_LINE } from "../constants.js";
import { capitalize } from "../utils.js";

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
    }
  ],
  actions: ({ componentType }) => {
    const componentDirPath = `${PATH.SRC._self}/${componentType}/{{pascalCase componentName}}`;
    const indexFileInComponentTypeDirPath = `${PATH.SRC._self}/${componentType}/index.ts`;
    const storyFilePath = `${PATH.STORYBOOK}/${componentType}/{{pascalCase componentName}}.stories.tsx`;

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
        type: PLOP_ACTION_TYPE.MODIFY,
        path: indexFileInComponentTypeDirPath,
        pattern: new RegExp('(' + BREAK_LINE + BREAK_LINE + ')', 'g'),
        template: "import {{pascalCase componentName}}, { T{{pascalCase componentName}}Props } from './{{pascalCase componentName}}';$1"
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: indexFileInComponentTypeDirPath,
        pattern: new RegExp('(export[\\S\\s]*)(};' + BREAK_LINE + 'export type)', 'g'),
        template: '$1,{{pascalCase componentName}}$2'
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: indexFileInComponentTypeDirPath,
        pattern: /(export type[\S\s]*)(};)/g,
        template: '$1,T{{pascalCase componentName}}Props$2'
      },
      {
        type: PLOP_ACTION_TYPE.ADD,
        path: storyFilePath,
        templateFile: `${PATH.PLOP.TEMPLATES._self}/storybook.hbs`
      },
      { type: PLOP_ACTION_TYPE.PRETTIER }
    ];
  }
});
