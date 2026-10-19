import React from 'react';
import { Book } from '../booksTypes';
import { BookOpen, Calendar, User, CheckCircle, AlertTriangle } from 'lucide-react';

export interface BookCardProps {
  book: Book;
  isBorrowed: boolean;
  onBorrow: (bookId: string) => void;
  onReturn: (bookId: string) => void;
}

/**
 * BUỔI 5 — TỐI ƯU HIỆU NĂNG VỚI REACT.MEMO
 * Component hiển thị thông tin 1 cuốn sách được bọc bằng React.memo
 * để ngăn chặn re-render không cần thiết khi các cuốn sách khác thay đổi.
 */
export const BookCard: React.FC<BookCardProps> = React.memo(({
  book,
  isBorrowed,
  onBorrow,
  onReturn,
}) => {
  const isOutOfStock = book.availableCopies <= 0;

  // Lựa chọn màu sắc badge theo từng thể loại
  const getCategoryBadgeClass = (category: Book['category']) => {
    switch (category) {
      case 'CNTT':
        return 'badge-cntt';
      case 'Kinh tế':
        return 'badge-kinhte';
      case 'Ngoại ngữ':
        return 'badge-ngoaingu';
      default:
        return 'badge-default';
    }
  };

  return (
    <article
      data-testid={`book-card-${book.id}`}
      className={`book-card ${isBorrowed ? 'border-borrowed' : ''}`}
    >
      <div className="book-card-header">
        <span className={`category-badge ${getCategoryBadgeClass(book.category)}`}>
          {book.category}
        </span>
        <span className="published-year">
          <Calendar size={14} className="inline-icon" /> {book.publishedYear}
        </span>
      </div>

      <h3 className="book-title" title={book.title}>
        {book.title}
      </h3>

      <div className="book-meta">
        <p className="book-author">
          <User size={15} className="inline-icon text-muted" />
          <span>{book.author}</span>
        </p>

        {book.description && (
          <p className="book-description">
            {book.description}
          </p>
        )}
      </div>

      <div className="book-card-footer">
        <div className="copies-info">
          <span className="copies-label">Số bản còn lại:</span>
          <span
            data-testid={`available-copies-${book.id}`}
            className={`copies-count ${
              isOutOfStock ? 'text-danger' : book.availableCopies <= 2 ? 'text-warning' : 'text-success'
            }`}
          >
            {isOutOfStock ? (
              <span className="stock-pill stock-out">
                <AlertTriangle size={13} className="inline-icon" /> Hết bản
              </span>
            ) : (
              <span className="stock-pill stock-available">
                {book.availableCopies} / {book.totalCopies} cuốn
              </span>
            )}
          </span>
        </div>

        <div className="card-actions">
          {isBorrowed ? (
            <button
              type="button"
              className="btn btn-return"
              onClick={() => onReturn(book.id)}
              aria-label={`Trả sách ${book.title}`}
            >
              <CheckCircle size={16} className="inline-icon" /> Trả sách
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-borrow"
              disabled={isOutOfStock}
              onClick={() => onBorrow(book.id)}
              aria-label={`Mượn sách ${book.title}`}
            >
              <BookOpen size={16} className="inline-icon" />
              {isOutOfStock ? 'Hết bản' : 'Mượn sách'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
});

BookCard.displayName = 'BookCard';
