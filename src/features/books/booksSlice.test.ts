import booksReducer, {
  initialState,
  borrowBook,
  returnBook,
  setBorrowWarning,
  clearBorrowWarning,
  fetchBooks,
  BooksState,
} from './booksSlice';
import { Book } from './booksTypes';

const mockBook1: Book = {
  id: 'b1',
  title: 'Cấu trúc dữ liệu và Giải thuật',
  author: 'Nguyễn Văn Ất',
  category: 'CNTT',
  publishedYear: 2021,
  availableCopies: 3,
  totalCopies: 5,
};

const mockBook2: Book = {
  id: 'b2',
  title: 'Kinh tế vi mô',
  author: 'Paul Krugman',
  category: 'Kinh tế',
  publishedYear: 2020,
  availableCopies: 0,
  totalCopies: 2,
};

describe('booksSlice reducer (Buổi 3 & 6)', () => {
  // Test 1: Khởi tạo state mặc định khi action không xác định
  test('1. Trả về initial state mặc định khi action không xác định', () => {
    const state = booksReducer(undefined, { type: 'unknown_action' });
    expect(state).toEqual(initialState);
  });

  // Test 2: Xử lý fetchBooks.pending
  test('2. Chuyển status sang loading và xoá lỗi khi fetchBooks.pending', () => {
    const prevState: BooksState = {
      ...initialState,
      status: 'failed',
      error: 'Lỗi cũ',
    };
    const action = { type: fetchBooks.pending.type };
    const nextState = booksReducer(prevState, action);

    expect(nextState.status).toBe('loading');
    expect(nextState.error).toBeNull();
  });

  // Test 3: Xử lý fetchBooks.fulfilled
  test('3. Lưu danh sách sách và chuyển status sang succeeded khi fetchBooks.fulfilled', () => {
    const prevState: BooksState = {
      ...initialState,
      status: 'loading',
    };
    const booksPayload = [mockBook1, mockBook2];
    const action = { type: fetchBooks.fulfilled.type, payload: booksPayload };
    const nextState = booksReducer(prevState, action);

    expect(nextState.status).toBe('succeeded');
    expect(nextState.books).toEqual(booksPayload);
    expect(nextState.books.length).toBe(2);
  });

  // Test 4: Xử lý fetchBooks.rejected
  test('4. Ghi nhận lỗi và chuyển status sang failed khi fetchBooks.rejected', () => {
    const prevState: BooksState = {
      ...initialState,
      status: 'loading',
    };
    const errorMessage = 'Không thể kết nối đến máy chủ thư viện!';
    const action = { type: fetchBooks.rejected.type, payload: errorMessage };
    const nextState = booksReducer(prevState, action);

    expect(nextState.status).toBe('failed');
    expect(nextState.error).toBe(errorMessage);
  });

  // Test 5: Mượn sách thành công (giảm availableCopies đi 1, thêm vào borrowedBookIds)
  test('5. Giảm availableCopies đi 1 và thêm id vào danh sách mượn khi borrowBook', () => {
    const stateWithBooks: BooksState = {
      ...initialState,
      books: [{ ...mockBook1, availableCopies: 3 }],
      borrowedBookIds: [],
    };

    const nextState = booksReducer(stateWithBooks, borrowBook('b1'));

    expect(nextState.books[0].availableCopies).toBe(2);
    expect(nextState.borrowedBookIds).toContain('b1');
  });

  // Test 6: Trả sách (tăng availableCopies lên 1, xoá khỏi borrowedBookIds)
  test('6. Tăng availableCopies lên 1 và xoá id khỏi danh sách mượn khi returnBook', () => {
    const stateWithBorrowed: BooksState = {
      ...initialState,
      books: [{ ...mockBook1, availableCopies: 2 }],
      borrowedBookIds: ['b1'],
    };

    const nextState = booksReducer(stateWithBorrowed, returnBook('b1'));

    expect(nextState.books[0].availableCopies).toBe(3);
    expect(nextState.borrowedBookIds).not.toContain('b1');
  });

  // Test 7: Cảnh báo mượn sách
  test('7. Cập nhật và xoá thông báo cảnh báo mượn sách', () => {
    const stateWithWarning = booksReducer(
      initialState,
      setBorrowWarning('Đã mượn tối đa 3 cuốn!')
    );
    expect(stateWithWarning.borrowWarning).toBe('Đã mượn tối đa 3 cuốn!');

    const clearedState = booksReducer(stateWithWarning, clearBorrowWarning());
    expect(clearedState.borrowWarning).toBeNull();
  });
});
