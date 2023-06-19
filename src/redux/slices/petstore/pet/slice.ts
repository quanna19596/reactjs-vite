import { createSlice } from '@reduxjs/toolkit';

import asyncStatusReducers from '@/redux/async-status-handling';

import initialState from './initial-state';
import stateReducers from './state-reducers';

const petSlice = createSlice({
  name: 'petstore/pet',
  initialState,
  reducers: {
    getPetByIdSuccess: (state, action) => ({ ...state, getPetById: { data: action.payload } }),
    ...stateReducers
  },
  extraReducers: asyncStatusReducers
});

export default petSlice;
