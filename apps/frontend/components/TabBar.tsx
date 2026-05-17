'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function TabBar() {
  const pathname = usePathname()
  const isWords = pathname === '/words'

  const tabs = [
    { href: '/', label: 'Translate', active: !isWords },
    { href: '/words', label: 'My words', active: isWords },
  ]

  return (
    <div className="flex border-b border-[var(--border)] px-1 bg-[var(--bg-screen)]">
      {tabs.map(tab => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`relative px-4 py-3 text-[13px] font-medium transition-colors ${
            tab.active ? 'text-[var(--accent)]' : 'text-[var(--tx-hint)]'
          }`}
        >
          {tab.label}
          {tab.active && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[1.5px] bg-[var(--accent)] rounded-full" />
          )}
        </Link>
      ))}
    </div>
  )
}
