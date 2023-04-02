import rimraf from 'rimraf';
import fs from 'fs';

const COMPONENT_TYPE = { COMPONENTS: 'components', CONTAINERS: 'containers' };
const LAYOUT_TYPE = { PUBLIC: 'public', PRIVATE: 'private' };
const PAGE_TYPE = { PUBLIC: 'public', PRIVATE: 'private', COMMON: 'common' };

const BASE_PATH = { SRC: './src', STORYBOOK: './stories', PLOP_TEMPLATE: './plop-templates' };

const TEMPLATE_COMPONENT_PATH = `${BASE_PATH.PLOP_TEMPLATE}/component`;
const STYLE_MAIN_CLASSES_PATH = `${BASE_PATH.SRC}/styles/main-classes.scss`;
const LAYOUTS_PATH = `${BASE_PATH.SRC}/layouts`;
const ROUTER_PATH = `${BASE_PATH.SRC}/router`;

const BREAK_LINE = process.platform.startsWith('win') ? '\r\n' : '\n';

const plopConfig = (plop) => {
  plop.setHelper('sufCurly', (t) => `${t}}`);

  plop.setActionType('remove', (answers, config, plop) => {
    const { path } = config;
    const correctPath = plop.renderString(path, answers);
    rimraf.sync(correctPath);
  });

  plop.setActionType('removeMany', (answers, config, plop) => {
    const { paths } = config;
    paths.forEach((path) => {
      const correctPath = plop.renderString(path, answers);
      rimraf.sync(correctPath);
    });
  });

  plop.setGenerator('create-component', {
    description: 'Create Component',
    prompts: [
      {
        type: 'list',
        name: 'componentType',
        choices: Object.values(COMPONENT_TYPE),
        message: 'Component type?'
      },
      {
        type: 'input',
        name: 'componentName',
        message: 'Component name?'
      }
    ],
    actions: ({ componentType }) => {
      const componentDirPath = `${BASE_PATH.SRC}/${componentType}/{{pascalCase componentName}}`;
      const storyFilePath = `${BASE_PATH.STORYBOOK}/${componentType}/{{pascalCase componentName}}.stories.tsx`;
      const indexFileInComponentTypeDirPath = `${BASE_PATH.SRC}/${componentType}/index.ts`;

      return [
        {
          type: 'addMany',
          destination: componentDirPath,
          base: TEMPLATE_COMPONENT_PATH,
          templateFiles: `${TEMPLATE_COMPONENT_PATH}/*`
        },
        {
          type: 'modify',
          path: STYLE_MAIN_CLASSES_PATH,
          pattern: /(\/\/ \[END\] Components)/g,
          template: "${{pascalCase componentName}}: '.{{pascalCase componentName}}';" + BREAK_LINE + '$1'
        },
        {
          type: 'modify',
          path: indexFileInComponentTypeDirPath,
          pattern: new RegExp('(' + BREAK_LINE + BREAK_LINE + ')', 'g'),
          template:
            BREAK_LINE +
            "import {{pascalCase componentName}}, { T{{pascalCase componentName}}Props } from './{{pascalCase componentName}}';$1"
        },
        {
          type: 'modify',
          path: indexFileInComponentTypeDirPath,
          pattern: new RegExp('(export )([\\S\\s]*)( };' + BREAK_LINE + 'export type)', 'g'),
          template: '$1$2, {{pascalCase componentName}}$3'
        },
        {
          type: 'modify',
          path: indexFileInComponentTypeDirPath,
          pattern: /(export type )([\S\s]*)( };)/g,
          template: '$1$2, T{{pascalCase componentName}}Props$3'
        },
        {
          type: 'add',
          path: storyFilePath,
          templateFile: `${BASE_PATH.PLOP_TEMPLATE}/storybook.hbs`
        }
      ];
    }
  });

  plop.setGenerator('remove-component', {
    description: 'Remove Component',
    prompts: [
      {
        type: 'list',
        name: 'componentType',
        choices: Object.values(COMPONENT_TYPE),
        message: 'Component type?'
      },
      {
        type: 'input',
        name: 'componentName',
        message: 'Component name?'
      }
    ],
    actions: ({ componentType, componentName }) => {
      const componentDirPath = `${BASE_PATH.SRC}/${componentType}/{{pascalCase componentName}}`;
      const storyFilePath = `${BASE_PATH.STORYBOOK}/${componentType}/{{pascalCase componentName}}.stories.tsx`;
      const indexFileInComponentTypeDirPath = `${BASE_PATH.SRC}/${componentType}/index.ts`;

      const correctComponentName = plop.renderString('{{pascalCase componentName}}', { componentName });
      const templateRenderedStyle = `$${correctComponentName}: '.${correctComponentName}';`;
      const indexFileImportLineTemplate = `import ${correctComponentName}, { T${correctComponentName}Props } from './${correctComponentName}';`;

      return [
        {
          type: 'removeMany',
          paths: [componentDirPath, storyFilePath]
        },
        {
          type: 'modify',
          path: STYLE_MAIN_CLASSES_PATH,
          pattern: new RegExp(BREAK_LINE + `\\${templateRenderedStyle}`, 'g'),
          template: ''
        },
        {
          type: 'modify',
          path: indexFileInComponentTypeDirPath,
          pattern: new RegExp(`(${BREAK_LINE}${indexFileImportLineTemplate})`, 'g'),
          template: ''
        },
        {
          type: 'modify',
          path: indexFileInComponentTypeDirPath,
          pattern: new RegExp(`\\, ${correctComponentName} };`, 'g'),
          template: ' };'
        },
        {
          type: 'modify',
          path: indexFileInComponentTypeDirPath,
          pattern: new RegExp(`, ${correctComponentName}\\,`, 'g'),
          template: ','
        },
        {
          type: 'modify',
          path: indexFileInComponentTypeDirPath,
          pattern: new RegExp(`{ ${correctComponentName}\\,`, 'g'),
          template: '{'
        },
        {
          type: 'modify',
          path: indexFileInComponentTypeDirPath,
          pattern: new RegExp(`\\, T${correctComponentName}Props };`, 'g'),
          template: ' };'
        },
        {
          type: 'modify',
          path: indexFileInComponentTypeDirPath,
          pattern: new RegExp(`, T${correctComponentName}Props\\,`, 'g'),
          template: ','
        },
        {
          type: 'modify',
          path: indexFileInComponentTypeDirPath,
          pattern: new RegExp(`{ T${correctComponentName}Props\\,`, 'g'),
          template: '{'
        }
      ];
    }
  });

  plop.setGenerator('create-layout', {
    description: 'Create Layout',
    prompts: [
      {
        type: 'list',
        name: 'layoutType',
        choices: Object.values(LAYOUT_TYPE),
        message: 'Layout type?'
      },
      {
        type: 'input',
        name: 'rawLayoutName',
        message: 'Layout name?'
      },
      {
        type: 'input',
        name: 'rawLayoutBasePath',
        message: 'Layout base path?',
        when: ({ rawLayoutName }) => !!rawLayoutName
      }
    ],
    actions: (data) => {
      const { layoutType, rawLayoutName, rawLayoutBasePath } = data;

      if (!rawLayoutName) throw new Error('Layout name should not empty!');

      data.layoutBasePath = rawLayoutBasePath.replace('/', '');

      const alreadyExistPaths = JSON.stringify(fs.readFileSync('./src/router/enums.ts', 'utf8').toString())
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
        // {
        //   type: 'addMany',
        //   destination: layoutParts.default.path,
        //   base: TEMPLATE_COMPONENT_PATH,
        //   templateFiles: `${TEMPLATE_COMPONENT_PATH}/*`,
        //   data: { componentName: layoutParts.default.componentName }
        // },
        // {
        //   type: 'addMany',
        //   destination: layoutParts.error.path,
        //   base: TEMPLATE_COMPONENT_PATH,
        //   templateFiles: `${TEMPLATE_COMPONENT_PATH}/*`,
        //   data: { componentName: layoutParts.error.componentName }
        // },
        // {
        //   type: 'addMany',
        //   destination: layoutParts.main.path,
        //   base: TEMPLATE_COMPONENT_PATH,
        //   templateFiles: `${TEMPLATE_COMPONENT_PATH}/*`,
        //   data: { componentName: layoutParts.main.componentName }
        // },
        // {
        //   type: 'addMany',
        //   destination: layoutParts.notFound.path,
        //   base: TEMPLATE_COMPONENT_PATH,
        //   templateFiles: `${TEMPLATE_COMPONENT_PATH}/*`,
        //   data: { componentName: layoutParts.notFound.componentName }
        // },
        // {
        //   type: 'addMany',
        //   destination: layoutParts.permissionDenied.path,
        //   base: TEMPLATE_COMPONENT_PATH,
        //   templateFiles: `${TEMPLATE_COMPONENT_PATH}/*`,
        //   data: { componentName: layoutParts.permissionDenied.componentName }
        // },
        // {
        //   type: 'add',
        //   path: `${layoutDirPath}/index.ts`,
        //   templateFile: `${BASE_PATH.PLOP_TEMPLATE}/layout/index.hbs`,
        //   data: { componentName: data.layoutName }
        // },
        // {
        //   type: 'modify',
        //   path: `${LAYOUTS_PATH}/${layoutType}/index.ts`,
        //   pattern: new RegExp('(' + BREAK_LINE + ')', 'g'),
        //   template: `${BREAK_LINE}export * from './{{pascalCase componentName}}';$1`,
        //   data: { componentName: data.layoutName }
        // },
        // {
        //   type: 'modify',
        //   path: STYLE_MAIN_CLASSES_PATH,
        //   pattern: /(\/\/ \[END\] Layouts)/g,
        //   template:
        //     layoutParts.default.templateInMainClassesFile +
        //     BREAK_LINE +
        //     layoutParts.error.templateInMainClassesFile +
        //     BREAK_LINE +
        //     layoutParts.main.templateInMainClassesFile +
        //     BREAK_LINE +
        //     layoutParts.notFound.templateInMainClassesFile +
        //     BREAK_LINE +
        //     layoutParts.permissionDenied.templateInMainClassesFile +
        //     BREAK_LINE +
        //     '$1'
        // },
        // {
        //   type: 'modify',
        //   path: `${ROUTER_PATH}/enums.ts`,
        //   pattern: new RegExp(
        //     '(export enum ELayoutPath )([\\S\\s]*)(' + BREAK_LINE + '}' + BREAK_LINE + BREAK_LINE + 'export enum EPagePath)',
        //     'g'
        //   ),
        //   template: '$1$2,' + BREAK_LINE + "  {{constantCase rawLayoutName}} = '{{lowerCase layoutBasePath}}'" + '$3'
        // },
        {
          type: 'modify',
          path: `${ROUTER_PATH}/config.ts`,
          pattern: '',
          templateFile: `${BASE_PATH.PLOP_TEMPLATE}/layout/router-config.hbs`,
          data: { rawLayoutName, layoutName: data.layoutName, isPrivate: layoutType === LAYOUT_TYPE.PRIVATE }
        }
      ];
    }
  });
};

export default plopConfig;
