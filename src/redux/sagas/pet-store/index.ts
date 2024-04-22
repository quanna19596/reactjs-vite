import { all, takeEvery } from 'redux-saga/effects';

import petSlice from '@/redux/slices/pet-store/pet/slice';

import getPetByIdSaga from './pet/get-pet-by-id';

export default function* petStoreRootSaga(): Generator {
  yield all([takeEvery(petSlice.actions.getPetByIdRequest.type, getPetByIdSaga)]);
}
