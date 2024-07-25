import { BREAK_LINE, PATH, PLOP_ACTION_TYPE, PLOP_PROMPT_TYPE, PROTECTION_TYPE } from "../constants.js";
import { getAllDirsInDirectory, readFile } from "../utils.js";

export default (plop) => ({
  description: 'Remove Page',
  prompts: [
    {
      type: PLOP_PROMPT_TYPE.LIST,
      name: 'rawPageName',
      choices: () => {
        const privatePages = getAllDirsInDirectory(`${PATH.SRC.PAGES}/private`).map((page) => `${page} (private)`);
        const publicPages = getAllDirsInDirectory(`${PATH.SRC.PAGES}/public`).map((page) => `${page} (public)`);
        const pages = [...privatePages, ...publicPages].filter((dir) => !dir.includes('.'));
        return pages;
      },
      message: 'Page name?'
    }
  ],
  actions: ({ rawPageName }) => {
    const pageName = rawPageName.split(' (')[0];
    const pageProtectionType = rawPageName.split('(')[1].replace(')', '');
  
    const pageDirPath = `${PATH.SRC.PAGES}/${pageProtectionType}/${pageName}`;
  
    const indexFilePathIn = {
      pageTypeDir: `${PATH.SRC.PAGES}/${pageProtectionType}/index.ts`,
      pagesDir: `${PATH.SRC.PAGES}/index.ts`
    }
  
    const templateRenderedIn = {
      styleFile: `$${pageName}: '.${pageName}';`,
      indexFileInPageTypeDir: `import ${pageName}, { T${pageName}Props } from './${pageName}';`,
      indexFileInPagesDir: `export const ${pageName} = lazy\\(\\(\\) => retryLoadComponent\\(\\(\\) => import\\('@/pages/${pageProtectionType}/${pageName}'\\)\\)\\);`
    }

    return [
      {
        type: PLOP_ACTION_TYPE.REMOVE,
        path: pageDirPath
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: PATH.SRC.STYLES.MAIN_CLASSES,
        pattern: new RegExp(BREAK_LINE + `\\${templateRenderedIn.styleFile}`, 'g'),
        template: ''
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: indexFilePathIn.pagesDir,
        pattern: new RegExp(BREAK_LINE + templateRenderedIn.indexFileInPagesDir, 'g'),
        template: ''
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: PATH.SRC.ROUTER.PATHS,
        pattern: new RegExp(plop.renderString('{{constantCase pageName}}.*', { pageName }), 'g'),
        template: ''
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: PATH.SRC.ROUTER.CONFIG,
        pattern: new RegExp(plop.renderString(',' + BREAK_LINE + '        {' + BREAK_LINE + `          path: PATHS.PAGE.{{constantCase pageName}}\\(\\),` + BREAK_LINE + '          element: {' + BREAK_LINE + '            component: {{pascalCase pageName}},' + BREAK_LINE + `            isPrivate: ${pageProtectionType === PROTECTION_TYPE.PRIVATE},` + BREAK_LINE + '            fallbackPermissionDenied: DashboardLayoutPermissionDenied,' + BREAK_LINE + '            errorComponent: DashboardLayoutError' + BREAK_LINE + '          }' + BREAK_LINE + '        }'), 'g'),
        template: ''
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: PATH.SRC.ROUTER.CONFIG,
        pattern: new RegExp(`, ${pageName}`, 'g'),
        template: ''
      },
      { type: PLOP_ACTION_TYPE.PRETTIER }
    ];
  }
});
