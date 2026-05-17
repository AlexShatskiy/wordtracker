import type { Metadata } from 'next'
import { ThemeProvider } from '../components/ThemeProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'WordTracker',
  description: 'Bilingual EN ↔ RU dictionary',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t)})()`,
          }}
        />
      </head>
      <body className="h-full bg-[var(--bg-base)]">
        <ThemeProvider>
          <div className="h-full flex justify-center">
            <div className="w-full max-w-[390px] h-full flex flex-col bg-[var(--bg-screen)] relative">
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
