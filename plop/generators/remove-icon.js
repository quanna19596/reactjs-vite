import { PLOP_PROMPT_TYPE, COMPONENT_TYPE, PATH, PLOP_ACTION_TYPE, BREAK_LINE } from "../constants.js";
import { getAllFilesInDirectory } from "../utils.js";

export default (plop) => ({
  description: 'Remove Icon',
  prompts: [
    {
      type: PLOP_PROMPT_TYPE.LIST,
      name: 'iconName',
      choices: () => {
        const allFilesInIconDir = getAllFilesInDirectory(`${PATH.SRC.COMPONENTS}/Icon`);
        const icons = allFilesInIconDir.filter((dir) => !dir.includes('Icon') && !dir.includes('index.ts')).map((fileName) => fileName.split('.')[0]);
        return icons;
      },
      message: 'Icon name?'
    }
  ],
  actions: ({ iconName }) => {
    const iconFilePath = `${PATH.SRC.COMPONENTS}/Icon/{{pascalCase iconName}}.tsx`;
    const enumFileInIconDirPath = `${PATH.SRC.COMPONENTS}/Icon/Icon.enums.ts`;
    const indexFileInIconDirPath = `${PATH.SRC.COMPONENTS}/Icon/Icon.tsx`;

    return [
      {
        type: PLOP_ACTION_TYPE.REMOVE,
        path: iconFilePath,
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: enumFileInIconDirPath,
        pattern: new RegExp(plop.renderString("{{constantCase iconName}} = '{{dashCase iconName}}',", { iconName }) + BREAK_LINE, 'g'),
        template: ''
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: enumFileInIconDirPath,
        pattern: new RegExp(plop.renderString("{{constantCase iconName}} = '{{dashCase iconName}}'", { iconName }) + BREAK_LINE, 'g'),
        template: ''
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: indexFileInIconDirPath,
        pattern: new RegExp(`import ${iconName} from './${iconName}';`, 'g'),
        template: ''
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: indexFileInIconDirPath,
        pattern: new RegExp(plop.renderString('case EIconName.{{constantCase iconName}}:', { iconName }) + BREAK_LINE + `        return <${iconName} {...colorProps} />`, 'g'),
        template: ''
      },
      { type: PLOP_ACTION_TYPE.PRETTIER }
    ];
  }
});
