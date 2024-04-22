import { errorHandler, requestHandler } from '@/redux/slices/utils';
import { TGetPetByIdParameters, TGetPetByIdResponse } from '@/services/pet-store/pet/get-pet-by-id';
import { TResponseError } from '@/services/pet-store/types';

const stateReducers = {
  getPetByIdRequest: requestHandler<TGetPetByIdParameters, TGetPetByIdResponse, TResponseError>,
  getPetByIdFailed: errorHandler<TResponseError>
};

export default stateReducers;
