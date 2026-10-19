import React from 'react';
import { Book } from '../booksTypes';
import { BookCard } from './BookCard';
import { SearchX } from 'lucide-react';

interface BookListProps {
  books: Book[];
  borrowedBookIds: string[];
  onBorrow: (bookId: string) => void;
  onReturn: (bookId: string) => void;
}

/**
 * BUỔI 5 — DANH SÁCH SÁCH
 * Sử dụng key={book.id} (không dùng index)
 * Render các BookCard đã được bọc React.memo
 * Nhận onBorrow, onReturn từ cha (đã được memo bằng useCallback)
 */
export const BookList: React.FC<BookListProps> = ({
  books,
  borrowedBookIds,
  onBorrow,
  onReturn,
}) => {
  if (books.length === 0) {
    return (
      <div className="empty-books-state">
        <div className="empty-icon-wrapper">
          <SearchX size={48} className="empty-icon" />
        </div>
        <h3 className="empty-title">Không tìm thấy sách phù hợp</h3>
        <p className="empty-description">
          Vui lòng thử đổi từ khoá tìm kiếm hoặc chọn thể loại khác.
        </p>
      </div>
    );
  }

  return (
    <div className="books-grid">
      {books.map((book) => {
        const isBorrowed = borrowedBookIds.includes(book.id);

        return (
          <BookCard
            key={book.id} /* Tuân thủ tuyệt đối: key không dùng index mà dùng ID duy nhất của sách */
            book={book}
            isBorrowed={isBorrowed}
            onBorrow={onBorrow}
            onReturn={onReturn}
          />
        );
      })}
    </div>
  );
};
