import { TInitialState } from '@/redux';
import { TGetPetByIdResponse } from '@/services';

const initialState: {
  getPetById: TInitialState<TGetPetByIdResponse>;
} = {
  getPetById: { data: undefined, isLoading: undefined, error: undefined }
};

export default initialState;
