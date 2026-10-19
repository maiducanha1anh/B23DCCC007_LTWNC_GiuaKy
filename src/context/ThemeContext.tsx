import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

/**
 * BUỔI 4 — CONTEXT NÂNG CAO (THEME CONTEXT)
 * Quản lý chế độ sáng/tối với useMemo cho value và custom hook useTheme.
 */

export type ThemeMode = 'light' | 'dark';

export interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Đọc theme từ localStorage nếu có, mặc định là 'light'
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('mini_library_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return 'light';
  });

  // Đồng bộ theme với class trên phần tử html và lưu vào localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('mini_library_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Tối ưu hóa Context Value bằng useMemo để tránh re-render không cần thiết cho các component con
  const contextValue = useMemo<ThemeContextType>(() => {
    return {
      theme,
      toggleTheme,
      isDarkMode: theme === 'dark',
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook useTheme để các component dễ dàng truy cập và chuyển đổi giao diện sáng/tối
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme phải được sử dụng bên trong ThemeProvider');
  }
  return context;
};
