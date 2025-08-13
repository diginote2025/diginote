"use client"

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { initializeTheme, toggleTheme, setTheme } from '@/redux/themeSlice';

export const useTheme = () => {
  const dispatch = useDispatch();
  const { isDark, isThemeLoaded } = useSelector((state) => state.theme);

  // Initialize theme on first load
  useEffect(() => {
    if (!isThemeLoaded) {
      dispatch(initializeTheme());
    }
  }, [dispatch, isThemeLoaded]);

  // Apply theme to DOM whenever it changes
  useEffect(() => {
    if (isThemeLoaded) {
      const root = document.documentElement;
      
      if (isDark) {
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
      }
    }
  }, [isDark, isThemeLoaded]);

  return {
    isDark,
    isThemeLoaded,
    toggleTheme: () => dispatch(toggleTheme()),
    setTheme: (theme) => dispatch(setTheme(theme)),
  };
};