// import petRootSaga from './pet';

// export { petRootSaga };

import { all, takeEvery } from 'redux-saga/effects';

import { petSlice } from '@/redux/slices/petstore';

import { getPetByIdSaga } from './pet';

export default function* petStoreRootSaga(): Generator {
  yield all([takeEvery(petSlice.actions.getPetByIdRequest.type, getPetByIdSaga)]);
}
