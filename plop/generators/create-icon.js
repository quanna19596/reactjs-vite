import { PLOP_PROMPT_TYPE, COMPONENT_TYPE, PATH, PLOP_ACTION_TYPE, BREAK_LINE } from "../constants.js";
import { capitalize } from "../utils.js";

export default (plop) => ({
  description: 'Create Icon',
  prompts: [
    {
      type: PLOP_PROMPT_TYPE.INPUT,
      name: 'iconName',
      message: 'Icon name?'
    }
  ],
  actions: ({ iconName }) => {
    const newIconFilePath = `${PATH.SRC.COMPONENTS}/Icon/{{pascalCase iconName}}`;
    const enumFileInIconDirPath = `${PATH.SRC.COMPONENTS}/Icon/Icon.enums.tsx`;
    const indexFileInIconDirPath = `${PATH.SRC.COMPONENTS}/Icon/Icon.tsx`;

    return [
      {
        type: PLOP_ACTION_TYPE.ADD,
        path: newIconFilePath,
        templateFile: `${PATH.PLOP.TEMPLATES._self}/icon.hbs`
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: enumFileInIconDirPath,
        pattern: new RegExp('(' + BREAK_LINE + BREAK_LINE + ')', 'g'),
        template: "import {{pascalCase componentName}}, { T{{pascalCase componentName}}Props } from './{{pascalCase componentName}}';$1"
      },
      { type: PLOP_ACTION_TYPE.PRETTIER }
    ];
  }
});
