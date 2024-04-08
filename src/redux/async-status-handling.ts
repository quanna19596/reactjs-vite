import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { EActionType } from '@/enums';

import { TAction } from './slices/types';
import { TStatusState } from './slices';

const updateStatusState = (state: any, action: TAction, statusState: TStatusState, actionType: EActionType): void => {
  const actionName = action.type.split('/').at(-1)?.replace(actionType, '');
  if (actionName) state[actionName] = { ...state[actionName], ...statusState };
};

const requestAction = {
  isDispatching: (action: TAction): boolean => {
    return action.type.endsWith('Request');
  },
  handler: (state: any, action: TAction): void => updateStatusState(state, action, { isLoading: true, error: null }, EActionType.REQUEST)
};

const successAction = {
  isDispatching: (action: TAction): boolean => {
    return action.type.endsWith('Success');
  },
  handler: (state: any, action: TAction): void => updateStatusState(state, action, { isLoading: false, error: null }, EActionType.SUCCESS)
};

const failedAction = {
  isDispatching: (action: TAction): boolean => {
    return action.type.endsWith('Failed');
  },
  handler: (state: any, action: TAction): void =>
    updateStatusState(state, action, { isLoading: false, error: action.payload }, EActionType.FAILED)
};

const asyncStatusReducers = (builder: ActionReducerMapBuilder<{}>): void => {
  builder.addMatcher(requestAction.isDispatching, requestAction.handler);
  builder.addMatcher(failedAction.isDispatching, failedAction.handler);
  builder.addMatcher(successAction.isDispatching, successAction.handler);
};

export default asyncStatusReducers;
