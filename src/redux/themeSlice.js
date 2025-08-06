import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDark: false,
  isThemeLoaded: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.isDark = action.payload;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('theme', JSON.stringify(action.payload));
        } catch (error) {
          console.warn('Failed to save theme to localStorage:', error);
        }
      }
    },
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('theme', JSON.stringify(state.isDark));
        } catch (error) {
          console.warn('Failed to save theme to localStorage:', error);
        }
      }
    },
    setThemeLoaded: (state, action) => {
      state.isThemeLoaded = action.payload;
    },
    initializeTheme: (state) => {
      if (typeof window !== 'undefined') {
        try {
          const savedTheme = localStorage.getItem('theme');
          if (savedTheme !== null && savedTheme !== 'undefined') {
            state.isDark = JSON.parse(savedTheme);
          } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            state.isDark = prefersDark;
          }
        } catch (error) {
          // If there's an error parsing, fall back to system preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          state.isDark = prefersDark;
        }
        state.isThemeLoaded = true;
      }
    },
  },
});

export const { setTheme, toggleTheme, setThemeLoaded, initializeTheme } = themeSlice.actions;
export default themeSlice.reducer;