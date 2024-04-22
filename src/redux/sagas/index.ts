import { all, fork } from 'redux-saga/effects';

import petStoreRootSaga from './pet-store';

const rootSaga = function* root(): Generator {
  yield all([fork(petStoreRootSaga)]);
};

export default rootSaga;
