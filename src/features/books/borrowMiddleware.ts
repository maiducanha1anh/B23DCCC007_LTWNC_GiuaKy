import { Middleware } from '@reduxjs/toolkit';
import { borrowBook, setBorrowWarning } from './booksSlice';

/**
 * BUỔI 4 — REDUX MIDDLEWARE TỰ VIẾT (Yêu cầu kỹ thuật 3 & Chức năng 7)
 * Chặn action mượn sách nếu sinh viên đã mượn tối đa 3 cuốn cùng lúc
 * và phát cảnh báo tới người dùng.
 */
export const borrowLimitMiddleware: Middleware = (storeAPI) => (next) => (action) => {
  if (borrowBook.match(action)) {
    const state = storeAPI.getState();
    const currentBorrowedCount = state.books.borrowedBookIds?.length || 0;

    // Giới hạn tối đa 3 cuốn cùng lúc
    if (currentBorrowedCount >= 3) {
      storeAPI.dispatch(
        setBorrowWarning(
          'Cảnh báo: Mỗi sinh viên chỉ được mượn tối đa 3 cuốn cùng lúc! Bạn cần trả bớt sách trước khi mượn thêm.'
        )
      );
      // Chặn action borrowBook, không chuyển tiếp tới reducer
      return;
    }
  }

  return next(action);
};
