import { PLOP_PROMPT_TYPE, PATH, PLOP_ACTION_TYPE, BREAK_LINE, COMPONENT_TYPE } from '../constants.js';
import { getAllDirsInDirectory } from '../utils.js';

export default (plop) => ({
  description: 'Remove Component',
  prompts: [
    {
      type: PLOP_PROMPT_TYPE.LIST,
      name: 'componentType',
      choices: Object.values(COMPONENT_TYPE),
      message: 'Component type?'
    },
    {
      type: PLOP_PROMPT_TYPE.LIST,
      name: 'componentName',
      choices: ({ componentType }) => {
        const components = getAllDirsInDirectory(`${PATH.SRC._self}/${componentType}`);
        return components;
      },
      message: 'Component name?'
    }
  ],
  actions: ({ componentType, componentName }) => {
    const componentDirPath = `${PATH.SRC._self}/${componentType}/${componentName}`;
    const storyFilePath = `${PATH.STORYBOOK}/${componentType}/${componentName}.stories.ts`;
    const templateRenderedStyle = `$${componentName}: '.${componentName}';`;

    return [
      {
        type: PLOP_ACTION_TYPE.REMOVE_MANY,
        paths: [componentDirPath, storyFilePath]
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: PATH.SRC.STYLES.MAIN_CLASSES,
        pattern: new RegExp(BREAK_LINE + `\\${templateRenderedStyle}`, 'g'),
        template: ''
      },
      { type: PLOP_ACTION_TYPE.PRETTIER }
    ];
  }
});
