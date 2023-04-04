import rimraf from 'rimraf';
import fs from 'fs';
import { exec } from 'child_process';

const PLOP_ACTION_TYPE = {
  ADD: 'add',
  ADD_MANY: 'addMany',
  MODIFY: 'modify',
  REMOVE: 'remove',
  REMOVE_MANY: 'removeMany',
  PRETTIER: 'prettier'
};

const PLOP_COMMAND = {
  CREATE_COMPONENT: 'create-component',
  REMOVE_COMPONENT: 'remove-component',
  CREATE_LAYOUT: 'create-layout',
  REMOVE_LAYOUT: 'remove-layout',
  CREATE_PAGE: 'create-page',
  REMOVE_PAGE: 'remove-page'
};

const PLOP_HELPER_TYPE = {
  SUFFIX_CURLY: 'sufCurly'
};

const PLOP_PROMPT_TYPE = {
  INPUT: 'input',
  LIST: 'list'
};

const COMPONENT_TYPE = { COMPONENTS: 'components', CONTAINERS: 'containers' };
const PROTECTION_TYPE = { PUBLIC: 'public', PRIVATE: 'private' };

const BASE_PATH = { SRC: './src', STORYBOOK: './stories', PLOP_TEMPLATE: './plop-templates' };

const TEMPLATE_COMPONENT_PATH = `${BASE_PATH.PLOP_TEMPLATE}/component`;
const TEMPLATE_LAYOUT_MAIN_COMPONENT_PATH = `${BASE_PATH.PLOP_TEMPLATE}/layout/main-component`;
const STYLE_MAIN_CLASSES_PATH = `${BASE_PATH.SRC}/styles/main-classes.scss`;
const LAYOUTS_PATH = `${BASE_PATH.SRC}/layouts`;
const ROUTER_PATH = `${BASE_PATH.SRC}/router`;

const BREAK_LINE = process.platform.startsWith('win') ? '\r\n' : '\n';

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const readFileAsJSON = (path) => JSON.stringify(fs.readFileSync(path, 'utf8').toString());

const getAllDirsInDirectory = (path) => fs.readdirSync(path).filter((dir) => !dir.includes('.'));

const plopConfig = (plop) => {
  plop.setHelper(PLOP_HELPER_TYPE.SUFFIX_CURLY, (t) => `${t}}`);

  plop.setActionType(PLOP_ACTION_TYPE.PRETTIER, () => {
    exec('yarn format');
  });

  plop.setActionType(PLOP_ACTION_TYPE.REMOVE, (answers, config, plop) => {
    const { path } = config;
    const correctPath = plop.renderString(path, answers);
    rimraf.sync(correctPath);
  });

  plop.setActionType(PLOP_ACTION_TYPE.REMOVE_MANY, (answers, config, plop) => {
    const { paths } = config;
    paths.forEach((path) => {
      const correctPath = plop.renderString(path, answers);
      rimraf.sync(correctPath);
    });
  });

  plop.setGenerator(PLOP_COMMAND.CREATE_COMPONENT, {
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
      const componentDirPath = `${BASE_PATH.SRC}/${componentType}/{{pascalCase componentName}}`;
      const indexFileInComponentTypeDirPath = `${BASE_PATH.SRC}/${componentType}/index.ts`;
      const storyFilePath = `${BASE_PATH.STORYBOOK}/${componentType}/{{pascalCase componentName}}.stories.tsx`;

      return [
        {
          type: PLOP_ACTION_TYPE.ADD_MANY,
          destination: componentDirPath,
          base: TEMPLATE_COMPONENT_PATH,
          templateFiles: `${TEMPLATE_COMPONENT_PATH}/*`
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: STYLE_MAIN_CLASSES_PATH,
          pattern: /(\/\/ \[END\] Components)/g,
          template: "${{pascalCase componentName}}: '.{{pascalCase componentName}}';" + BREAK_LINE + '$1'
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: indexFileInComponentTypeDirPath,
          pattern: new RegExp('(' + BREAK_LINE + BREAK_LINE + ')', 'g'),
          template:
            BREAK_LINE +
            "import {{pascalCase componentName}}, { T{{pascalCase componentName}}Props } from './{{pascalCase componentName}}';$1"
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: indexFileInComponentTypeDirPath,
          pattern: new RegExp('(export )([\\S\\s]*)( };' + BREAK_LINE + 'export type)', 'g'),
          template: '$1$2, {{pascalCase componentName}}$3'
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: indexFileInComponentTypeDirPath,
          pattern: /(export type )([\S\s]*)( };)/g,
          template: '$1$2, T{{pascalCase componentName}}Props$3'
        },
        {
          type: PLOP_ACTION_TYPE.ADD,
          path: storyFilePath,
          templateFile: `${BASE_PATH.PLOP_TEMPLATE}/storybook.hbs`
        },
        { type: PLOP_ACTION_TYPE.PRETTIER }
      ];
    }
  });

  plop.setGenerator(PLOP_COMMAND.REMOVE_COMPONENT, {
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
          const componentTypePath = `${BASE_PATH.SRC}/${componentType}`;
          const components = getAllDirsInDirectory(componentTypePath).filter((dir) => !dir.includes('.'));
          return components;
        },
        message: 'Component name?'
      }
    ],
    actions: ({ componentType, componentName }) => {
      const componentDirPath = `${BASE_PATH.SRC}/${componentType}/${componentName}`;
      const storyFilePath = `${BASE_PATH.STORYBOOK}/${componentType}/${componentName}.stories.tsx`;
      const indexFileInComponentTypeDirPath = `${BASE_PATH.SRC}/${componentType}/index.ts`;

      const templateRenderedStyle = `$${componentName}: '.${componentName}';`;
      const indexFileImportLineTemplate = `import ${componentName}, { T${componentName}Props } from './${componentName}';`;

      return [
        {
          type: PLOP_ACTION_TYPE.REMOVE_MANY,
          paths: [componentDirPath, storyFilePath]
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: STYLE_MAIN_CLASSES_PATH,
          pattern: new RegExp(BREAK_LINE + `\\${templateRenderedStyle}`, 'g'),
          template: ''
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: indexFileInComponentTypeDirPath,
          pattern: new RegExp(`(${BREAK_LINE}${indexFileImportLineTemplate})`, 'g'),
          template: ''
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: indexFileInComponentTypeDirPath,
          pattern: new RegExp(`\\, ${componentName} };`, 'g'),
          template: ' };'
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: indexFileInComponentTypeDirPath,
          pattern: new RegExp(`, ${componentName}\\,`, 'g'),
          template: ','
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: indexFileInComponentTypeDirPath,
          pattern: new RegExp(`{ ${componentName}\\,`, 'g'),
          template: '{'
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: indexFileInComponentTypeDirPath,
          pattern: new RegExp(`\\, T${componentName}Props };`, 'g'),
          template: ' };'
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: indexFileInComponentTypeDirPath,
          pattern: new RegExp(`, T${componentName}Props\\,`, 'g'),
          template: ','
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: indexFileInComponentTypeDirPath,
          pattern: new RegExp(`{ T${componentName}Props\\,`, 'g'),
          template: '{'
        },
        { type: PLOP_ACTION_TYPE.PRETTIER }
      ];
    }
  });

  plop.setGenerator(PLOP_COMMAND.CREATE_LAYOUT, {
    description: 'Create Layout',
    prompts: [
      {
        type: PLOP_PROMPT_TYPE.LIST,
        name: 'layoutType',
        choices: Object.values(PROTECTION_TYPE),
        message: 'Layout type?'
      },
      {
        type: PLOP_PROMPT_TYPE.INPUT,
        name: 'rawLayoutName',
        message: 'Layout name?'
      },
      {
        type: PLOP_PROMPT_TYPE.INPUT,
        name: 'rawLayoutBasePath',
        message: 'Layout base path?',
        when: ({ rawLayoutName }) => !!rawLayoutName
      }
    ],
    actions: (data) => {
      const { layoutType, rawLayoutName, rawLayoutBasePath } = data;

      if (!rawLayoutName) throw new Error('Layout name should not empty!');

      data.layoutBasePath = rawLayoutBasePath.replace('/', '');

      const alreadyExistPaths = readFileAsJSON('./src/router/enums.ts')
        .split('export enum EPagePath')[0]
        .match(/'(.*?)'/g)
        .map((w) => w.replace(/'(.*?)'/g, '$1'));

      const layoutBasePathIsAlreadyExist = alreadyExistPaths.includes(data.layoutBasePath);

      if (!rawLayoutBasePath) throw new Error('Layout base path should not empty!');
      if (layoutBasePathIsAlreadyExist) throw new Error('Layout base path is already exist!');

      data.layoutName = `${rawLayoutName}Layout`;
      const layoutDirPath = plop.renderString(`${LAYOUTS_PATH}/${layoutType}/{{pascalCase layoutName}}`, { layoutName: data.layoutName });
      const layoutParts = {
        default: {
          path: `${layoutDirPath}/default`,
          componentName: `${data.layoutName}Default`,
          templateInMainClassesFile: plop.renderString("${{pascalCase componentName}}: '.{{pascalCase componentName}}';", {
            componentName: `${data.layoutName}Default`
          })
        },
        error: {
          path: `${layoutDirPath}/error`,
          componentName: `${data.layoutName}Error`,
          templateInMainClassesFile: plop.renderString("${{pascalCase componentName}}: '.{{pascalCase componentName}}';", {
            componentName: `${data.layoutName}Error`
          })
        },
        main: {
          path: `${layoutDirPath}/main`,
          componentName: data.layoutName,
          templateInMainClassesFile: plop.renderString("${{pascalCase componentName}}: '.{{pascalCase componentName}}';", {
            componentName: data.layoutName
          })
        },
        notFound: {
          path: `${layoutDirPath}/not-found`,
          componentName: `${data.layoutName}NotFound`,
          templateInMainClassesFile: plop.renderString("${{pascalCase componentName}}: '.{{pascalCase componentName}}';", {
            componentName: `${data.layoutName}NotFound`
          })
        },
        permissionDenied: {
          path: `${layoutDirPath}/permission-denied`,
          componentName: `${data.layoutName}PermissionDenied`,
          templateInMainClassesFile: plop.renderString("${{pascalCase componentName}}: '.{{pascalCase componentName}}';", {
            componentName: `${data.layoutName}PermissionDenied`
          })
        }
      };

      return [
        {
          type: PLOP_ACTION_TYPE.ADD_MANY,
          destination: layoutParts.default.path,
          base: TEMPLATE_COMPONENT_PATH,
          templateFiles: `${TEMPLATE_COMPONENT_PATH}/*`,
          data: { componentName: layoutParts.default.componentName }
        },
        {
          type: PLOP_ACTION_TYPE.ADD_MANY,
          destination: layoutParts.error.path,
          base: TEMPLATE_COMPONENT_PATH,
          templateFiles: `${TEMPLATE_COMPONENT_PATH}/*`,
          data: { componentName: layoutParts.error.componentName }
        },
        {
          type: PLOP_ACTION_TYPE.ADD_MANY,
          destination: layoutParts.main.path,
          base: TEMPLATE_LAYOUT_MAIN_COMPONENT_PATH,
          templateFiles: `${TEMPLATE_LAYOUT_MAIN_COMPONENT_PATH}/*`,
          data: { componentName: layoutParts.main.componentName }
        },
        {
          type: PLOP_ACTION_TYPE.ADD_MANY,
          destination: layoutParts.notFound.path,
          base: TEMPLATE_COMPONENT_PATH,
          templateFiles: `${TEMPLATE_COMPONENT_PATH}/*`,
          data: { componentName: layoutParts.notFound.componentName }
        },
        {
          type: PLOP_ACTION_TYPE.ADD_MANY,
          destination: layoutParts.permissionDenied.path,
          base: TEMPLATE_COMPONENT_PATH,
          templateFiles: `${TEMPLATE_COMPONENT_PATH}/*`,
          data: { componentName: layoutParts.permissionDenied.componentName },
          skip: () => {
            if (layoutType === PROTECTION_TYPE.PUBLIC) return '';
          }
        },
        {
          type: PLOP_ACTION_TYPE.ADD,
          path: `${layoutDirPath}/index.ts`,
          templateFile: `${BASE_PATH.PLOP_TEMPLATE}/layout/private/index.hbs`,
          data: { componentName: data.layoutName },
          skip: () => {
            if (layoutType === PROTECTION_TYPE.PUBLIC) return '';
          }
        },
        {
          type: PLOP_ACTION_TYPE.ADD,
          path: `${layoutDirPath}/index.ts`,
          templateFile: `${BASE_PATH.PLOP_TEMPLATE}/layout/public/index.hbs`,
          data: { componentName: data.layoutName },
          skip: () => {
            if (layoutType === PROTECTION_TYPE.PRIVATE) return '';
          }
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: `${LAYOUTS_PATH}/${layoutType}/index.ts`,
          pattern: new RegExp('(' + BREAK_LINE + ')', 'g'),
          template: `${BREAK_LINE}export * from './{{pascalCase componentName}}';$1`,
          data: { componentName: data.layoutName }
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: STYLE_MAIN_CLASSES_PATH,
          pattern: /(\/\/ \[END\] Layouts)/g,
          template:
            layoutParts.default.templateInMainClassesFile +
            BREAK_LINE +
            layoutParts.error.templateInMainClassesFile +
            BREAK_LINE +
            layoutParts.main.templateInMainClassesFile +
            BREAK_LINE +
            layoutParts.notFound.templateInMainClassesFile +
            BREAK_LINE +
            layoutParts.permissionDenied.templateInMainClassesFile +
            BREAK_LINE +
            '$1',
          skip: () => {
            if (layoutType === PROTECTION_TYPE.PUBLIC) return '';
          }
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: STYLE_MAIN_CLASSES_PATH,
          pattern: /(\/\/ \[END\] Layouts)/g,
          template:
            layoutParts.default.templateInMainClassesFile +
            BREAK_LINE +
            layoutParts.error.templateInMainClassesFile +
            BREAK_LINE +
            layoutParts.main.templateInMainClassesFile +
            BREAK_LINE +
            layoutParts.notFound.templateInMainClassesFile +
            BREAK_LINE +
            '$1',
          skip: () => {
            if (layoutType === PROTECTION_TYPE.PRIVATE) return '';
          }
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: `${ROUTER_PATH}/enums.ts`,
          pattern: new RegExp(
            '(export enum ELayoutPath )([\\S\\s]*)(' + BREAK_LINE + '}' + BREAK_LINE + BREAK_LINE + 'export enum EPagePath)',
            'g'
          ),
          template: '$1$2,' + BREAK_LINE + "  {{constantCase rawLayoutName}} = '{{lowerCase layoutBasePath}}'" + '$3'
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: `${ROUTER_PATH}/config.ts`,
          pattern: new RegExp('(import [\\S\\s]*)(' + BREAK_LINE + "} from '@/layouts';)", 'g'),
          template:
            `$1,` +
            BREAK_LINE +
            `  ${capitalize(layoutParts.main.componentName)},` +
            BREAK_LINE +
            `  ${capitalize(layoutParts.default.componentName)},` +
            BREAK_LINE +
            `  ${capitalize(layoutParts.error.componentName)},` +
            BREAK_LINE +
            `  ${capitalize(layoutParts.notFound.componentName)}` +
            '$2',
          skip: () => {
            if (layoutType === PROTECTION_TYPE.PRIVATE) return '';
          }
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: `${ROUTER_PATH}/config.ts`,
          pattern: new RegExp('(import [\\S\\s]*)(' + BREAK_LINE + "} from '@/layouts';)", 'g'),
          template:
            `$1,` +
            BREAK_LINE +
            `  ${capitalize(layoutParts.main.componentName)},` +
            BREAK_LINE +
            `  ${capitalize(layoutParts.default.componentName)},` +
            BREAK_LINE +
            `  ${capitalize(layoutParts.error.componentName)},` +
            BREAK_LINE +
            `  ${capitalize(layoutParts.notFound.componentName)},` +
            BREAK_LINE +
            `  ${capitalize(layoutParts.permissionDenied.componentName)}` +
            '$2',
          skip: () => {
            if (layoutType === PROTECTION_TYPE.PUBLIC) return '';
          }
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: `${ROUTER_PATH}/config.ts`,
          pattern: new RegExp('(routes[\\S\\s]*)(' + BREAK_LINE + ')(  ])', 'g'),
          templateFile: `${BASE_PATH.PLOP_TEMPLATE}/layout/private/router-config.hbs`,
          data: { rawLayoutName, layoutName: data.layoutName },
          skip: () => {
            if (layoutType === PROTECTION_TYPE.PUBLIC) return '';
          }
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: `${ROUTER_PATH}/config.ts`,
          pattern: new RegExp('(routes[\\S\\s]*)(' + BREAK_LINE + ')(  ])', 'g'),
          templateFile: `${BASE_PATH.PLOP_TEMPLATE}/layout/public/router-config.hbs`,
          data: { rawLayoutName, layoutName: data.layoutName },
          skip: () => {
            if (layoutType === PROTECTION_TYPE.PRIVATE) return '';
          }
        },
        { type: PLOP_ACTION_TYPE.PRETTIER }
      ];
    }
  });

  plop.setGenerator(PLOP_COMMAND.REMOVE_LAYOUT, {
    description: 'Remove Layout',
    prompts: [
      {
        type: PLOP_PROMPT_TYPE.LIST,
        name: 'layoutType',
        choices: Object.values(PROTECTION_TYPE),
        message: 'Layout type?'
      },
      {
        type: PLOP_PROMPT_TYPE.LIST,
        name: 'layoutName',
        choices: ({ layoutType }) => {
          const layoutTypePath = `${LAYOUTS_PATH}/${layoutType}`;
          const layouts = getAllDirsInDirectory(layoutTypePath).filter((dir) => !dir.includes('.'));
          return layouts;
        },
        message: 'Layout name?'
      }
    ],
    actions: (data) => {
      const { layoutType, layoutName } = data;
      const rawLayoutName = layoutName.replace('Layout', '');
      const layoutDirPath = `${LAYOUTS_PATH}/${layoutType}/${layoutName}`;

      return [
        {
          type: PLOP_ACTION_TYPE.REMOVE,
          path: layoutDirPath
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: `${LAYOUTS_PATH}/${layoutType}/index.ts`,
          pattern: new RegExp(BREAK_LINE + "export \\* from './" + layoutName + "';", 'g'),
          template: ''
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: STYLE_MAIN_CLASSES_PATH,
          pattern: new RegExp(BREAK_LINE + '\\$' + layoutName + 'Default[\\S\\s]*' + layoutName + "PermissionDenied';", 'g'),
          template: '',
          skip: () => {
            if (layoutType === PROTECTION_TYPE.PUBLIC) return '';
          }
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: STYLE_MAIN_CLASSES_PATH,
          pattern: new RegExp(BREAK_LINE + '\\$' + layoutName + 'Default[\\S\\s]*' + layoutName + "NotFound';", 'g'),
          template: '',
          skip: () => {
            if (layoutType === PROTECTION_TYPE.PRIVATE) return '';
          }
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: `${ROUTER_PATH}/enums.ts`,
          pattern: new RegExp(BREAK_LINE + `  ${rawLayoutName.toUpperCase()} = '${rawLayoutName.toLowerCase()}'`, 'g'),
          template: ''
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: `${ROUTER_PATH}/config.ts`,
          pattern: new RegExp(
            BREAK_LINE + `  ${layoutName}` + '[\\S\\s]*' + `${layoutName}NotFound` + BREAK_LINE + "(} from '@/layouts';)",
            'g'
          ),
          template: BREAK_LINE + '$1',
          skip: () => {
            if (layoutType === PROTECTION_TYPE.PRIVATE) return '';
          }
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: `${ROUTER_PATH}/config.ts`,
          pattern: new RegExp(
            BREAK_LINE + `  ${layoutName}` + '[\\S\\s]*' + `${layoutName}PermissionDenied` + BREAK_LINE + "(} from '@/layouts';)",
            'g'
          ),
          template: BREAK_LINE + '$1',
          skip: () => {
            if (layoutType === PROTECTION_TYPE.PUBLIC) return '';
          }
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: `${ROUTER_PATH}/config.ts`,
          pattern: new RegExp(
            BREAK_LINE +
              '    {' +
              BREAK_LINE +
              '      ' +
              `path: ELayoutPath.${rawLayoutName.toUpperCase()}[\\S\\s]*${layoutName}Error` +
              BREAK_LINE +
              '          }' +
              BREAK_LINE +
              '        }' +
              BREAK_LINE +
              '      ]' +
              BREAK_LINE +
              '    }',
            'g'
          ),
          template: ''
        },
        { type: PLOP_ACTION_TYPE.PRETTIER }
      ];
    }
  });

  plop.setGenerator(PLOP_COMMAND.CREATE_PAGE, {
    description: 'Remove Layout',
    prompts: [
      {
        type: PLOP_PROMPT_TYPE.INPUT,
        name: 'pageName',
        message: 'Page name?'
      },
      {
        type: PLOP_PROMPT_TYPE.LIST,
        name: 'layoutName',
        choices: () => {
          const privateLayouts = getAllDirsInDirectory(`${LAYOUTS_PATH}/private`).map((layout) => `${layout} (private)`);
          const publicLayouts = getAllDirsInDirectory(`${LAYOUTS_PATH}/public`).map((layout) => `${layout} (public)`);
          const layouts = [...privateLayouts, ...publicLayouts].filter((dir) => !dir.includes('.'));
          return layouts;
        },
        message: 'Belong to?',
        when: ({ pageName }) => !!pageName
      },
      {
        type: PLOP_PROMPT_TYPE.LIST,
        name: 'pageType',
        choices: Object.values(PROTECTION_TYPE),
        message: 'Page type?',
        when: ({ pageName, layoutName }) => !!pageName && layoutName.includes(PROTECTION_TYPE.PUBLIC)
      },
      {
        type: PLOP_PROMPT_TYPE.INPUT,
        name: 'rawPagePath',
        message: 'Page path?',
        when: ({ pageName }) => !!pageName
      }
    ],
    actions: (data) => {
      const { pageType, pageName, rawPagePath } = data;
      const correctPageType = pageType || PROTECTION_TYPE.PRIVATE;
      const pageDirPath = `${BASE_PATH.SRC}/pages/{{lowerCase correctPageType}}/{{pascalCase pageName}}`;
      const indexFileInPagesDirPath = `${BASE_PATH.SRC}/pages/{{lowerCase correctPageType}}/index.ts`;

      if (!pageName) throw new Error('Page name should not empty!');

      data.pagePath = rawPagePath.replace('/', '');

      const alreadyExistPaths = readFileAsJSON('./src/router/enums.ts')
        .split('export enum ESpecialPath')[0]
        .match(/'(.*?)'/g)
        .map((w) => w.replace(/'(.*?)'/g, '$1'));

      const pagePathIsAlreadyExist = alreadyExistPaths.includes(data.pagePath);

      if (!rawPagePath) throw new Error('Page path should not empty!');
      if (pagePathIsAlreadyExist) throw new Error('Page path is already exist!');

      return [
        {
          type: PLOP_ACTION_TYPE.ADD_MANY,
          destination: pageDirPath,
          base: TEMPLATE_COMPONENT_PATH,
          templateFiles: `${TEMPLATE_COMPONENT_PATH}/*`,
          data: { correctPageType, componentName: pageName, ...data }
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: STYLE_MAIN_CLASSES_PATH,
          pattern: /(\/\/ \[END\] Pages)/g,
          template: "${{pascalCase pageName}}: '.{{pascalCase pageName}}';" + BREAK_LINE + '$1'
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: indexFileInPagesDirPath,
          pattern: new RegExp('(' + BREAK_LINE + BREAK_LINE + ')', 'g'),
          template: BREAK_LINE + "import {{pascalCase pageName}}, { T{{pascalCase pageName}}Props } from './{{pascalCase pageName}}';$1",
          data: { correctPageType, ...data }
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: indexFileInPagesDirPath,
          pattern: new RegExp('(export )([\\S\\s]*)( };' + BREAK_LINE + 'export type)', 'g'),
          template: '$1$2, {{pascalCase pageName}}$3',
          data: { correctPageType, ...data }
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: indexFileInPagesDirPath,
          pattern: /(export type )([\S\s]*)( };)/g,
          template: '$1$2, T{{pascalCase pageName}}Props$3',
          data: { correctPageType, ...data }
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: `${ROUTER_PATH}/enums.ts`,
          pattern: new RegExp(
            '(export enum EPagePath )([\\S\\s]*)(' + BREAK_LINE + '}' + BREAK_LINE + BREAK_LINE + 'export enum ESpecialPath)',
            'g'
          ),
          template: '$1$2,' + BREAK_LINE + "  {{constantCase pageName}} = '{{lowerCase pagePath}}'" + '$3'
        },
        // TODO: Add to config
      ];
    }
  });
};

export default plopConfig;
