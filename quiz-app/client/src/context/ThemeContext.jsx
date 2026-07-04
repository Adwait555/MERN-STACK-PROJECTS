import { createContext, useContext, useEffect, useState } from 'react';
import { themes, defaultTheme } from '../theme';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themeKey, setThemeKey] = useState(() => localStorage.getItem('theme') || defaultTheme);

  useEffect(() => {
    const t = themes[themeKey] || themes[defaultTheme];
    const root = document.documentElement;
    root.style.setProperty('--primary', t.primary);
    root.style.setProperty('--primary-dark', t.primaryDark);
    root.style.setProperty('--accent', t.accent);
    root.style.setProperty('--accent-soft', t.accentSoft);
    root.style.setProperty('--wallpaper-a', t.wallpaperA);
    root.style.setProperty('--wallpaper-b', t.wallpaperB);
    root.style.setProperty('--wallpaper-c', t.wallpaperC);
    root.style.setProperty('--card-bg', t.cardBg);
    root.style.setProperty('--text', t.text);
    root.style.setProperty('--text-soft', t.textSoft);
    root.style.setProperty('--border', t.border);
    root.setAttribute('data-theme', themeKey);
    root.classList.toggle('theme-dark', !!t.dark);
    localStorage.setItem('theme', themeKey);
  }, [themeKey]);

  return (
    <ThemeContext.Provider value={{ themeKey, setThemeKey, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
