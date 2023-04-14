import { BREAK_LINE, PATH, PLOP_ACTION_TYPE, PLOP_PROMPT_TYPE, PROTECTION_TYPE } from '../constants.js';
import { readFile } from '../utils.js';

export default (plop) => ({
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

    const alreadyExistPaths = readFile(`${PATH.SRC.ROUTER}/enums.ts`)
      ?.split('export enum EPagePath')[0]
      ?.match(/'(.*?)'/g)
      ?.map((w) => w.replace(/'(.*?)'/g, '$1'));

    const layoutBasePathIsAlreadyExist = alreadyExistPaths?.includes(data.layoutBasePath);

    if (!rawLayoutBasePath) throw new Error('Layout base path should not empty!');
    if (layoutBasePathIsAlreadyExist) throw new Error('Layout base path is already exist!');

    data.layoutName = `${rawLayoutName}Layout`;
    const layoutDirPath = plop.renderString(`${PATH.SRC.LAYOUTS}/${layoutType}/{{pascalCase layoutName}}`, {
      layoutName: data.layoutName
    });
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
        base: PATH.PLOP.TEMPLATES.COMPONENT,
        templateFiles: `${PATH.PLOP.TEMPLATES.COMPONENT}/*`,
        data: { componentName: layoutParts.default.componentName }
      },
      {
        type: PLOP_ACTION_TYPE.ADD_MANY,
        destination: layoutParts.error.path,
        base: PATH.PLOP.TEMPLATES.COMPONENT,
        templateFiles: `${PATH.PLOP.TEMPLATES.COMPONENT}/*`,
        data: { componentName: layoutParts.error.componentName }
      },
      {
        type: PLOP_ACTION_TYPE.ADD_MANY,
        destination: layoutParts.main.path,
        base: PATH.PLOP.TEMPLATES.LAYOUT.MAIN_COMPONENT,
        templateFiles: `${PATH.PLOP.TEMPLATES.LAYOUT.MAIN_COMPONENT}/*`,
        data: { componentName: layoutParts.main.componentName }
      },
      {
        type: PLOP_ACTION_TYPE.ADD_MANY,
        destination: layoutParts.notFound.path,
        base: PATH.PLOP.TEMPLATES.COMPONENT,
        templateFiles: `${PATH.PLOP.TEMPLATES.COMPONENT}/*`,
        data: { componentName: layoutParts.notFound.componentName }
      },
      {
        type: PLOP_ACTION_TYPE.ADD_MANY,
        destination: layoutParts.permissionDenied.path,
        base: PATH.PLOP.TEMPLATES.COMPONENT,
        templateFiles: `${PATH.PLOP.TEMPLATES.COMPONENT}/*`,
        data: { componentName: layoutParts.permissionDenied.componentName },
        skip: () => {
          if (layoutType === PROTECTION_TYPE.PUBLIC) return '';
        }
      },
      {
        type: PLOP_ACTION_TYPE.ADD,
        path: `${layoutDirPath}/index.ts`,
        templateFile: `${PATH.PLOP.TEMPLATES.self}/layout/private/index.hbs`,
        data: { componentName: data.layoutName },
        skip: () => {
          if (layoutType === PROTECTION_TYPE.PUBLIC) return '';
        }
      },
      {
        type: PLOP_ACTION_TYPE.ADD,
        path: `${layoutDirPath}/index.ts`,
        templateFile: `${PATH.PLOP.TEMPLATES.self}/layout/public/index.hbs`,
        data: { componentName: data.layoutName },
        skip: () => {
          if (layoutType === PROTECTION_TYPE.PRIVATE) return '';
        }
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: `${PATH.SRC.LAYOUTS}/${layoutType}/index.ts`,
        pattern: new RegExp('(' + BREAK_LINE + ')', 'g'),
        template: `${BREAK_LINE}export * from './{{pascalCase componentName}}';$1`,
        data: { componentName: data.layoutName }
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: PATH.SRC.STYLES.MAIN_CLASSES,
        pattern: /(\/\/ \[END\] Layouts)/g,
        template: `${layoutParts.default.templateInMainClassesFile};${layoutParts.error.templateInMainClassesFile};${layoutParts.main.templateInMainClassesFile};${layoutParts.notFound.templateInMainClassesFile};${layoutParts.permissionDenied.templateInMainClassesFile}${BREAK_LINE}$1`,
        skip: () => {
          if (layoutType === PROTECTION_TYPE.PUBLIC) return '';
        }
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: PATH.SRC.STYLES.MAIN_CLASSES,
        pattern: /(\/\/ \[END\] Layouts)/g,
        template: `${layoutParts.default.templateInMainClassesFile};${layoutParts.error.templateInMainClassesFile};${layoutParts.main.templateInMainClassesFile};${layoutParts.notFound.templateInMainClassesFile}${BREAK_LINE}$1`,
        skip: () => {
          if (layoutType === PROTECTION_TYPE.PRIVATE) return '';
        }
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: `${PATH.SRC.ROUTER}/enums.ts`,
        pattern: /(ELayoutPath[\S\s]*)(}[\S\s]*EPagePath)/g,
        template: "$1,{{constantCase rawLayoutName}} = '{{dashCase layoutBasePath}}'$2"
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: `${PATH.SRC.ROUTER}/config.ts`,
        pattern: /(import[\S\s]*)(} from '@\/layouts')/g,
        template: `$1,${layoutParts.main.componentName},${layoutParts.default.componentName},${layoutParts.error.componentName},${layoutParts.notFound.componentName}$2`,
        skip: () => {
          if (layoutType === PROTECTION_TYPE.PRIVATE) return '';
        }
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: `${PATH.SRC.ROUTER}/config.ts`,
        pattern: /(import[\S\s]*)(} from '@\/layouts')/g,
        template: `$1,${layoutParts.main.componentName},${layoutParts.default.componentName},${layoutParts.error.componentName},${layoutParts.notFound.componentName},${layoutParts.permissionDenied.componentName}$2`,
        skip: () => {
          if (layoutType === PROTECTION_TYPE.PUBLIC) return '';
        }
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: `${PATH.SRC.ROUTER}/config.ts`,
        pattern: new RegExp('(routes[\\S\\s]*)(]' + BREAK_LINE + '};)', 'g'),
        templateFile: `${PATH.PLOP.TEMPLATES.self}/layout/private/router-config.hbs`,
        data: { rawLayoutName, layoutName: data.layoutName },
        skip: () => {
          if (layoutType === PROTECTION_TYPE.PUBLIC) return '';
        }
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: `${PATH.SRC.ROUTER}/config.ts`,
        pattern: new RegExp('(routes[\\S\\s]*)(]' + BREAK_LINE + '};)', 'g'),
        templateFile: `${PATH.PLOP.TEMPLATES.self}/layout/public/router-config.hbs`,
        data: { rawLayoutName, layoutName: data.layoutName },
        skip: () => {
          if (layoutType === PROTECTION_TYPE.PRIVATE) return '';
        }
      },
      { type: PLOP_ACTION_TYPE.PRETTIER }
    ];
  }
});
