import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Book, isSuccessResponse, isErrorResponse } from './booksTypes';
import { fetchBooksApi } from '../../api/booksApi';

/**
 * BUỔI 3 — REDUX TOOLKIT VỚI TYPESCRIPT (FEATURE-BASED STRUCTURE)
 * Quản lý danh sách sách, sách đang mượn, trạng thái bất đồng bộ createAsyncThunk (pending, fulfilled, rejected).
 */

export interface BooksState {
  books: Book[];
  borrowedBookIds: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  borrowWarning: string | null;
}

export const initialState: BooksState = {
  books: [],
  borrowedBookIds: [],
  status: 'idle',
  error: null,
  borrowWarning: null,
};

/**
 * Async Thunk lấy danh sách sách từ API giả lập (500ms delay)
 * Xử lý đủ 3 trạng thái pending / fulfilled / rejected
 * Sử dụng Generic ApiResponse và Type Guard để kiểm tra kết quả
 */
export const fetchBooks = createAsyncThunk<
  Book[],
  boolean | undefined,
  { rejectValue: string }
>('books/fetchBooks', async (shouldFail = false, { rejectWithValue }) => {
  const response = await fetchBooksApi(shouldFail);

  // Áp dụng Type Guard (Buổi 1) để phân biệt thành công và thất bại
  if (isSuccessResponse(response)) {
    return response.data;
  } else if (isErrorResponse(response)) {
    return rejectWithValue(response.error);
  }

  return rejectWithValue('Phản hồi từ API không hợp lệ');
});

export const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    // Action mượn sách: giảm số bản còn lại và lưu vào danh sách mượn
    borrowBook: (state, action: PayloadAction<string>) => {
      const bookId = action.payload;
      const book = state.books.find((b) => b.id === bookId);

      // Chỉ cho phép mượn nếu sách tồn tại, còn bản và chưa mượn cuốn này
      if (book && book.availableCopies > 0 && !state.borrowedBookIds.includes(bookId)) {
        book.availableCopies -= 1;
        state.borrowedBookIds.push(bookId);
        state.borrowWarning = null;
      }
    },

    // Action trả sách: tăng số bản còn lại và xoá khỏi danh sách mượn
    returnBook: (state, action: PayloadAction<string>) => {
      const bookId = action.payload;
      const book = state.books.find((b) => b.id === bookId);

      if (state.borrowedBookIds.includes(bookId)) {
        if (book) {
          book.availableCopies += 1;
        }
        state.borrowedBookIds = state.borrowedBookIds.filter((id) => id !== bookId);
        state.borrowWarning = null;
      }
    },

    // Action thiết lập cảnh báo mượn sách (dùng bởi middleware)
    setBorrowWarning: (state, action: PayloadAction<string>) => {
      state.borrowWarning = action.payload;
    },

    // Action xoá cảnh báo mượn sách
    clearBorrowWarning: (state) => {
      state.borrowWarning = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 1. Trạng thái Pending: Đang tải dữ liệu
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      // 2. Trạng thái Fulfilled: Tải thành công
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.books = action.payload;
        state.error = null;
      })
      // 3. Trạng thái Rejected: Tải thất bại
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Đã có lỗi xảy ra khi tải sách từ máy chủ.';
      });
  },
});

export const { borrowBook, returnBook, setBorrowWarning, clearBorrowWarning } = booksSlice.actions;
export default booksSlice.reducer;
