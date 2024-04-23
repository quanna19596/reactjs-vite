import { BREAK_LINE, PATH, PLOP_ACTION_TYPE, PLOP_PROMPT_TYPE, PROTECTION_TYPE } from "../constants.js";
import { getAllDirsInDirectory, readFile, capitalize, regex } from "../utils.js";

export default (plop) => ({
  description: 'Create Page',
  prompts: [
    {
      type: PLOP_PROMPT_TYPE.INPUT,
      name: 'pageName',
      message: 'Page name?'
    },
    {
      type: PLOP_PROMPT_TYPE.INPUT,
      name: 'rawPagePath',
      message: 'Page path? (Ex: /user/:userId)',
    },
    {
      type: PLOP_PROMPT_TYPE.LIST,
      name: 'layoutName',
      choices: () => {
        const privateLayouts = getAllDirsInDirectory(PATH.SRC.LAYOUTS.PRIVATE).map((layout) => `${layout} (private)`);
        const publicLayouts = getAllDirsInDirectory(PATH.SRC.LAYOUTS.PUBLIC).map((layout) => `${layout} (public)`);
        const layouts = [...privateLayouts, ...publicLayouts];
        return layouts;
      },
      message: 'Belong to?',
    },
    {
      type: PLOP_PROMPT_TYPE.LIST,
      name: 'pageType',
      choices: Object.values(PROTECTION_TYPE),
      message: 'Page type?',
    },
  ],
  actions: (data) => {
    const { pageType, layoutName, pageName, rawPagePath } = data;
    const pageDirPath = `${PATH.SRC.PAGES}/${pageType}/{{pascalCase pageName}}`;

    data.pagePath = rawPagePath[0] === '/' ? rawPagePath.replace('/', '') : rawPagePath;
    data.layoutNameWithoutSuffix = layoutName.replace(/Layout[\S\s]*\)/g, '');

    const pathRg = /\:(.[a-zA-Z]*)/g;
    const params = data.pagePath.match(pathRg);
    const pathNameHasParams = data.pagePath.includes(':')
    const beautifiedPath = pathNameHasParams ? params.map((param, paramIdx) => {
      const paramName = param.replace(':', '')
      const previousParam = paramIdx > 0 ? params[paramIdx - 1] : ''
      const paramRg = new RegExp(previousParam + '(.*)' + param, 'g')
      return data.pagePath.match(paramRg)[0].replace(paramRg, `$1${'$'}{params?.${paramName} || ':${paramName}'}`).replace(previousParam,'');
    }).join('') : data.pagePath;

    return [
      {
        type: PLOP_ACTION_TYPE.ADD_MANY,
        destination: pageDirPath,
        base: PATH.PLOP.TEMPLATES.COMPONENT,
        templateFiles: `${PATH.PLOP.TEMPLATES.COMPONENT}/*`,
        data: { componentName: pageName, ...data }
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: PATH.SRC.STYLES.MAIN_CLASSES,
        pattern: /(\/\/ \[END\] Pages)/g,
        template: "${{pascalCase pageName}}: '.{{pascalCase pageName}}';$1"
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: PATH.SRC.ROUTER.PATHS,
        pattern: /(PAGE[\S\s]*)(},[\S\s]*SPECIAL)/g,
        template: `$1,{{constantCase pageName}}: (${data.pagePath.includes(':') ? 'params?: TPathParams' : ''}): string => ${'`'}${`/${beautifiedPath}`}${'`'}$2`,
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: PATH.SRC.ROUTER.CONFIG,
        pattern: /(const routerConfig: TRouteConfig)/g,
        template: 'import {{pascalCase pageName}} from @/pages/{{pageType}}/{{pascalCase pageName}};$1'
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: PATH.SRC.ROUTER.CONFIG,
        pattern: new RegExp('({' + BREAK_LINE +  `          path: PATHS.SPECIAL.REST())([\\S\\s]*)(${layoutName}NotFound)`, 'g'),
        templateFile: `${PATH.PLOP.TEMPLATES._self}/page/${pageType}/router-config.hbs`,
        data: { layoutNameWithoutType: `${data.layoutNameWithoutSuffix}Layout` },
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: `${PATH.SRC.PAGES}/index.ts`,
        pattern: new RegExp('(// \\[END\\] ' + capitalize(pageType) + ')', 'g'),
        template: "export const {{pascalCase pageName}} = lazy(() => retryLoadComponent(() => import('@/pages/{{pageType}}/{{pascalCase pageName}}')));$1",
        data: { pageType }
      },
      { type: PLOP_ACTION_TYPE.PRETTIER }
    ];
  }
});
