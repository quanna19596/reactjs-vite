import { combineReducers } from 'redux';

import petSlice from './slices/pet-store/pet/slice';

const rootReducer = {
  petStore: combineReducers({
    pet: petSlice.reducer
  })
};

export default rootReducer;
