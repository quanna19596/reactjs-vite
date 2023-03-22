import { configureStore } from '@reduxjs/toolkit';

import { rootReducer } from '@/redux';

export const store = configureStore({
  reducer: rootReducer
});

export type TRootState = ReturnType<typeof store.getState>;
export type TAppDispatch = typeof store.dispatch;
