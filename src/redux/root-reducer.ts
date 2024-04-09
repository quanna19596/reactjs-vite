import { combineReducers } from 'redux';

import { petSlice } from './slices/petstore';

const rootReducer = {
  petStore: combineReducers({
    pet: petSlice.reducer
  })
};

export default rootReducer;
