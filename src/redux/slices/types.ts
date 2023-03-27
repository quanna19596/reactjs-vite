export type TErrorHandlerPayload = {
  status: number;
  message: string;
};

export type TRequestHandlerCallbacks = {
  successCb?: (response?: any) => void;
  failedCb?: (err?: TErrorHandlerPayload) => void;
};
