import { all, fork } from 'redux-saga/effects';

import { petRootSaga } from './petstore';

export const rootSaga = function* root(): Generator {
  yield all([fork(petRootSaga)]);
};
