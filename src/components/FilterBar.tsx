import React, { useState, useEffect } from 'react';
import { useFilterStore, CategoryFilter } from '../store/filterStore';
import { useDebounce } from '../hooks/useDebounce';
import { Search, X, Filter } from 'lucide-react';
import { BookCategory } from '../features/books/booksTypes';

const CATEGORIES: CategoryFilter[] = ['Tất cả', 'CNTT', 'Kinh tế', 'Ngoại ngữ'];

interface FilterBarProps {
  totalCount: number;
  categoryCounts: Record<CategoryFilter, number>;
}

/**
 * BUỔI 2 & 4 — FILTER BAR DÙNG ZUSTAND VÀ GENERIC useDebounce
 * Quản lý tìm kiếm theo tên/tác giả (debounce 300ms) và lọc thể loại
 */
export const FilterBar: React.FC<FilterBarProps> = ({ categoryCounts }) => {
  // Lấy state và action từ Zustand store
  const { searchQuery, selectedCategory, setSearchQuery, setSelectedCategory, resetFilters } =
    useFilterStore();

  // State cục bộ để ô input phản hồi ngay lập tức khi người dùng gõ
  const [localInput, setLocalInput] = useState<string>(searchQuery);

  // Áp dụng custom hook generic useDebounce với độ trễ 300ms theo yêu cầu đề bài
  const debouncedSearchTerm = useDebounce<string>(localInput, 300);

  // Đồng bộ giá trị đã debounce vào Zustand store
  useEffect(() => {
    setSearchQuery(debouncedSearchTerm);
  }, [debouncedSearchTerm, setSearchQuery]);

  const handleClearSearch = () => {
    setLocalInput('');
    setSearchQuery('');
  };

  return (
    <div className="filter-bar-container">
      {/* Ô tìm kiếm có Debounce 300ms */}
      <div className="search-input-wrapper">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          className="search-input"
          placeholder="Tìm sách theo tên hoặc tác giả..."
          value={localInput}
          onChange={(e) => setLocalInput(e.target.value)}
          aria-label="Tìm kiếm sách theo tên hoặc tác giả"
        />
        {localInput && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={handleClearSearch}
            aria-label="Xoá từ khoá tìm kiếm"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Bộ lọc thể loại: Tất cả / CNTT / Kinh tế / Ngoại ngữ */}
      <div className="category-filter-wrapper">
        <div className="category-filter-label">
          <Filter size={15} className="inline-icon" /> Thể loại:
        </div>
        <div className="category-tabs" role="tablist">
          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat] ?? 0;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`category-tab-btn ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat as CategoryFilter | BookCategory)}
              >
                <span>{cat}</span>
                <span className="category-count-badge">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nút reset bộ lọc nếu đang áp dụng lọc */}
      {(localInput || selectedCategory !== 'Tất cả') && (
        <button
          type="button"
          className="btn-reset-filters"
          onClick={() => {
            setLocalInput('');
            resetFilters();
          }}
        >
          Đặt lại bộ lọc
        </button>
      )}
    </div>
  );
};
