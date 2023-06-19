import { errorHandler, requestHandler } from '@/redux/slices/utils';
import { TGetPetByIdParameters, TGetPetByIdResponse } from '@/services';

const stateReducers = {
  getPetByIdRequest: requestHandler as typeof requestHandler<TGetPetByIdParameters, TGetPetByIdResponse>,
  getPetByIdFailed: errorHandler
};

export default stateReducers;
