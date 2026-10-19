import { configureStore } from '@reduxjs/toolkit';
import booksReducer from '../features/books/booksSlice';
import { borrowLimitMiddleware } from '../features/books/borrowMiddleware';

/**
 * BUỔI 3 & 4 — CẤU HÌNH REDUX STORE
 * Tích hợp Redux Toolkit slice và middleware tự viết borrowLimitMiddleware
 */
export const store = configureStore({
  reducer: {
    books: booksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(borrowLimitMiddleware),
});

// Định nghĩa RootState và AppDispatch types từ store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
