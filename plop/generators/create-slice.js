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
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: enumFileInIconDirPath,
        pattern: new RegExp('(export[\\S\\s]*)(' + BREAK_LINE + '})', 'g'),
        template: "$1,{{constantCase iconName}} = '{{dashCase iconName}}'$2"
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: indexFileInIconDirPath,
        pattern: new RegExp("(import[\\S\\s]*)(import './Icon.scss';)", 'g'),
        template: "$1import {{pascalCase iconName}} from './{{pascalCase iconName}}';$2"
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: indexFileInIconDirPath,
        pattern: new RegExp('(import[\\S\\s]*)(default:)', 'g'),
        template: "$1case EIconName.{{constantCase iconName}}: return <{{pascalCase iconName}} {...colorProps} />;$2"
      },
      { type: PLOP_ACTION_TYPE.PRETTIER }
    ];
  }
});
