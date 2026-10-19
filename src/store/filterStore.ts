import { create } from 'zustand';
import { BookCategory } from '../features/books/booksTypes';

/**
 * BUỔI 4 — ZUSTAND STATE MANAGEMENT
 * Quản lý trạng thái bộ lọc (từ khoá tìm kiếm và thể loại sách đã chọn).
 */

export type CategoryFilter = 'Tất cả' | BookCategory;

export interface FilterState {
  searchQuery: string;
  selectedCategory: CategoryFilter;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: CategoryFilter) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  searchQuery: '',
  selectedCategory: 'Tất cả',
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setSelectedCategory: (category: CategoryFilter) => set({ selectedCategory: category }),
  resetFilters: () => set({ searchQuery: '', selectedCategory: 'Tất cả' }),
}));
