import { Book, ApiResponse } from '../features/books/booksTypes';

// Dữ liệu mẫu danh sách sách chuyên ngành của thư viện khoa
const INITIAL_BOOKS: Book[] = [
  {
    id: 'b1',
    title: 'Cấu trúc dữ liệu và Giải thuật nâng cao',
    author: 'Nguyễn Văn Ất',
    category: 'CNTT',
    publishedYear: 2021,
    availableCopies: 3,
    totalCopies: 5,
    description: 'Giáo trình toàn diện về cấu trúc dữ liệu cây, đồ thị, thuật toán quy hoạch động và tối ưu hoá.',
  },
  {
    id: 'b2',
    title: 'Thiết kế hệ thống phân tán quy mô lớn (System Design)',
    author: 'Alex Xu & Sahn Lam',
    category: 'CNTT',
    publishedYear: 2023,
    availableCopies: 1,
    totalCopies: 4,
    description: 'Hướng dẫn thiết kế các hệ thống backend chịu tải cao, microservices, caching và database sharding.',
  },
  {
    id: 'b3',
    title: 'Lập trình Web hiện đại với React & TypeScript',
    author: 'Dan Abramov & Kent C. Dodds',
    category: 'CNTT',
    publishedYear: 2022,
    availableCopies: 0, // Cuốn này hết bản để test chức năng vô hiệu hoá nút Mượn
    totalCopies: 3,
    description: 'Khám phá các pattern nâng cao trong React: hooks, state management, memoization và testing.',
  },
  {
    id: 'b4',
    title: 'Kinh tế vi mô ứng dụng trong chuyển đổi số',
    author: 'Paul Krugman',
    category: 'Kinh tế',
    publishedYear: 2020,
    availableCopies: 4,
    totalCopies: 6,
    description: 'Phân tích hành vi thị trường, cung cầu và chiến lược định giá trong nền kinh tế số.',
  },
  {
    id: 'b5',
    title: 'Tài chính doanh nghiệp và Quản trị rủi ro',
    author: 'Trần Ngọc Thơ',
    category: 'Kinh tế',
    publishedYear: 2022,
    availableCopies: 2,
    totalCopies: 3,
    description: 'Kiến thức cốt lõi về cấu trúc vốn, dòng tiền, định giá doanh nghiệp và các công cụ phái sinh.',
  },
  {
    id: 'b6',
    title: 'Tiếng Anh chuyên ngành Công nghệ thông tin',
    author: 'Eric H. Glendinning',
    category: 'Ngoại ngữ',
    publishedYear: 2019,
    availableCopies: 5,
    totalCopies: 5,
    description: 'Từ vựng, ngữ pháp và tài liệu đọc hiểu thực tế dành cho kỹ sư phần mềm.',
  },
  {
    id: 'b7',
    title: 'Trí tuệ nhân tạo và Học máy căn bản',
    author: 'Stuart Russell & Peter Norvig',
    category: 'CNTT',
    publishedYear: 2022,
    availableCopies: 2,
    totalCopies: 4,
    description: 'Sách giáo khoa chuẩn mực về Machine Learning, Deep Learning và các thuật toán tìm kiếm thông minh.',
  },
  {
    id: 'b8',
    title: 'Ngữ pháp tiếng Anh thương mại & Kỹ năng đàm phán',
    author: 'David Cotton & Simon Kent',
    category: 'Ngoại ngữ',
    publishedYear: 2021,
    availableCopies: 3,
    totalCopies: 4,
    description: 'Thực hành giao tiếp tiếng Anh trong môi trường kinh doanh quốc tế và hội nghị toàn cầu.',
  },
  {
    id: 'b9',
    title: 'Nguyên lý Marketing thời đại 4.0',
    author: 'Philip Kotler',
    category: 'Kinh tế',
    publishedYear: 2023,
    availableCopies: 0, // Hết bản
    totalCopies: 5,
    description: 'Dịch chuyển từ marketing truyền thống sang digital marketing, cá nhân hóa trải nghiệm khách hàng.',
  },
  {
    id: 'b10',
    title: 'Luyện thi IELTS Academic: Band 7.5+ Masterclass',
    author: 'Rachel Mitchell',
    category: 'Ngoại ngữ',
    publishedYear: 2024,
    availableCopies: 4,
    totalCopies: 4,
    description: 'Chiến thuật toàn diện cho 4 kỹ năng Listening, Reading, Writing và Speaking.',
  },
];

/**
 * API giả lập lấy danh sách sách từ thư viện (trễ 500ms).
 * @param shouldFail Tham số boolean để giả lập trường hợp API thất bại
 * @returns Promise<ApiResponse<Book[]>>
 */
export const fetchBooksApi = (shouldFail: boolean = false): Promise<ApiResponse<Book[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (shouldFail) {
        resolve({
          ok: false,
          error: 'Không thể kết nối đến máy chủ thư viện! Vui lòng kiểm tra kết nối mạng và thử lại.',
        });
      } else {
        // Trả về bản sao của dữ liệu sách
        resolve({
          ok: true,
          data: JSON.parse(JSON.stringify(INITIAL_BOOKS)),
        });
      }
    }, 500);
  });
};
