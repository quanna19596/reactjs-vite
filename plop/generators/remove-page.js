import { BREAK_LINE, PATH, PLOP_PROMPT_TYPE, PROTECTION_TYPE } from "../constants.js";
import { getAllDirsInDirectory, readFile } from "../utils.js";

export default (plop) => ({
  description: 'Remove Page',
  prompts: [
    {
      type: PLOP_PROMPT_TYPE.LIST,
      name: 'pageName',
      choices: () => {
        const privatePages = getAllDirsInDirectory(`${PATH.SRC.PAGES}/private`).map((page) => `${page} (private)`);
        const publicPages = getAllDirsInDirectory(`${PATH.SRC.PAGES}/public`).map((page) => `${page} (public)`);
        const pages = [...privatePages, ...publicPages].filter((dir) => !dir.includes('.'));
        return pages;
      },
      message: 'Page name?'
    }
  ],
  actions: ({ pageName }) => {
    const routerConfig = readFile(`${PATH.SRC.ROUTER}/config.ts`);
    const pageProtectionType = pageName.split('(')[1].replace(')', '');
    const regexMark = plop.renderString('path: EPagePath.{{constantCase pageName}}', { pageName });
    const numberLineAfterRegexMark = pageProtectionType === PROTECTION_TYPE.PUBLIC ? 5 : 7;
    const pageConfigRegex = new RegExp(
      `{([${BREAK_LINE}].*?)(.*?(?:${regexMark}).*)(([${BREAK_LINE}]+([^${BREAK_LINE}]+)){${numberLineAfterRegexMark}})`,
      'g'
    );
    const pageObj = routerConfig?.match(pageConfigRegex)?.[0];

    const privateLayouts = getAllDirsInDirectory(`${PATH.SRC.LAYOUTS}/private`).map((layout) => `${layout} (private)`);
    const publicLayouts = getAllDirsInDirectory(`${PATH.SRC.LAYOUTS}/public`).map((layout) => `${layout} (public)`);
    const layouts = [...privateLayouts, ...publicLayouts].filter((dir) => !dir.includes('.'));
    const layout = layouts.find((l) => pageObj?.includes(l));

    return [];
  }
});
