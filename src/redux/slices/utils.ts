import { EActionType } from '@/enums';

import { TAction, TErrorHandlerPayload, TRequestHandlerCallbacks } from './types';

export const requestHandler = <T, U, V>(_state: any, _action: { payload: T & TRequestHandlerCallbacks<U, V>; type: string }): void => {};

export const successHandler = (state: any, action: TAction, newState: any): void => {
  const stateName = action.type.split('/').at(-1)?.replace(EActionType.SUCCESS, '');
  const noStoring = !action.payload.storeInGlobalState;
  return noStoring || !stateName ? state : { ...state, [stateName]: { ...state[stateName], ...newState } };
};

export const errorHandler = <T>(_state: any, _action: { payload: TErrorHandlerPayload<T>; type: string }): void => {};
