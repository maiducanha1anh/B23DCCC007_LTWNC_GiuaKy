import React, { useEffect, useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchBooks, borrowBook, returnBook } from '../features/books/booksSlice';
import { useFilterStore, CategoryFilter } from '../store/filterStore';
import { FilterBar } from '../components/FilterBar';
import { BookList } from '../features/books/components/BookList';
import { Loader2, AlertCircle, RefreshCw, BookMarked, CheckCircle2 } from 'lucide-react';

interface HomePageProps {
  simulateApiError: boolean;
}

/**
 * TRANG CHỦ — TRA CỨU VÀ MƯỢN/TRẢ SÁCH
 * Áp dụng tối ưu hiệu năng: useMemo tính danh sách sau lọc, useCallback cho các handler mượn/trả
 */
export const HomePage: React.FC<HomePageProps> = ({ simulateApiError }) => {
  const dispatch = useAppDispatch();
  const { books, borrowedBookIds, status, error } = useAppSelector(
    (state) => state.books
  );

  const { searchQuery, selectedCategory } = useFilterStore();

  // 1. Khi khởi động app, lấy danh sách sách từ API giả lập (trễ 500ms)
  useEffect(() => {
    // Chỉ tải nếu chưa từng tải (status === 'idle')
    if (status === 'idle') {
      dispatch(fetchBooks(simulateApiError));
    }
  }, [dispatch, status, simulateApiError]);

  const handleRetryFetch = () => {
    dispatch(fetchBooks(simulateApiError));
  };

  // BUỔI 5: Tối ưu hoá các handler bằng useCallback truyền xuống component con
  const handleBorrow = useCallback(
    (bookId: string) => {
      dispatch(borrowBook(bookId));
    },
    [dispatch]
  );

  const handleReturn = useCallback(
    (bookId: string) => {
      dispatch(returnBook(bookId));
    },
    [dispatch]
  );

  // BUỔI 5: Tối ưu hiệu năng — Danh sách sau khi lọc được tính toán bằng useMemo
  const filteredBooks = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return books.filter((book) => {
      // Lọc theo thể loại
      const matchesCategory =
        selectedCategory === 'Tất cả' || book.category === selectedCategory;

      // Tìm kiếm theo tên hoặc tác giả (không phân biệt hoa thường)
      const matchesSearch =
        !q ||
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [books, selectedCategory, searchQuery]);

  // Tính số lượng sách cho từng category bằng useMemo
  const categoryCounts = useMemo<Record<CategoryFilter, number>>(() => {
    const counts: Record<CategoryFilter, number> = {
      'Tất cả': books.length,
      'CNTT': 0,
      'Kinh tế': 0,
      'Ngoại ngữ': 0,
    };
    books.forEach((book) => {
      if (book.category in counts) {
        counts[book.category]++;
      }
    });
    return counts;
  }, [books]);

  // Danh sách các cuốn sách đang được mượn
  const borrowedBooksList = useMemo(() => {
    return books.filter((book) => borrowedBookIds.includes(book.id));
  }, [books, borrowedBookIds]);

  return (
    <div className="page-container">
      {/* Banner giới thiệu */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Thư viện Chuyên ngành Khoa CNTT</h1>
          <p className="hero-subtitle">
            Hệ thống tra cứu, theo dõi tồn kho và mượn/trả sách trực tuyến dành cho sinh viên và giảng viên.
          </p>
        </div>
      </section>

      {/* Hiển thị danh sách các cuốn sách đang mượn (nếu có) */}
      {borrowedBooksList.length > 0 && (
        <section className="borrowed-shelf-section">
          <div className="shelf-header">
            <div className="shelf-title-group">
              <BookMarked className="shelf-icon" size={22} />
              <h2 className="shelf-title">Sách bạn đang mượn ({borrowedBooksList.length}/3)</h2>
            </div>
            <span className="shelf-badge">
              <CheckCircle2 size={14} className="inline-icon" /> Đang lưu hành
            </span>
          </div>

          <div className="borrowed-items-grid">
            {borrowedBooksList.map((book) => (
              <div key={book.id} className="borrowed-item-card">
                <div className="borrowed-item-info">
                  <span className="borrowed-item-category">{book.category}</span>
                  <h4 className="borrowed-item-title">{book.title}</h4>
                  <p className="borrowed-item-author">{book.author}</p>
                </div>
                <button
                  type="button"
                  className="btn btn-return btn-sm"
                  onClick={() => handleReturn(book.id)}
                >
                  Trả sách
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bộ lọc và tìm kiếm */}
      <FilterBar
        totalCount={books.length}
        categoryCounts={categoryCounts}
      />

      {/* Trạng thái Tải dữ liệu */}
      {status === 'loading' && (
        <div className="loading-state-container">
          <Loader2 className="loading-spinner" size={42} />
          <h3 className="loading-title">Đang tải danh sách sách từ thư viện...</h3>
          <p className="loading-subtitle">Vui lòng chờ trong giây lát (mô phỏng độ trễ 500ms)</p>
        </div>
      )}

      {/* Trạng thái Lỗi khi gọi API */}
      {status === 'failed' && (
        <div className="error-state-container" role="alert">
          <div className="error-icon-wrapper">
            <AlertCircle size={40} className="error-icon" />
          </div>
          <h3 className="error-title">Không thể tải danh sách sách!</h3>
          <p className="error-message">{error}</p>
          <button
            type="button"
            className="btn btn-retry"
            onClick={handleRetryFetch}
          >
            <RefreshCw size={16} className="inline-icon" /> Thử lại ngay
          </button>
        </div>
      )}

      {/* Danh sách sách (khi đã tải thành công) */}
      {status === 'succeeded' && (
        <section className="books-section">
          <div className="books-section-header">
            <h2 className="section-title">
              {selectedCategory === 'Tất cả' ? 'Tất cả các đầu sách' : `Sách thể loại ${selectedCategory}`}
              <span className="books-count-chip">({filteredBooks.length} cuốn)</span>
            </h2>
          </div>

          <BookList
            books={filteredBooks}
            borrowedBookIds={borrowedBookIds}
            onBorrow={handleBorrow}
            onReturn={handleReturn}
          />
        </section>
      )}
    </div>
  );
};
