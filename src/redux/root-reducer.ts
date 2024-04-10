import { combineReducers } from 'redux';

import { petSlice } from './slices/pet-store';

const rootReducer = {
  petStore: combineReducers({
    pet: petSlice.reducer
  })
};

export default rootReducer;
