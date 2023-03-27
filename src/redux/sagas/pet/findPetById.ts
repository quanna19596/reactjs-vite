import { call, put } from 'redux-saga/effects';

import { findPetById, TFindPetByIdParameters } from '@/services';
import { petActions, TRequestHandlerCallbacks } from '@/redux';
import { PayloadAction } from '@reduxjs/toolkit';

export function* findPetByIdSaga(action: PayloadAction<TFindPetByIdParameters & TRequestHandlerCallbacks>): Generator {
  const { successCb, failedCb, ...params } = action.payload;
  try {
    const response = yield call(findPetById, params);
    yield put(petActions.findPetByIdSuccess(response));
    successCb?.(response);
  } catch (err) {
    const error = { status: 400, message: 'Error' };
    yield put(petActions.findPetByIdFailed(error));
    failedCb?.(error);
  }
}
