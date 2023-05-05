export const PLOP_ACTION_TYPE = {
  ADD: 'add',
  ADD_MANY: 'addMany',
  MODIFY: 'modify',
  REMOVE: 'remove',
  REMOVE_MANY: 'removeMany',
  PRETTIER: 'prettier'
};

export const PLOP_COMMAND = {
  CREATE_COMPONENT: 'create-component',
  REMOVE_COMPONENT: 'remove-component',
  CREATE_LAYOUT: 'create-layout',
  REMOVE_LAYOUT: 'remove-layout',
  CREATE_PAGE: 'create-page',
  REMOVE_PAGE: 'remove-page'
};

export const PLOP_HELPER_TYPE = {
  SUFFIX_CURLY: 'sufCurly'
};

export const PLOP_PROMPT_TYPE = {
  INPUT: 'input',
  LIST: 'list'
};

export const COMPONENT_TYPE = { COMPONENTS: 'components', CONTAINERS: 'containers' };
export const PROTECTION_TYPE = { PUBLIC: 'public', PRIVATE: 'private' };

export const PATH = {
  SRC: {
    _self: './src',
    LAYOUTS: {
      _self: './src/layouts',
      PRIVATE: './src/layouts/private',
      PUBLIC: './src/layouts/public',
    },
    COMPONENTS: './src/components',
    CONTAINERS: './src/containers',
    PAGES: './src/pages',
    REDUX: './src/redux',
    SERVICES: './src/services',
    TYPES: './src/types',
    UTILS: './src/types',
    ROUTER: {
      _self: './src/router',
      PATHS: './src/router/paths.ts',
      CONFIG: './src/router/config.ts',
    },
    STYLES: {
      _self: './src/styles',
      MAIN_CLASSES: './src/styles/main-classes.scss'
    }
  },
  PLOP: {
    _self: './plop',
    TEMPLATES: {
      _self: './plop/templates',
      COMPONENT: './plop/templates/component',
      LAYOUT: {
        _self: './plop/templates/layout',
        MAIN_COMPONENT: './plop/templates/layout/main-component',
        PRIVATE: './plop/templates/layout/private',
        PUBLIC: './plop/templates/layout/public'
      },
      PAGE: {
        _self: './plop/templates/page',
        PRIVATE: './plop/templates/page/private',
        PUBLIC: './plop/templates/page/public'
      }
    },
    GENERATORS: './plop/generators'
  },
  STORYBOOK: './stories'
};

export const BREAK_LINE = process.platform.startsWith('win') ? '\r\n' : '\n';
