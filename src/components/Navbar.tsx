import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAppSelector } from '../store/hooks';
import { BookMarked, Sun, Moon, BarChart3, Library, Bug } from 'lucide-react';

interface NavbarProps {
  simulateApiError: boolean;
  onToggleSimulateError: () => void;
}

/**
 * COMPONENT NAVBAR
 * Điều hướng giữa Trang chủ và Thống kê, chuyển đổi Dark/Light mode và theo dõi số sách đang mượn.
 */
export const Navbar: React.FC<NavbarProps> = ({
  simulateApiError,
  onToggleSimulateError,
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const borrowedBookIds = useAppSelector((state) => state.books.borrowedBookIds);
  const borrowedCount = borrowedBookIds.length;

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <NavLink to="/" className="navbar-brand">
          <div className="brand-icon-wrapper">
            <Library size={24} className="brand-icon" />
          </div>
          <div className="brand-text-wrapper">
            <span className="brand-title">Mini Library</span>
            <span className="brand-subtitle">Khoa CNTT & Quản lý Thư viện</span>
          </div>
        </NavLink>

        {/* Navigation Menu Links */}
        <nav className="navbar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link-active' : ''}`
            }
          >
            <Library size={18} className="inline-icon" />
            <span>Tra cứu & Mượn sách</span>
          </NavLink>

          <NavLink
            to="/stats"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link-active' : ''}`
            }
          >
            <BarChart3 size={18} className="inline-icon" />
            <span>Thống kê</span>
          </NavLink>
        </nav>

        {/* Right Actions: Borrow Badge, API Error Toggle, Theme Switcher */}
        <div className="navbar-actions">
          {/* Badge số sách đang mượn */}
          <div className="borrow-badge-wrapper" title="Số sách bạn đang mượn (Tối đa 3 cuốn)">
            <BookMarked size={18} className="inline-icon" />
            <span className="borrow-badge-label">Đang mượn:</span>
            <span
              className={`borrow-badge-count ${
                borrowedCount >= 3 ? 'borrow-count-max' : borrowedCount > 0 ? 'borrow-count-active' : ''
              }`}
            >
              {borrowedCount}/3 cuốn
            </span>
          </div>

          {/* Toggle mô phỏng lỗi API để phục vụ chấm điểm chức năng 1 */}
          <button
            type="button"
            className={`btn-api-toggle ${simulateApiError ? 'active' : ''}`}
            onClick={onToggleSimulateError}
            title={
              simulateApiError
                ? 'Đang bật chế độ giả lập lỗi API (click để tắt)'
                : 'Bấm để bật chế độ giả lập lỗi API khi tải dữ liệu'
            }
          >
            <Bug size={16} className="inline-icon" />
            <span className="api-toggle-text">
              {simulateApiError ? 'Lỗi API: BẬT' : 'Giả lập lỗi API'}
            </span>
          </button>

          {/* Nút chuyển chế độ sáng / tối (Yêu cầu chức năng 8) */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={isDarkMode ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
            title={isDarkMode ? 'Giao diện Sáng' : 'Giao diện Tối'}
          >
            {isDarkMode ? <Sun size={20} className="theme-icon sun" /> : <Moon size={20} className="theme-icon moon" />}
          </button>
        </div>
      </div>
    </header>
  );
};
