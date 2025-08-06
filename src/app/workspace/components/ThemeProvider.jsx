"use client"

import { useTheme } from '../hooks/useTheme';

const ThemeProvider = ({ children }) => {
  const { isThemeLoaded } = useTheme();

  // Show loading state until theme is determined
  if (!isThemeLoaded) {
    return (
      <div className="">
       
      </div>
    );
  }

  return <>{children}</>;
};

export default ThemeProvider;