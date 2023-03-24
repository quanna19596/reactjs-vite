import { call, put } from 'redux-saga/effects';

import { findPetById } from '@/services';
import { petActions } from '@/redux/slices';

// FUNCTION

export function* findPetByIdSaga(action: Action): Generator {
  try {
    const response = yield call(findPetById, { petId: 123 });
    // yield put(getMinesAction.success(getMinesResponse));
    // successCallback?.(getMinesResponse);
  } catch (err) {
    yield put(petActions.findPetByIdFailed({ status: 400, message: '' }));
    // failedCallback?.(err);
  }
}
