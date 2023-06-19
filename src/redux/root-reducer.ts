import { petstoreSlices } from './slices';

const rootReducer = {
  pet: petstoreSlices.petSlice.reducer
};

export default rootReducer;
