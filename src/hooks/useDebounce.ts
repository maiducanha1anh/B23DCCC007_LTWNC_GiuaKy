import { useState, useEffect } from 'react';

/**
 * BUỔI 2 & 5 — CUSTOM HOOK NÂNG CAO (GENERIC useDebounce)
 * Nhận giá trị kiểu T và thời gian delay (ms), trả về giá trị debounced sau khoảng delay.
 *
 * @param value Giá trị cần debounce (generic type T)
 * @param delay Thời gian chờ (milliseconds)
 * @returns Giá trị sau khi debounce
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Thiết lập timer cập nhật debouncedValue sau khoảng thời gian delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Dọn dẹp timer nếu value thay đổi trước khi hết thời gian chờ
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
