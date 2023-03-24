import { ActionReducerMapBuilder, AnyAction } from '@reduxjs/toolkit';

const requestAction = {
  isDispatching: (action: AnyAction): boolean => {
    return action.type.endsWith('Request');
  },
  handler: (state: any): void => {
    state.isLoading = true;
    state.error = null;
  }
};

const successAction = {
  isDispatching: (action: AnyAction): boolean => {
    return action.type.endsWith('Success');
  },
  handler: (state: any): void => {
    state.isLoading = false;
    state.error = null;
  }
};

const failedAction = {
  isDispatching: (action: AnyAction): boolean => {
    return action.type.endsWith('Failed');
  },
  handler: (state: any, action: AnyAction): void => {
    state.error = action.payload;
    state.isLoading = false;
  }
};

const asyncStatusReducers = (builder: ActionReducerMapBuilder<{}>): void => {
  builder.addMatcher(requestAction.isDispatching, requestAction.handler);
  builder.addMatcher(failedAction.isDispatching, failedAction.handler);
  builder.addMatcher(successAction.isDispatching, successAction.handler);
};

export default asyncStatusReducers;
