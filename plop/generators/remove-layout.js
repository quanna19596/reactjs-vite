import { BREAK_LINE, PATH, PLOP_ACTION_TYPE, PLOP_PROMPT_TYPE, PROTECTION_TYPE } from '../constants.js';
import { getAllDirsInDirectory } from '../utils.js';

export default (plop) => ({
  description: 'Remove Layout',
  prompts: [
    {
      type: PLOP_PROMPT_TYPE.LIST,
      name: 'layoutNameWithType',
      choices: () => {
        const privateLayouts = getAllDirsInDirectory(`${PATH.SRC.LAYOUTS}/private`).map((layout) => `${layout} (private)`);
        const publicLayouts = getAllDirsInDirectory(`${PATH.SRC.LAYOUTS}/public`).map((layout) => `${layout} (public)`);
        const layouts = [...privateLayouts, ...publicLayouts, 'HelloLayout (public)'].filter((dir) => !dir.includes('.'));
        return layouts;
      },
      message: 'Layout name?'
    }
  ],
  actions: ({ layoutNameWithType }) => {
    const layoutName = layoutNameWithType.split(' (')[0];
    const layoutType = layoutNameWithType.split('(')[1].replace(')', '');
    const rawLayoutName = layoutName.replace('Layout', '');
    const layoutDirPath = `${PATH.SRC.LAYOUTS}/${layoutType}/${layoutName}`;

    return [
      {
        type: PLOP_ACTION_TYPE.REMOVE,
        path: layoutDirPath
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: `${PATH.SRC.LAYOUTS}/${layoutType}/index.ts`,
        pattern: new RegExp("export \\* from './" + layoutName + "';", 'g'),
        template: ''
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: PATH.SRC.STYLES.MAIN_CLASSES,
        pattern: new RegExp(BREAK_LINE + '\\$' + layoutName + 'Default[\\S\\s]*' + layoutName + "PermissionDenied';", 'g'),
        template: '',
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: PATH.SRC.ROUTER.PATHS,
        pattern: new RegExp(BREAK_LINE + plop.renderString('    {{constantCase rawLayoutName}}.*', { rawLayoutName }), 'g'),
        template: ''
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: PATH.SRC.ROUTER.CONFIG,
        pattern: new RegExp(`${layoutName}[\\S\\s]*${layoutName}PermissionDenied,([\\S\\s]*} from '@/layouts')`, 'g'),
        template: '$1',
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: PATH.SRC.ROUTER.CONFIG,
        pattern: new RegExp(`${layoutName}[\\S\\s]*${layoutName}PermissionDenied([\\S\\s]*} from '@/layouts')`, 'g'),
        template: '$1',
      },
      {
        type: PLOP_ACTION_TYPE.MODIFY,
        path: PATH.SRC.ROUTER.CONFIG,
        pattern: new RegExp(
          BREAK_LINE +
            '    {' +
            BREAK_LINE +
            '      ' +
            plop.renderString('path: PATHS.LAYOUT.{{constantCase rawLayoutName}}()[\\S\\s]*{{layoutName}}Error', {
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
