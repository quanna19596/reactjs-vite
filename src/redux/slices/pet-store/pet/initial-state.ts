import { TInitialState } from '@/redux/types';
import { TGetPetByIdResponse } from '@/services/pet-store/pet/get-pet-by-id';

const initialState: {
  getPetById: TInitialState<TGetPetByIdResponse>;
} = {
  getPetById: { data: undefined, isLoading: undefined, error: undefined }
};

export default initialState;
