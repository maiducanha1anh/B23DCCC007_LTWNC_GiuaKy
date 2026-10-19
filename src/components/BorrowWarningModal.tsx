import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearBorrowWarning } from '../features/books/booksSlice';
import { AlertCircle, X } from 'lucide-react';

/**
 * BUỔI 4 — MODAL/BANNER CẢNH BÁO GIỚI HẠN MƯỢN SÁCH
 * Hiển thị khi Middleware Redux bắt gặp sinh viên mượn quá 3 cuốn sách
 */
export const BorrowWarningModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const warning = useAppSelector((state) => state.books.borrowWarning);

  if (!warning) return null;

  return (
    <div className="warning-toast-container" role="alert" aria-live="assertive">
      <div className="warning-toast">
        <div className="warning-toast-icon">
          <AlertCircle size={22} />
        </div>
        <div className="warning-toast-content">
          <h4 className="warning-toast-title">Giới hạn mượn sách</h4>
          <p className="warning-toast-message">{warning}</p>
        </div>
        <button
          type="button"
          className="warning-toast-close"
          onClick={() => dispatch(clearBorrowWarning())}
          aria-label="Đóng cảnh báo"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};
