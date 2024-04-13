import { PLOP_PROMPT_TYPE, PATH, PLOP_ACTION_TYPE, BREAK_LINE } from "../constants.js";
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
        message: name
      },
    ];
  }
});
