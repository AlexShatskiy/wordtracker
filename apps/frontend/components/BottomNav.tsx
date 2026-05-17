'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function BottomNav() {
  const pathname = usePathname()
  const isWords = pathname === '/words'

  const items = [
    {
      href: '/',
      label: 'Translate',
      active: !isWords,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M13.5 13.5l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      href: '/words',
      label: 'My words',
      active: isWords,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 6h12M4 10h8M4 14h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
    },
  ]

  return (
    <div className="flex border-t border-[var(--border)] bg-[var(--bg-screen)] shrink-0">
      {items.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium uppercase tracking-[0.05em] transition-colors ${
            item.active ? 'text-[var(--accent)]' : 'text-[var(--tx-hint)]'
          }`}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </div>
  )
}
