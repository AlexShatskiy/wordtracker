import type { Metadata } from 'next'
import { ThemeProvider } from '../components/ThemeProvider'
import { PairProvider } from '../lib/PairContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'WordTracker',
  description: 'Bilingual EN ↔ RU ↔ PL dictionary',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'WordTracker',
  },
  formatDetection: { telephone: false },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t)})()`,
          }}
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="h-full bg-[var(--bg-base)]">
        <ThemeProvider>
          <PairProvider>
            <div className="h-full flex justify-center">
              <div className="w-full max-w-[390px] h-full flex flex-col bg-[var(--bg-screen)] relative">
                {children}
              </div>
            </div>
          </PairProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
