import { PLOP_ACTION_TYPE, PLOP_PROMPT_TYPE } from "../constants.js";
import { getColorName } from "../utils.js";

export default (plop) => ({
  description: 'Get color name',
  prompts: [
    {
      type: PLOP_PROMPT_TYPE.INPUT,
      name: 'hexColor',
      message: 'Hex color?'
    }
  ],
  actions: ({ hexColor }) => {
    getColorName.init();
    const [_, name] = getColorName.name(hexColor);

    return [
      {
        type: PLOP_ACTION_TYPE.CONSOLE,
        message: plop.renderString('${{dashCase name}}', { name })
      },
    ];
  }
});
