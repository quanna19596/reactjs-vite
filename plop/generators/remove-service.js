import { PLOP_PROMPT_TYPE, PATH, PLOP_ACTION_TYPE, BREAK_LINE } from "../constants.js";

export default (plop) => ({
  description: 'Remove Service',
  prompts: [],
  actions: () => {
    return [
      { type: PLOP_ACTION_TYPE.PRETTIER }
    ];
  }
});
