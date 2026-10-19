import { borrowLimitMiddleware } from './borrowMiddleware';
import { borrowBook, setBorrowWarning } from './booksSlice';

describe('borrowLimitMiddleware (Buổi 4 & Yêu cầu kỹ thuật 3)', () => {
  let mockStore: {
    getState: jest.Mock;
    dispatch: jest.Mock;
  };
  let next: jest.Mock;

  beforeEach(() => {
    mockStore = {
      getState: jest.fn(),
      dispatch: jest.fn(),
    };
    next = jest.fn();
  });

  test('cho phép mượn sách khi sinh viên đang mượn ít hơn 3 cuốn (< 3)', () => {
    // Giả lập state đang mượn 2 cuốn
    mockStore.getState.mockReturnValue({
      books: {
        borrowedBookIds: ['b1', 'b2'],
      },
    });

    const action = borrowBook('b3');
    borrowLimitMiddleware(mockStore as any)(next)(action);

    // Middleware phải chuyển action tiếp tục đến next
    expect(next).toHaveBeenCalledWith(action);
    // Không được dispatch cảnh báo
    expect(mockStore.dispatch).not.toHaveBeenCalled();
  });

  test('chặn mượn sách và dispatch setBorrowWarning khi sinh viên đã mượn đủ 3 cuốn (>= 3)', () => {
    // Giả lập state đã mượn đủ 3 cuốn
    mockStore.getState.mockReturnValue({
      books: {
        borrowedBookIds: ['b1', 'b2', 'b3'],
      },
    });

    const action = borrowBook('b4');
    borrowLimitMiddleware(mockStore as any)(next)(action);

    // Middleware KHÔNG được gọi next (action bị chặn hoàn toàn)
    expect(next).not.toHaveBeenCalled();
    // Dispatch cảnh báo giới hạn mượn
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: setBorrowWarning.type,
      })
    );
  });

  test('cho phép các action khác (ví dụ: returnBook) đi qua bình thường mà không bị chặn', () => {
    mockStore.getState.mockReturnValue({
      books: {
        borrowedBookIds: ['b1', 'b2', 'b3'],
      },
    });

    const action = { type: 'books/returnBook', payload: 'b1' };
    borrowLimitMiddleware(mockStore as any)(next)(action);

    expect(next).toHaveBeenCalledWith(action);
    expect(mockStore.dispatch).not.toHaveBeenCalled();
  });
});
