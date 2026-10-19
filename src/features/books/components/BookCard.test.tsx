import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookCard } from './BookCard';
import { Book } from '../booksTypes';

const mockAvailableBook: Book = {
  id: 'b-cntt-1',
  title: 'Lập trình TypeScript Nâng Cao',
  author: 'Nguyễn Văn A',
  category: 'CNTT',
  publishedYear: 2023,
  availableCopies: 3,
  totalCopies: 5,
  description: 'Tài liệu hướng dẫn TypeScript toàn diện.',
};

const mockOutOfStockBook: Book = {
  id: 'b-kinhte-2',
  title: 'Kinh tế lượng ứng dụng',
  author: 'Trần Thị B',
  category: 'Kinh tế',
  publishedYear: 2021,
  availableCopies: 0, // Hết bản
  totalCopies: 4,
  description: 'Giáo trình kinh tế lượng hiện đại.',
};

describe('BookCard Component (Buổi 5 & 6 Testing Library + userEvent)', () => {
  // Test 1: Hiển thị đúng các thông tin của cuốn sách
  test('1. Hiển thị đúng thông tin sách: tên, tác giả, thể loại, năm xuất bản, số bản còn lại', () => {
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookCard
        book={mockAvailableBook}
        isBorrowed={false}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    // Kiểm tra tên sách
    expect(screen.getByText('Lập trình TypeScript Nâng Cao')).toBeInTheDocument();
    // Kiểm tra tác giả
    expect(screen.getByText('Nguyễn Văn A')).toBeInTheDocument();
    // Kiểm tra thể loại
    expect(screen.getByText('CNTT')).toBeInTheDocument();
    // Kiểm tra năm xuất bản
    expect(screen.getByText(/2023/)).toBeInTheDocument();
    // Kiểm tra số bản còn lại
    expect(screen.getByText(/3 \/ 5 cuốn/)).toBeInTheDocument();
  });

  // Test 2: Click nút "Mượn" gọi đúng hàm với đúng id sách
  test('2. Click nút "Mượn" gọi đúng hàm onBorrow với tham số là book id', () => {
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookCard
        book={mockAvailableBook}
        isBorrowed={false}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    const borrowButton = screen.getByRole('button', { name: /mượn sách/i });
    expect(borrowButton).toBeEnabled();

    userEvent.click(borrowButton);

    expect(handleBorrow).toHaveBeenCalledTimes(1);
    expect(handleBorrow).toHaveBeenCalledWith('b-cntt-1');
  });

  // Test 3: Nút "Mượn" bị vô hiệu hoá khi sách đã hết bản
  test('3. Nút "Mượn" bị vô hiệu hoá (disabled) khi sách đã hết bản (availableCopies = 0)', () => {
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookCard
        book={mockOutOfStockBook}
        isBorrowed={false}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    // Nút hiển thị trạng thái hết bản và disabled
    const disabledButton = screen.getByRole('button', { name: /mượn sách/i });
    expect(disabledButton).toBeDisabled();
    expect(screen.getAllByText(/Hết bản/i).length).toBeGreaterThanOrEqual(1);

    // Thử click vào nút disabled, hàm onBorrow không được phép gọi
    userEvent.click(disabledButton);
    expect(handleBorrow).not.toHaveBeenCalled();
  });

  // Test 4 (Bổ sung): Khi sách đang được mượn, hiển thị nút "Trả sách" và click gọi onReturn
  test('4. Hiển thị nút "Trả sách" khi isBorrowed=true và click gọi đúng onReturn với book id', () => {
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookCard
        book={mockAvailableBook}
        isBorrowed={true}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    const returnButton = screen.getByRole('button', { name: /trả sách/i });
    expect(returnButton).toBeInTheDocument();

    userEvent.click(returnButton);

    expect(handleReturn).toHaveBeenCalledTimes(1);
    expect(handleReturn).toHaveBeenCalledWith('b-cntt-1');
  });
});
