import { createSlice } from '@reduxjs/toolkit';

import asyncStatusReducers from '@/redux/async-status-handling';

import initialState from './initial-state';
import stateReducers from './state-reducers';

const petSlice = createSlice({
  name: 'pet',
  initialState,
  reducers: {
    findPetByIdSuccess: (state, action) => {
      console.log(state, action);
    },
    ...stateReducers
  },
  extraReducers: asyncStatusReducers
});

export const petActions = petSlice.actions;
export const petReducer = petSlice.reducer;
