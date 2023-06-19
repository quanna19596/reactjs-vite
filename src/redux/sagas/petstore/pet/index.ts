import { all, takeEvery } from 'redux-saga/effects';

import { petstoreSlices } from '@/redux';

import getPetByIdSaga from './get-pet-by-id';

export default function* petRootSaga(): Generator {
  yield all([takeEvery(petstoreSlices.petSlice.actions.getPetByIdRequest.type, getPetByIdSaga)]);
}
