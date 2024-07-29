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

    const privateLayouts = getAllDirsInDirectory(PATH.SRC.LAYOUTS.PRIVATE);
    const publicLayouts = getAllDirsInDirectory(PATH.SRC.LAYOUTS.PUBLIC);
    const layouts = [...privateLayouts, ...publicLayouts];
  
    const pageDirPath = `${PATH.SRC.PAGES}/${pageProtectionType}/${pageName}`;
    const indexFilePathPage = `${PATH.SRC.PAGES}/index.ts`;
  
    const templateRenderedIn = {
      styleFile: `$${pageName}: '.${pageName}';`,
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
        path: indexFilePathPage,
        pattern: new RegExp(BREAK_LINE + templateRenderedIn.indexFileInPagesDir, 'g'),
        template: ''
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: PATH.SRC.ROUTER.PATHS,
        pattern: new RegExp(plop.renderString('{{constantCase pageName}}.*', { pageName }), 'g'),
        template: ''
      },
      ...layouts.map((layout) => {
        const isPrivate = pageProtectionType === PROTECTION_TYPE.PRIVATE;
        const constantPageName = plop.renderString('{{constantCase pageName}}', { pageName });
        const pascalPageName = plop.renderString('{{pascalCase pageName}}', { pageName });
        const privatePattern = BREAK_LINE + '        {' + BREAK_LINE + `          path: PATHS.PAGE.${constantPageName}[\\S\\s]*${pascalPageName},` + BREAK_LINE + '            isPrivate: true,' + BREAK_LINE + `            fallbackPermissionDenied: ${layout}PermissionDenied,` + BREAK_LINE + `            errorComponent: ${layout}Error` + BREAK_LINE + '          }' + BREAK_LINE + '        },';
        const publicPattern = BREAK_LINE + '        {' + BREAK_LINE + `          path: PATHS.PAGE.${constantPageName}[\\S\\s]*${pascalPageName},` + BREAK_LINE + `            errorComponent: ${layout}Error` + BREAK_LINE + '          }' + BREAK_LINE + '        },';
        return ({
          type: PLOP_ACTION_TYPE.MODIFY,
          path: PATH.SRC.ROUTER.CONFIG,
          pattern: new RegExp(isPrivate ? privatePattern : publicPattern, 'g'),
          template: ''
        })
      }),
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
