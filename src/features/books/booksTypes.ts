/**
 * BUỔI 1 — TYPESCRIPT NÂNG CAO (GENERIC, UTILITY TYPES, TYPE GUARD)
 * Không dùng 'any' ở bất kỳ đâu.
 */

// Định nghĩa thể loại sách theo yêu cầu đề bài
export type BookCategory = 'CNTT' | 'Kinh tế' | 'Ngoại ngữ';

// Kiểu dữ liệu chính cho sách trong thư viện
export interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  publishedYear: number;
  availableCopies: number;
  totalCopies: number;
  description?: string;
}

// ==========================================
// UTILITY TYPES (Dùng trên 2 Utility Types)
// ==========================================

// 1. Utility Type 'Pick': Trích xuất các trường tóm tắt thông tin sách
export type BookSummary = Pick<Book, 'id' | 'title' | 'author' | 'category'>;

// 2. Utility Type 'Omit' & 'Readonly': Tạo thông tin sách được mượn không bao gồm availableCopies
export type BorrowRecord = Readonly<Omit<Book, 'availableCopies'> & { borrowedAt: string }>;

// 3. Utility Type 'Record': Thống kê số lượng sách theo từng thể loại
export type CategoryStats = Record<BookCategory, number>;

// 4. Utility Type 'Partial' & 'Pick': Dùng cho các tiêu chí tìm kiếm/lọc tuỳ chọn
export type BookFilterCriteria = Partial<Pick<Book, 'category' | 'title' | 'author'>>;

// ==========================================
// GENERIC API RESPONSE & TYPE GUARDS
// ==========================================

// Generic response type chuẩn theo yêu cầu: { ok: true; data: T } | { ok: false; error: string }
export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

// Type Guard kiểm tra phản hồi thành công
export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is { ok: true; data: T } {
  return response.ok === true && 'data' in response;
}

// Type Guard kiểm tra phản hồi thất bại
export function isErrorResponse<T>(
  response: ApiResponse<T>
): response is { ok: false; error: string } {
  return response.ok === false && 'error' in response;
}
