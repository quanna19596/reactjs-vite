import { Action } from '@reduxjs/toolkit';

import { TError } from '@/services';

export type TErrorHandlerPayload = TError;

export type TRequestHandlerCallbacks<T> = {
  successCb?: (response?: T) => void;
  failedCb?: (err?: TErrorHandlerPayload) => void;
  storeInGlobalState?: boolean;
};

export type TStatusState = { isLoading?: boolean; error?: any };

export type TInitialState<T> = TStatusState & { data?: T };

export type TAction = Action & { payload: any };
