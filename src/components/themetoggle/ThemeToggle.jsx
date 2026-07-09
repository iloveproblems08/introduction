import { useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'portfolio-theme';

/**
 * Reads the visitor's OS-level preference.
 * Falls back to 'dark' in non-browser environments (SSR).
 */
function getSystemTheme() {
  if (typeof window === 'undefined' || !window.matchMedia) return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

/**
 * Resolves the theme to use on first paint:
 *   1. an explicit choice saved earlier in this browser, or
 *   2. the OS default, if the visitor has never toggled before.
 */
function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return getSystemTheme();
}

/**
 * Call once, as early as possible (e.g. top of main.jsx before render),
 * to stamp the theme onto <html> before React mounts and avoid a
 * flash of the wrong theme:
 *
 *   import { applyInitialTheme } from './ThemeToggle';
 *   applyInitialTheme();
 */
export function applyInitialTheme() {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', getInitialTheme());
}

/**
 * Black/white theme switch.
 * - Defaults to the visitor's OS preference (prefers-color-scheme).
 * - Once toggled, the explicit choice is saved to localStorage and
 *   takes over from the OS default on every future visit.
 * - If the visitor never toggles, the theme keeps following the OS
 *   setting live (e.g. their system switches to dark at sunset).
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme);

  // Apply the theme to <html data-theme="..."> whenever it changes.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Follow the OS setting live, but only until the visitor makes an
  // explicit choice of their own (i.e. nothing saved in localStorage yet).
  useEffect(() => {
    if (!window.matchMedia) return;
    const media = window.matchMedia('(prefers-color-scheme: light)');

    const handleChange = (e) => {
      const hasExplicitChoice = window.localStorage.getItem(STORAGE_KEY);
      if (!hasExplicitChoice) {
        setTheme(e.matches ? 'light' : 'dark');
      }
    };

    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={toggleTheme}
      style={styles.track(isDark)}
    >
      <span style={styles.thumb(isDark)}>
        {isDark ? (
          // Moon glyph
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
              fill="#0a0a0f"
            />
          </svg>
        ) : (
          // Sun glyph
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="4.5" fill="#fafafc" />
            <g stroke="#fafafc" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2v2.2M12 19.8V22M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2 12h2.2M19.8 12H22M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
            </g>
          </svg>
        )}
      </span>
    </button>
  );
}

const styles = {
  track: (isDark) => ({
    position: 'relative',
    width: '52px',
    height: '30px',
    padding: '3px',
    borderRadius: '999px',
    border: '1px solid var(--border-strong)',
    background: isDark
      ? 'linear-gradient(135deg, #1b1b24, #131319)'
      : 'linear-gradient(135deg, #f1f1f6, #ffffff)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: isDark ? 'flex-start' : 'flex-end',
    transition: 'background 0.35s ease, justify-content 0.35s ease',
    boxShadow: 'var(--shadow-sm)',
  }),
  thumb: (isDark) => ({
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: isDark
      ? 'linear-gradient(135deg, #6d5ffd, #b968e8)'
      : 'linear-gradient(135deg, #ffe9a8, #ffb648)',
    transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), background 0.35s ease',
    boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
  }),
};