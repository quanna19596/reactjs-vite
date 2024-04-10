import { actionType, generator, helper, PLOP_ACTION_TYPE, PLOP_COMMAND, PLOP_HELPER_TYPE } from './plop/index.js';

export default (plop) => {
  plop.setHelper(PLOP_HELPER_TYPE.SUFFIX_CURLY, helper.suffixCurly);

  plop.setActionType(PLOP_ACTION_TYPE.PRETTIER, actionType.prettier);
  plop.setActionType(PLOP_ACTION_TYPE.REMOVE, actionType.remove);
  plop.setActionType(PLOP_ACTION_TYPE.REMOVE_MANY, actionType.removeMany);

  plop.setGenerator(PLOP_COMMAND.CREATE_COMPONENT, generator.createComponent(plop));
  plop.setGenerator(PLOP_COMMAND.REMOVE_COMPONENT, generator.removeComponent(plop));
  plop.setGenerator(PLOP_COMMAND.CREATE_LAYOUT, generator.createLayout(plop));
  plop.setGenerator(PLOP_COMMAND.REMOVE_LAYOUT, generator.removeLayout(plop));
  plop.setGenerator(PLOP_COMMAND.CREATE_PAGE, generator.createPage(plop));
  plop.setGenerator(PLOP_COMMAND.REMOVE_PAGE, generator.removePage(plop));
  plop.setGenerator(PLOP_COMMAND.CREATE_ICON, generator.createIcon(plop));
  plop.setGenerator(PLOP_COMMAND.REMOVE_ICON, generator.removeIcon(plop));

  plop.setGenerator(PLOP_COMMAND.CREATE_API, generator.createApi(plop));
  plop.setGenerator(PLOP_COMMAND.REMOVE_API, generator.removeApi(plop));
};
