import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { returnBook } from '../features/books/booksSlice';
import { BookCategory, CategoryStats } from '../features/books/booksTypes';
import {
  BarChart3,
  BookOpen,
  BookMarked,
  Layers,
  ArrowLeft,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';

/**
 * BUỔI 5 — TRANG THỐNG KÊ (LAZY LOADED ROUTE /stats)
 * Hiển thị số đầu sách theo từng thể loại và số sách đang mượn.
 * Dùng Utility Type CategoryStats = Record<BookCategory, number> từ Buổi 1.
 */
const StatsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { books, borrowedBookIds } = useAppSelector((state) => state.books);

  // Tính số lượng đầu sách theo từng thể loại dùng Utility Type CategoryStats
  const categoryStats = useMemo<CategoryStats>(() => {
    const stats: CategoryStats = {
      'CNTT': 0,
      'Kinh tế': 0,
      'Ngoại ngữ': 0,
    };

    books.forEach((book) => {
      if (book.category in stats) {
        stats[book.category]++;
      }
    });

    return stats;
  }, [books]);

  // Thống kê tổng số lượng bản sách
  const totalCopiesCount = useMemo(() => {
    return books.reduce((sum, b) => sum + b.totalCopies, 0);
  }, [books]);

  const availableCopiesCount = useMemo(() => {
    return books.reduce((sum, b) => sum + b.availableCopies, 0);
  }, [books]);

  // Danh sách các cuốn sách đang mượn
  const borrowedBooks = useMemo(() => {
    return books.filter((book) => borrowedBookIds.includes(book.id));
  }, [books, borrowedBookIds]);

  const handleReturn = (bookId: string) => {
    dispatch(returnBook(bookId));
  };

  const categories: BookCategory[] = ['CNTT', 'Kinh tế', 'Ngoại ngữ'];

  return (
    <div className="page-container stats-page">
      {/* Header trang Thống kê */}
      <div className="stats-header">
        <div>
          <Link to="/" className="back-link">
            <ArrowLeft size={16} className="inline-icon" /> Quay lại Thư viện
          </Link>
          <h1 className="stats-main-title">
            <BarChart3 className="stats-title-icon" size={32} />
            Báo cáo & Thống kê Thư viện
          </h1>
          <p className="stats-main-subtitle">
            Tổng quan dữ liệu kho sách theo chuyên ngành và tình trạng lưu hành sách của sinh viên.
          </p>
        </div>
      </div>

      {/* 4 Thẻ chỉ số tổng quan (KPI Cards) */}
      <div className="stats-kpi-grid">
        <div className="kpi-card card-blue">
          <div className="kpi-icon-wrapper">
            <BookOpen size={24} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Tổng đầu sách</span>
            <span className="kpi-value">{books.length}</span>
            <span className="kpi-subtext">3 chuyên ngành chính</span>
          </div>
        </div>

        <div className="kpi-card card-purple">
          <div className="kpi-icon-wrapper">
            <BookMarked size={24} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Số sách đang mượn</span>
            <span className="kpi-value">{borrowedBookIds.length} / 3</span>
            <span className="kpi-subtext">
              {borrowedBookIds.length >= 3 ? 'Đã đạt giới hạn tối đa' : `Còn mượn được ${3 - borrowedBookIds.length} cuốn`}
            </span>
          </div>
        </div>

        <div className="kpi-card card-emerald">
          <div className="kpi-icon-wrapper">
            <Layers size={24} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Tổng số bản trong kho</span>
            <span className="kpi-value">{totalCopiesCount}</span>
            <span className="kpi-subtext">Bản in lưu trữ</span>
          </div>
        </div>

        <div className="kpi-card card-amber">
          <div className="kpi-icon-wrapper">
            <TrendingUp size={24} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Sẵn sàng phục vụ</span>
            <span className="kpi-value">{availableCopiesCount}</span>
            <span className="kpi-subtext">
              {totalCopiesCount > 0
                ? `${Math.round((availableCopiesCount / totalCopiesCount) * 100)}% có thể mượn ngay`
                : '0%'}
            </span>
          </div>
        </div>
      </div>

      <div className="stats-content-grid">
        {/* Phân bố theo thể loại */}
        <section className="stats-section-box">
          <h2 className="stats-box-title">
            <Layers size={20} className="inline-icon text-accent" /> Phân bố đầu sách theo thể loại
          </h2>
          <p className="stats-box-description">
            Số lượng đầu sách và tỷ trọng theo từng chuyên ngành của thư viện khoa.
          </p>

          <div className="category-stats-list">
            {categories.map((cat) => {
              const count = categoryStats[cat];
              const percentage = books.length > 0 ? Math.round((count / books.length) * 100) : 0;

              return (
                <div key={cat} className="category-stat-item">
                  <div className="category-stat-row">
                    <span className="category-stat-name">
                      Chuyên ngành {cat}
                    </span>
                    <span className="category-stat-count">
                      <strong>{count}</strong> đầu sách ({percentage}%)
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className={`progress-fill progress-${cat.toLowerCase().replace(/\s+/g, '')}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Danh sách các cuốn sách đang mượn */}
        <section className="stats-section-box">
          <h2 className="stats-box-title">
            <BookMarked size={20} className="inline-icon text-accent" /> Danh sách sách bạn đang mượn
          </h2>
          <p className="stats-box-description">
            Theo dõi các đầu sách đang giữ và tiến hành trả sách trực tiếp.
          </p>

          {borrowedBooks.length === 0 ? (
            <div className="empty-borrowed-box">
              <CheckCircle size={36} className="text-success" />
              <p>Hiện bạn không mượn cuốn sách nào.</p>
              <Link to="/" className="btn btn-primary btn-sm mt-2">
                Đến thư viện mượn sách
              </Link>
            </div>
          ) : (
            <div className="borrowed-stats-list">
              {borrowedBooks.map((book) => (
                <div key={book.id} className="borrowed-stat-card">
                  <div className="borrowed-stat-content">
                    <span className="borrowed-stat-tag">{book.category}</span>
                    <h4 className="borrowed-stat-title">{book.title}</h4>
                    <p className="borrowed-stat-author">Tác giả: {book.author}</p>
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
          )}
        </section>
      </div>
    </div>
  );
};

export default StatsPage;
