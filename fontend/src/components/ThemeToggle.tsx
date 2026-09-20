import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`h-8 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer border select-none ${
        isDark
          ? 'bg-[#141414] hover:bg-[#202020] text-amber-300 hover:text-amber-200 border-[#262626] shadow-xs'
          : 'bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569] hover:text-[#0b1c30] border-[#E2E8F0] shadow-xs'
      } ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <span className="material-symbols-outlined text-[17px] transition-transform duration-300">
        {isDark ? 'light_mode' : 'dark_mode'}
      </span>
      {showLabel && (
        <span className="text-xs font-semibold">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
};
