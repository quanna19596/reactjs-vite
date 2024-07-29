import { createSlice } from '@reduxjs/toolkit';

import initialState from './initial-state';

const cartSlice = createSlice({
  name: 'clientStore/cart',
  initialState,
  reducers: {
    addProduct: (state, action) => state
  }
});

export default cartSlice;
