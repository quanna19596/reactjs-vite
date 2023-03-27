import { TFindPetByIdParameters } from '@/services';
import { requestHandler, errorHandler } from '@/redux/slices/utils';

const stateReducers = {
  findPetByIdRequest: requestHandler as typeof requestHandler<TFindPetByIdParameters>,
  findPetByIdFailed: errorHandler
};

export default stateReducers;
