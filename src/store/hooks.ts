import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

/**
 * BUỔI 3 — TYPED REDUX HOOKS
 * Sử dụng trong toàn bộ ứng dụng thay cho plain `useDispatch` và `useSelector`
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
