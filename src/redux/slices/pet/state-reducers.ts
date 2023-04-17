import { errorHandler, requestHandler } from '@/redux/slices/utils';
import { TFindPetByIdParameters } from '@/services';

const stateReducers = {
  findPetByIdRequest: requestHandler as typeof requestHandler<TFindPetByIdParameters>,
  findPetByIdFailed: errorHandler
};

export default stateReducers;
