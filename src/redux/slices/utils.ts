import { TErrorHandlerPayload, TRequestHandlerCallbacks } from './types';

export const requestHandler = <T, U>(_state: any, _action: { payload: T & TRequestHandlerCallbacks<U>; type: string }): void => {};

export const errorHandler = (_state: any, _action: { payload: TErrorHandlerPayload; type: string }): void => {};
