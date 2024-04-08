import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import { EEnvironmentMode } from '@/enums';

import preloadedState from './preloaded-state';
import rootReducer from './root-reducer';
import { rootSaga } from './sagas';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== EEnvironmentMode.PRODUCTION,
  preloadedState
});

sagaMiddleware.run(rootSaga);

export type TRootState = ReturnType<typeof store.getState>;
export type TAppDispatch = typeof store.dispatch;
