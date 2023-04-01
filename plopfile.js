import rimraf from 'rimraf';

const COMPONENT_TYPE = { COMPONENTS: 'components', CONTAINERS: 'containers' };
const LAYOUT_TYPE = { PUBLIC: 'public', PRIVATE: 'private' };
const PAGE_TYPE = { PUBLIC: 'public', PRIVATE: 'private', COMMON: 'common' };

const BASE_PATH = { SRC: './src', STORYBOOK: './stories', PLOP_TEMPLATE: './plop-templates' };

const TEMPLATE_COMPONENT_PATH = `${BASE_PATH.PLOP_TEMPLATE}/component`;
const STYLE_MAIN_CLASSES_PATH = `${BASE_PATH.SRC}/styles/main-classes.scss`;
const LAYOUTS_PATH = `${BASE_PATH.SRC}/layouts`;
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
          template: "${{pascalCase componentName}}: '.{{pascalCase componentName}}';" + BREAK_LINE + "$1"
        },
        {
          type: 'modify',
          path: indexFileInComponentTypeDirPath,
          pattern: new RegExp(BREAK_LINE + BREAK_LINE, 'g'),
          template: BREAK_LINE + "import {{pascalCase componentName}}, { T{{pascalCase componentName}}Props } from './{{pascalCase componentName}}';$1"
        },
        {
          type: 'modify',
          path: indexFileInComponentTypeDirPath,
          pattern: / };([\S\s])/g,
          template: ', {{pascalCase componentName}} };'
        },
        {
          type: 'modify',
          path: indexFileInComponentTypeDirPath,
          pattern: /s };([\S\s])/g,
          template: 's, T{{pascalCase componentName}}Props };$1'
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
        name: 'layoutName',
        message: 'Layout name?'
      }
    ],
    actions: (data) => {
      const { layoutType, layoutName } = data;
      data.layoutName = `${layoutName}Layout`;
      const layoutDirPath = `${LAYOUTS_PATH}/${layoutType}/{{pascalCase layoutName}}`;
      const layoutPaths = {
        default: `${layoutDirPath}/default`,
        error: `${layoutDirPath}/error`,
        main: `${layoutDirPath}/main`,
        notFound: `${layoutDirPath}/not-found`,
        permissionDenied: `${layoutDirPath}/permission-denied`
      };
      // console.log(layoutPaths.default);
      console.log(plop.renderString('{{pascalCase layoutName}}Default', { layoutName }));
      return [
        {
          type: 'addMany',
          destination: layoutPaths.default,
          base: TEMPLATE_COMPONENT_PATH,
          templateFiles: `${TEMPLATE_COMPONENT_PATH}/*`,
          verbose: () => {
            console.log(plop.renderString('{{pascalCase layoutName}}Default', { layoutName }));
            data.componentName = plop.renderString('{{pascalCase layoutName}}Default', { layoutName });
          }
        }
        // {
        //   type: 'addMany',
        //   destination: layoutPaths.error,
        //   base: TEMPLATE_COMPONENT_PATH,
        //   templateFiles: `${TEMPLATE_COMPONENT_PATH}/*`
        // }
      ];
    }
  });
};

export default plopConfig;
