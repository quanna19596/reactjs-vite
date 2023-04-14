import { BREAK_LINE, PATH, PLOP_ACTION_TYPE, PLOP_PROMPT_TYPE, PROTECTION_TYPE } from "../constants.js";
import { getAllDirsInDirectory, readFile, capitalize } from "../utils.js";

export default (plop) => ({
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
        const privateLayouts = getAllDirsInDirectory(`${PATH.SRC.LAYOUTS}/private`).map((layout) => `${layout} (private)`);
        const publicLayouts = getAllDirsInDirectory(`${PATH.SRC.LAYOUTS}/public`).map((layout) => `${layout} (public)`);
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
    const pageDirPath = `${PATH.SRC.PAGES}/{{lowerCase correctPageType}}/{{pascalCase pageName}}`;
    const indexFileInPagesDirPath = `${PATH.SRC.PAGES}/{{lowerCase correctPageType}}/index.ts`;

    if (!pageName) throw new Error('Page name should not empty!');

    data.pagePath = rawPagePath.replace('/', '');
    data.layoutNameWithoutSuffix = layoutName.replace(/Layout[\S\s]*\)/g, '');

    const alreadyExistPaths = readFile(`${PATH.SRC.ROUTER}/enums.ts`)
      ?.split('export enum ESpecialPath')[0]
      ?.match(/'(.*?)'/g)
      ?.map((w) => w.replace(/'(.*?)'/g, '$1'));

    const pagePathIsAlreadyExist = alreadyExistPaths?.includes(data.pagePath);

    if (!rawPagePath) throw new Error('Page path should not empty!');
    if (pagePathIsAlreadyExist) throw new Error('Page path is already exist!');

    return [
      {
        type: PLOP_ACTION_TYPE.ADD_MANY,
        destination: pageDirPath,
        base: PATH.PLOP.TEMPLATES.COMPONENT,
        templateFiles: `${PATH.PLOP.TEMPLATES.COMPONENT}/*`,
        data: { correctPageType, componentName: pageName, ...data }
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: PATH.SRC.STYLES.MAIN_CLASSES,
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
        path: `${PATH.SRC.ROUTER}/enums.ts`,
        pattern: /(EPagePath[\S\s]*)(}[\S\s]*ESpecialPath)/g,
        template: "$1,{{constantCase pageName}} = '{{dashCase pagePath}}'$2"
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: `${PATH.SRC.ROUTER}/config.ts`,
        pattern: /(import [\S\s]*)(} from '@\/router')/g,
        template: '$1,{{pascalCase pageName}}$2'
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: `${PATH.SRC.ROUTER}/config.ts`,
        pattern: new RegExp(
          plop.renderString(
            '(path: ELayoutPath.{{constantCase layoutNameWithoutSuffix}}[\\S\\s]*},)([\\S\\s]*{{pascalCase layoutNameWithoutSuffix}}LayoutNotFound)',
            {
              layoutNameWithoutSuffix: data.layoutNameWithoutSuffix
            }
          ),
          'g'
        ),
        templateFile: `${PATH.PLOP.TEMPLATES.self}/page/private/router-config.hbs`,
        data: { layoutNameWithoutType: `${data.layoutNameWithoutSuffix}Layout` },
        skip: () => {
          if (correctPageType === PROTECTION_TYPE.PUBLIC) return '';
        }
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: `${PATH.SRC.ROUTER}/config.ts`,
        pattern: new RegExp(
          plop.renderString(
            '(path: ELayoutPath.{{constantCase layoutNameWithoutSuffix}}[\\S\\s]*},)([\\S\\s]*{{pascalCase layoutNameWithoutSuffix}}LayoutNotFound)',
            {
              layoutNameWithoutSuffix: data.layoutNameWithoutSuffix
            }
          ),
          'g'
        ),
        templateFile: `${PATH.PLOP.TEMPLATES.self}/page/public/router-config.hbs`,
        data: { layoutNameWithoutType: `${data.layoutNameWithoutSuffix}Layout` },
        skip: () => {
          if (correctPageType === PROTECTION_TYPE.PRIVATE) return '';
        }
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: `${PATH.SRC.ROUTER}/utils/lazy-importter.ts`,
        pattern: new RegExp('/(// [END] ' + capitalize(correctPageType) + ')/', 'g'),
        template: "export const {{constantCase pageName}} = lazy(() => retryLoadComponent(() => import('@/pages/{{correctPageType}}/{{constantCase pageName}}')));" + BREAK_LINE + '$1',
      },
      { type: PLOP_ACTION_TYPE.PRETTIER }
    ];
  }
});
