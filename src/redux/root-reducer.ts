import { combineReducers } from 'redux';

import petSlice from './slices/pet-store/pet/slice';
import cartSlice from './slices/client/cart/slice';

const rootReducer = {
  petStore: combineReducers({
    pet: petSlice.reducer
  }),
  clientStore: combineReducers({
    cart: cartSlice.reducer
  }),
};

export default rootReducer;
