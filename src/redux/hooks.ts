import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

import { TAppDispatch, TRootState } from './store';

export const useAppDispatch: () => TAppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<TRootState> = useSelector;
