import { errorHandler, requestHandler } from '@/redux';
import { TGetPetByIdParameters, TGetPetByIdResponse, TResponseError } from '@/services/pet-store';

const stateReducers = {
  getPetByIdRequest: requestHandler<TGetPetByIdParameters, TGetPetByIdResponse, TResponseError>,
  getPetByIdFailed: errorHandler<TResponseError>
};

export default stateReducers;
