import { PLOP_PROMPT_TYPE, PATH, PLOP_ACTION_TYPE, BREAK_LINE } from "../constants.js";

export default (plop) => ({
  description: 'Create Slice',
  prompts: [
    {
      type: PLOP_PROMPT_TYPE.INPUT,
      name: 'iconName',
      message: 'Icon name?'
    }
  ],
  actions: ({ iconName }) => {
    const newIconFilePath = `${PATH.SRC.COMPONENTS}/Icon/{{pascalCase iconName}}.tsx`;
    const enumFileInIconDirPath = `${PATH.SRC.COMPONENTS}/Icon/Icon.enums.ts`;
    const indexFileInIconDirPath = `${PATH.SRC.COMPONENTS}/Icon/Icon.tsx`;

    return [
      {
        type: PLOP_ACTION_TYPE.ADD,
        path: newIconFilePath,
        templateFile: `${PATH.PLOP.TEMPLATES._self}/icon.hbs`
      },
      { type: PLOP_ACTION_TYPE.PRETTIER }
    ];
  }
});
