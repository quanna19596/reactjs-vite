import { TFindPetByIdParameters } from '@/services';

const requestHandler = <T>(_state: any, _action: { payload: T; type: string }): void => {};

const errorHandler = (_state: any, _action: { payload: { status: number; message: string }; type: string }): void => {};

const stateReducers = {
  findPetByIdRequest: requestHandler as typeof requestHandler<TFindPetByIdParameters>,
  findPetByIdFailed: errorHandler
};

export default stateReducers;
