import { createSlice } from '@reduxjs/toolkit';

import asyncStatusReducers from '@/redux/slices/async-status-handling';
import { successHandler } from '@/redux/slices/utils';

import initialState from './initial-state';
import stateReducers from './state-reducers';

const petSlice = createSlice({
  name: 'petStore/pet',
  initialState,
  reducers: {
    getPetByIdSuccess: successHandler,
    ...stateReducers
  },
  extraReducers: asyncStatusReducers
});

export default petSlice;
