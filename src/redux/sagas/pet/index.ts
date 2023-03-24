import { all, takeLatest } from 'redux-saga/effects';

import { petActions } from '@/redux';

import { findPetByIdSaga } from './findPetById';

export function* petRootSaga(): Generator {
  yield all([takeLatest(petActions.findPetByIdRequest.type, findPetByIdSaga)]);
}
