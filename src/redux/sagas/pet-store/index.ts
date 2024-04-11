import { all, takeEvery } from 'redux-saga/effects';

import { petSlice } from '@/redux/slices/pet-store';

import { getPetByIdSaga } from './pet';

export default function* petStoreRootSaga(): Generator {
  yield all([takeEvery(petSlice.actions.getPetByIdRequest.type, getPetByIdSaga)]);
}
