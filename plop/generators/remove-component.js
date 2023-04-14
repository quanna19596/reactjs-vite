import { PLOP_PROMPT_TYPE, PATH, PLOP_ACTION_TYPE, BREAK_LINE } from '../constants.js';
import { getAllDirsInDirectory } from '../utils.js';

export default (plop) => ({
  description: 'Remove Component',
  prompts: [
    {
      type: PLOP_PROMPT_TYPE.LIST,
      name: 'rawComponentName',
      choices: () => {
        const unitComponents = getAllDirsInDirectory(`${PATH.SRC._self}/components`).map((comp) => `${comp} (components)`);
        const containerComponents = getAllDirsInDirectory(`${PATH.SRC._self}/containers`).map((comp) => `${comp} (containers)`);
        const components = [...unitComponents, ...containerComponents].filter((comp) => !comp.includes('.'));
        return components;
      },
      message: 'Component name?'
    }
  ],
  actions: ({ rawComponentName }) => {
    const componentName = rawComponentName.split(' (')[0];
    const componentType = rawComponentName.split('(')[1].replace(')', '');
    const componentDirPath = `${PATH.SRC._self}/${componentType}/${componentName}`;
    const storyFilePath = `${PATH.STORYBOOK}/${componentType}/${componentName}.stories.tsx`;
    const indexFileInComponentTypeDirPath = `${PATH.SRC._self}/${componentType}/index.ts`;

    const templateRenderedStyle = `$${componentName}: '.${componentName}';`;
    const indexFileImportLineTemplate = `import ${componentName}, { T${componentName}Props } from './${componentName}';`;

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
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: indexFileInComponentTypeDirPath,
        pattern: new RegExp(indexFileImportLineTemplate, 'g'),
        template: ''
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: indexFileInComponentTypeDirPath,
        pattern: new RegExp(`${componentName},`, 'g'),
        template: ''
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: indexFileInComponentTypeDirPath,
        pattern: new RegExp(componentName, 'g'),
        template: ''
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: indexFileInComponentTypeDirPath,
        pattern: /TProps,/g,
        template: ''
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: indexFileInComponentTypeDirPath,
        pattern: /TProps/g,
        template: ''
      },
      { type: PLOP_ACTION_TYPE.PRETTIER }
    ];
  }
});
