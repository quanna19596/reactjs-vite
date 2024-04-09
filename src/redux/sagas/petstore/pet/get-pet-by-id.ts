import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { call, put } from 'redux-saga/effects';

import { TRequestHandlerCallbacks } from '@/redux';
import { petSlice } from '@/redux/slices/petstore';
import { getPetById, TGetPetByIdParameters, TGetPetByIdResponse, TResponseError } from '@/services/petstore';

export function* getPetByIdSaga(
  action: PayloadAction<TGetPetByIdParameters & TRequestHandlerCallbacks<TGetPetByIdResponse, TResponseError>>
): Generator {
  const { successCb, failedCb, storeInGlobalState, ...params } = action.payload;
  try {
    const response = yield call(getPetById, params);
    yield put(petSlice.actions.getPetByIdSuccess({ storeInGlobalState, response }));
    successCb?.(response as TGetPetByIdResponse);
  } catch (err) {
    const error = (err as AxiosError).response?.data as TResponseError;
    yield put(petSlice.actions.getPetByIdFailed(error));
    failedCb?.(error);
  }
}
