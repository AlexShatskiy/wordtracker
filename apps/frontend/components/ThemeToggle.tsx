'use client'
import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--tx-hint)] hover:text-[var(--tx-muted)] transition-colors"
    >
      {theme === 'light' ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M8 1.5V3M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M3.4 12.6l1.1-1.1M11.5 4.5l1.1-1.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 9.5A5.5 5.5 0 0 1 6 2.5c0-.1 0-.2.01-.3A6 6 0 1 0 13.3 9.5c-.1 0-.2.01-.3.01z" fill="currentColor"/>
        </svg>
      )}
    </button>
  )
}
