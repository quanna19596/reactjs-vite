import { createSlice } from '@reduxjs/toolkit';

import { asyncStatusReducers, successHandler } from '@/redux';

import initialState from './initial-state';
import stateReducers from './state-reducers';

export const petSlice = createSlice({
  name: 'petStore/pet',
  initialState,
  reducers: {
    getPetByIdSuccess: (state, action) => successHandler(state, action, { data: action.payload }),
    ...stateReducers
  },
  extraReducers: asyncStatusReducers
});
