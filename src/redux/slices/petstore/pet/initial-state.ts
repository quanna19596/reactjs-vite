import { TInitialState } from '@/redux';
import { TGetPetByIdResponse } from '@/services';

const initialState: {
  getPetById: TInitialState<TGetPetByIdResponse>;
} = {
  getPetById: { data: undefined }
};

export default initialState;
