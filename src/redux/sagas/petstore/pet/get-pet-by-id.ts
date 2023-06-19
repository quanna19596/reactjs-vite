import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { call, put } from 'redux-saga/effects';

import { petstoreSlices, TRequestHandlerCallbacks } from '@/redux';
import { getPetById, TError, TGetPetByIdParameters, TGetPetByIdResponse } from '@/services';

export default function* getPetByIdSaga(
  action: PayloadAction<TGetPetByIdParameters & TRequestHandlerCallbacks<TGetPetByIdResponse>>
): Generator {
  const { successCb, failedCb, storeInGlobalState, ...params } = action.payload;
  try {
    const response = yield call(getPetById, params);
    yield put(petstoreSlices.petSlice.actions.getPetByIdSuccess(storeInGlobalState ? response : undefined));
    successCb?.(response as TGetPetByIdResponse);
  } catch (err) {
    const error = (err as AxiosError).response?.data as TError;
    yield put(petstoreSlices.petSlice.actions.getPetByIdFailed(error));
    failedCb?.(error);
  }
}
