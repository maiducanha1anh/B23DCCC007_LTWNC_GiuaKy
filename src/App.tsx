import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { BorrowWarningModal } from './components/BorrowWarningModal';
import { Loader2 } from 'lucide-react';
import './App.css';

/**
 * BUỔI 5 — TỐI ƯU HIỆU NĂNG VỚI REACT.LAZY + SUSPENSE
 * Trang Thống kê (/stats) được tải theo cơ chế lazy load,
 * chỉ tải mã nguồn khi người dùng thực sự chuyển đến route này.
 */
const StatsPage = lazy(() => import('./pages/StatsPage'));

const SuspenseFallback: React.FC = () => (
  <div className="suspense-loading-container">
    <Loader2 className="loading-spinner" size={36} />
    <p>Đang tải trang Thống kê (Lazy Loading)...</p>
  </div>
);

export const App: React.FC = () => {
  // State giả lập lỗi API để phục vụ kiểm thử và chấm điểm chức năng 1
  const [simulateApiError, setSimulateApiError] = useState<boolean>(false);

  const toggleSimulateError = () => {
    setSimulateApiError((prev) => !prev);
  };

  return (
    <BrowserRouter>
      <div className="app-layout">
        {/* Thanh điều hướng chính */}
        <Navbar
          simulateApiError={simulateApiError}
          onToggleSimulateError={toggleSimulateError}
        />

        {/* Cảnh báo Toast khi Middleware Redux phát hiện mượn quá 3 cuốn */}
        <BorrowWarningModal />

        {/* Nội dung trang */}
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage simulateApiError={simulateApiError} />} />
            <Route
              path="/stats"
              element={
                <Suspense fallback={<SuspenseFallback />}>
                  <StatsPage />
                </Suspense>
              }
            />
            {/* Route fallback về trang chủ */}
            <Route path="*" element={<HomePage simulateApiError={simulateApiError} />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <div className="footer-container">
            <p className="footer-text">
              © 2026 Mini Library — Đồ án Kiểm tra giữa kỳ Lập trình Web Nâng cao (RIPT1411-20261-01)
            </p>
            <p className="footer-credits">
              Công nghệ: TypeScript • React (Hooks & Patterns) • Redux Toolkit • Zustand • RTL & Jest
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
