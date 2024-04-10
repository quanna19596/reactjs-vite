import { all, fork } from 'redux-saga/effects';

import petStoreRootSaga from './pet-store';

export const rootSaga = function* root(): Generator {
  yield all([fork(petStoreRootSaga)]);
};
