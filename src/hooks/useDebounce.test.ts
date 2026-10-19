import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce Custom Hook (Buổi 2 & 6)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('trì hoãn cập nhật giá trị cho đến khi hết thời gian delay định trước', () => {
    // Khởi tạo hook với giá trị ban đầu 'React' và delay 300ms
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) => useDebounce(value, delay),
      {
        initialProps: { value: 'React', delay: 300 },
      }
    );

    // Ban đầu giá trị debounced phải là 'React'
    expect(result.current).toBe('React');

    // Cập nhật props với giá trị mới 'TypeScript'
    rerender({ value: 'TypeScript', delay: 300 });

    // Khi thời gian trôi qua 150ms (< 300ms), giá trị debounced vẫn chưa thay đổi
    act(() => {
      jest.advanceTimersByTime(150);
    });
    expect(result.current).toBe('React');

    // Tua tiếp 150ms nữa (tổng cộng 300ms)
    act(() => {
      jest.advanceTimersByTime(150);
    });

    // Lúc này giá trị debounced đã được cập nhật thành 'TypeScript'
    expect(result.current).toBe('TypeScript');
  });

  test('huỷ timer cũ nếu giá trị thay đổi liên tục trước khi timeout', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) => useDebounce(value, delay),
      {
        initialProps: { value: 'A', delay: 300 },
      }
    );

    rerender({ value: 'B', delay: 300 });
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Cập nhật tiếp sang 'C' trước khi 'B' kịp hoàn tất
    rerender({ value: 'C', delay: 300 });
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Chưa đủ 300ms kể từ lần đổi sang 'C' -> vẫn là 'A'
    expect(result.current).toBe('A');

    // Tua tiếp 100ms nữa (đủ 300ms cho 'C')
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current).toBe('C');
  });
});
