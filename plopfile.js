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
          template: "import {{pascalCase componentName}}, { T{{pascalCase componentName}}Props } from './{{pascalCase componentName}}';$1"
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: indexFileInComponentTypeDirPath,
          pattern: new RegExp('(export[\\S\\s]*)( };' + BREAK_LINE + 'export type)', 'g'),
          template: '$1,{{pascalCase componentName}}$2'
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: indexFileInComponentTypeDirPath,
          pattern: /(export type[\S\s]*)( };)/g,
          template: '$1,T{{pascalCase componentName}}Props$2'
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
        name: 'rawComponentName',
        choices: () => {
          const unitComponents = getAllDirsInDirectory(`${BASE_PATH.SRC}/components`).map((comp) => `${comp} (components)`);
          const containerComponents = getAllDirsInDirectory(`${BASE_PATH.SRC}/containers`).map((comp) => `${comp} (containers)`);
          const components = [...unitComponents, ...containerComponents].filter((comp) => !comp.includes('.'));
          return components;
        },
        message: 'Component name?'
      }
    ],
    actions: ({ rawComponentName }) => {
      const componentName = rawComponentName.split(' (')[0];
      const componentType = rawComponentName.split('(')[1].replace(')', '');
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
          componentName: plop.renderString('{{pascalCase layoutName}}Default', { layoutName: data.layoutName }),
          templateInMainClassesFile: plop.renderString("${{pascalCase componentName}}: '.{{pascalCase componentName}}';", {
            componentName: `${data.layoutName}Default`
          })
        },
        error: {
          path: `${layoutDirPath}/error`,
          componentName: plop.renderString('{{pascalCase layoutName}}Error', { layoutName: data.layoutName }),
          templateInMainClassesFile: plop.renderString("${{pascalCase componentName}}: '.{{pascalCase componentName}}';", {
            componentName: `${data.layoutName}Error`
          })
        },
        main: {
          path: `${layoutDirPath}/main`,
          componentName: plop.renderString('{{pascalCase layoutName}}', { layoutName: data.layoutName }),
          templateInMainClassesFile: plop.renderString("${{pascalCase componentName}}: '.{{pascalCase componentName}}';", {
            componentName: data.layoutName
          })
        },
        notFound: {
          path: `${layoutDirPath}/not-found`,
          componentName: plop.renderString('{{pascalCase layoutName}}NotFound', { layoutName: data.layoutName }),
          templateInMainClassesFile: plop.renderString("${{pascalCase componentName}}: '.{{pascalCase componentName}}';", {
            componentName: `${data.layoutName}NotFound`
          })
        },
        permissionDenied: {
          path: `${layoutDirPath}/permission-denied`,
          componentName: plop.renderString('{{pascalCase layoutName}}PermissionDenied', { layoutName: data.layoutName }),
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
          template: `${layoutParts.default.templateInMainClassesFile};${layoutParts.error.templateInMainClassesFile};${layoutParts.main.templateInMainClassesFile};${layoutParts.notFound.templateInMainClassesFile};${layoutParts.permissionDenied.templateInMainClassesFile}${BREAK_LINE}$1`,
          skip: () => {
            if (layoutType === PROTECTION_TYPE.PUBLIC) return '';
          }
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: STYLE_MAIN_CLASSES_PATH,
          pattern: /(\/\/ \[END\] Layouts)/g,
          template: `${layoutParts.default.templateInMainClassesFile};${layoutParts.error.templateInMainClassesFile};${layoutParts.main.templateInMainClassesFile};${layoutParts.notFound.templateInMainClassesFile}${BREAK_LINE}$1`,
          skip: () => {
            if (layoutType === PROTECTION_TYPE.PRIVATE) return '';
          }
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: `${ROUTER_PATH}/enums.ts`,
          pattern: /(ELayoutPath[\S\s]*)(}[\S\s]*EPagePath)/g,
          template: "$1,{{constantCase rawLayoutName}} = '{{dashCase layoutBasePath}}'$2"
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: `${ROUTER_PATH}/config.ts`,
          pattern: /(import[\S\s]*)(} from '@\/layouts')/g,
          template: `$1,${layoutParts.main.componentName},${layoutParts.default.componentName},${layoutParts.error.componentName},${layoutParts.notFound.componentName}$2`,
          skip: () => {
            if (layoutType === PROTECTION_TYPE.PRIVATE) return '';
          }
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: `${ROUTER_PATH}/config.ts`,
          pattern: /(import[\S\s]*)(} from '@\/layouts')/g,
          template: `$1,${layoutParts.main.componentName},${layoutParts.default.componentName},${layoutParts.error.componentName},${layoutParts.notFound.componentName},${layoutParts.permissionDenied.componentName}$2`,
          skip: () => {
            if (layoutType === PROTECTION_TYPE.PUBLIC) return '';
          }
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: `${ROUTER_PATH}/config.ts`,
          pattern: new RegExp('(routes[\\S\\s]*)(]' + BREAK_LINE + '};)', 'g'),
          templateFile: `${BASE_PATH.PLOP_TEMPLATE}/layout/private/router-config.hbs`,
          data: { rawLayoutName, layoutName: data.layoutName },
          skip: () => {
            if (layoutType === PROTECTION_TYPE.PUBLIC) return '';
          }
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: `${ROUTER_PATH}/config.ts`,
          pattern: new RegExp('(routes[\\S\\s]*)(]' + BREAK_LINE + '};)', 'g'),
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
        name: 'layoutNameWithType',
        choices: () => {
          const privateLayouts = getAllDirsInDirectory(`${LAYOUTS_PATH}/private`).map((layout) => `${layout} (private)`);
          const publicLayouts = getAllDirsInDirectory(`${LAYOUTS_PATH}/public`).map((layout) => `${layout} (public)`);
          const layouts = [...privateLayouts, ...publicLayouts].filter((dir) => !dir.includes('.'));
          return layouts;
        },
        message: 'Layout name?'
      }
    ],
    actions: ({ layoutNameWithType }) => {
      const layoutName = layoutNameWithType.split(' (')[0];
      const layoutType = layoutNameWithType.split('(')[1].replace(')', '');
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
          pattern: new RegExp(
            BREAK_LINE + plop.renderString("  {{constantCase rawLayoutName}} = '{{dashCase rawLayoutName}}',", { rawLayoutName }),
            'g'
          ),
          template: ''
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: `${ROUTER_PATH}/enums.ts`,
          pattern: new RegExp(
            BREAK_LINE + plop.renderString("  {{constantCase rawLayoutName}} = '{{dashCase rawLayoutName}}'", { rawLayoutName }),
            'g'
          ),
          template: ''
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: `${ROUTER_PATH}/config.ts`,
          pattern: new RegExp(`${layoutName}[\\S\\s]*${layoutName}NotFound,([\\S\\s]*} from '@/layouts')`, 'g'),
          template: '$1',
          skip: () => {
            if (layoutType === PROTECTION_TYPE.PRIVATE) return '';
          }
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: `${ROUTER_PATH}/config.ts`,
          pattern: new RegExp(`${layoutName}[\\S\\s]*${layoutName}NotFound([\\S\\s]*} from '@/layouts')`, 'g'),
          template: '$1',
          skip: () => {
            if (layoutType === PROTECTION_TYPE.PRIVATE) return '';
          }
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: `${ROUTER_PATH}/config.ts`,
          pattern: new RegExp(`${layoutName}[\\S\\s]*${layoutName}PermissionDenied,([\\S\\s]*} from '@/layouts')`, 'g'),
          template: '$1',
          skip: () => {
            if (layoutType === PROTECTION_TYPE.PUBLIC) return '';
          }
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: `${ROUTER_PATH}/config.ts`,
          pattern: new RegExp(`${layoutName}[\\S\\s]*${layoutName}PermissionDenied([\\S\\s]*} from '@/layouts')`, 'g'),
          template: '$1',
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
              plop.renderString('path: ELayoutPath.{{constantCase rawLayoutName}}[\\S\\s]*{{layoutName}}Error', {
                rawLayoutName,
                layoutName
              }) +
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
    description: 'Create Page',
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
      const { pageType, layoutName, pageName, rawPagePath } = data;
      const correctPageType = pageType || PROTECTION_TYPE.PRIVATE;
      const pageDirPath = `${BASE_PATH.SRC}/pages/{{lowerCase correctPageType}}/{{pascalCase pageName}}`;
      const indexFileInPagesDirPath = `${BASE_PATH.SRC}/pages/{{lowerCase correctPageType}}/index.ts`;

      if (!pageName) throw new Error('Page name should not empty!');

      data.pagePath = rawPagePath.replace('/', '');
      data.layoutNameWithoutSuffix = layoutName.replace(/Layout[\S\s]*\)/g, '');

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
          template: "import {{pascalCase pageName}}, { T{{pascalCase pageName}}Props } from './{{pascalCase pageName}}';$1",
          data: { correctPageType, ...data }
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: indexFileInPagesDirPath,
          pattern: new RegExp('(export[\\S\\s]*)( };' + BREAK_LINE + 'export type)', 'g'),
          template: '$1,{{pascalCase pageName}}$2',
          data: { correctPageType, ...data }
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: indexFileInPagesDirPath,
          pattern: /(export type[\S\s]*)( };)/g,
          template: '$1,T{{pascalCase pageName}}Props$2',
          data: { correctPageType, ...data }
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: `${ROUTER_PATH}/enums.ts`,
          pattern: /(EPagePath[\S\s]*)(}[\S\s]*ESpecialPath)/g,
          template: "$1,{{constantCase pageName}} = '{{dashCase pagePath}}'$2"
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: `${ROUTER_PATH}/config.ts`,
          pattern: /(import [\S\s]*)(} from '@\/router')/g,
          template: '$1,{{pascalCase pageName}}$2'
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: `${ROUTER_PATH}/config.ts`,
          pattern: new RegExp(
            plop.renderString(
              '(path: ELayoutPath.{{constantCase layoutNameWithoutSuffix}}[\\S\\s]*},)([\\S\\s]*{{pascalCase layoutNameWithoutSuffix}}LayoutNotFound)',
              {
                layoutNameWithoutSuffix: data.layoutNameWithoutSuffix
              }
            ),
            'g'
          ),
          templateFile: `${BASE_PATH.PLOP_TEMPLATE}/page/private/router-config.hbs`,
          data: { layoutNameWithoutType: `${data.layoutNameWithoutSuffix}Layout` },
          skip: () => {
            if (correctPageType === PROTECTION_TYPE.PUBLIC) return '';
          }
        },
        {
          type: PLOP_ACTION_TYPE.MODIFY,
          path: `${ROUTER_PATH}/config.ts`,
          pattern: new RegExp(
            plop.renderString(
              '(path: ELayoutPath.{{constantCase layoutNameWithoutSuffix}}[\\S\\s]*},)([\\S\\s]*{{pascalCase layoutNameWithoutSuffix}}LayoutNotFound)',
              {
                layoutNameWithoutSuffix: data.layoutNameWithoutSuffix
              }
            ),
            'g'
          ),
          templateFile: `${BASE_PATH.PLOP_TEMPLATE}/page/public/router-config.hbs`,
          data: { layoutNameWithoutType: `${data.layoutNameWithoutSuffix}Layout` },
          skip: () => {
            if (correctPageType === PROTECTION_TYPE.PRIVATE) return '';
          }
        },
        { type: PLOP_ACTION_TYPE.PRETTIER }
      ];
    }
  });

  plop.setGenerator(PLOP_COMMAND.REMOVE_PAGE, {
    description: 'Remove Page',
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
    actions: (data) => []
  });
};

export default plopConfig;
