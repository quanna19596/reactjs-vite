import { all, fork } from 'redux-saga/effects';

import petStoreRootSaga from './petstore';

export const rootSaga = function* root(): Generator {
  yield all([fork(petStoreRootSaga)]);
};
