import { Action } from '@reduxjs/toolkit';

export type TErrorHandlerPayload<T> = T;

export type TRequestHandlerCallbacks<T, U> = {
  successCb?: (response?: T) => void;
  failedCb?: (err?: U) => void;
  storeInGlobalState?: boolean;
};

export type TStatusState = { isLoading?: boolean; error?: any };
export type TInitialState<T> = TStatusState & { data?: T };
export type TAction = Action & { payload: any };
