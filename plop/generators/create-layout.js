import { BREAK_LINE, PATH, PLOP_ACTION_TYPE, PLOP_PROMPT_TYPE, PROTECTION_TYPE } from '../constants.js';
import { readFile } from '../utils.js';

export default (plop) => ({
  description: 'Create Layout',
  prompts: [
    {
      type: PLOP_PROMPT_TYPE.INPUT,
      name: 'rawLayoutName',
      message: 'Layout name?'
    },
    {
      type: PLOP_PROMPT_TYPE.INPUT,
      name: 'rawLayoutBasePath',
      message: 'Layout base path?',
    },
    {
      type: PLOP_PROMPT_TYPE.LIST,
      name: 'layoutType',
      choices: Object.values(PROTECTION_TYPE),
      message: 'Layout type?'
    },
  ],
  actions: (data) => {
    data.rawLayoutName = data.rawLayoutName.replace(/layout/gi, '')
    const { layoutType, rawLayoutName, rawLayoutBasePath } = data;

    data.layoutBasePath = rawLayoutBasePath[0] === '/' ? rawLayoutBasePath.replace('/', '') : rawLayoutBasePath;
    data.layoutName = `${rawLayoutName}Layout`;
    const layoutDirPath = plop.renderString(`${PATH.SRC.LAYOUTS._self}/${layoutType}/{{pascalCase layoutName}}`, {
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
      },
      {
        type: PLOP_ACTION_TYPE.ADD,
        path: `${layoutDirPath}/index.ts`,
        templateFile: `${PATH.PLOP.TEMPLATES._self}/layout/index.hbs`,
        data: { componentName: data.layoutName },
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: PATH.SRC.STYLES.MAIN_CLASSES,
        pattern: /(\/\/ \[END\] Layouts)/g,
        template: `${layoutParts.default.templateInMainClassesFile};${layoutParts.error.templateInMainClassesFile};${layoutParts.main.templateInMainClassesFile};${layoutParts.notFound.templateInMainClassesFile};${layoutParts.permissionDenied.templateInMainClassesFile}${BREAK_LINE}$1`,
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: PATH.SRC.ROUTER.PATHS,
        pattern: /(LAYOUT[\S\s]*)(},[\S\s]*PAGE)/g,
        template: `$1,{{constantCase rawLayoutName}}: (): string => '/{{dashCase layoutBasePath}}'$2`
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: PATH.SRC.ROUTER.CONFIG,
        pattern: /([\S\s]*)/g,
        template: `import { ${layoutParts.main.componentName},${layoutParts.default.componentName},${layoutParts.error.componentName},${layoutParts.notFound.componentName},${layoutParts.permissionDenied.componentName} } from '@/layouts/{{layoutType}}/{{pascalCase layoutName}}';$1`,
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: PATH.SRC.ROUTER.CONFIG,
        pattern: new RegExp('([\\S\\s]*)(routes: \\[)', 'g'),
        templateFile: `${PATH.PLOP.TEMPLATES._self}/layout/{{layoutType}}/router-config.hbs`,
        data: { rawLayoutName, layoutName: data.layoutName },
      },
      { type: PLOP_ACTION_TYPE.PRETTIER }
    ];
  }
});
