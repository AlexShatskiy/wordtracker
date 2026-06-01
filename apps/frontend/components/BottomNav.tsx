'use client'
import { usePathname, useRouter } from 'next/navigation'

type Props = {
  onQuickAdd?: () => void
}

const TranslateIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 5h12M9 3v2M13 17l-3-3M11 14l2-5 4 9"/>
    <path d="M3 5c0 6.5 3.5 10 8 11M12 5c0 3-1.5 5.5-3.5 7.5"/>
  </svg>
)

const ListIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
)

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="8" y1="2" x2="8" y2="14"/>
    <line x1="2" y1="8" x2="14" y2="8"/>
  </svg>
)

const TABS = [
  { href: '/',      label: 'TRANSLATE', Icon: TranslateIcon },
  { href: '/words', label: 'MY WORDS',  Icon: ListIcon },
]

export function BottomNav({ onQuickAdd }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div>
      {/* Quick-add bar */}
      <div style={{
        padding: '8px 12px 10px',
        background: 'var(--bg-screen)',
        borderTop: '1px solid var(--border)',
        display: 'flex', gap: 8, alignItems: 'center',
      }}>
        <div
          onClick={onQuickAdd}
          style={{
            flex: 1, height: 38, borderRadius: 100,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center',
            padding: '0 14px', cursor: 'pointer',
            color: 'var(--text-hint)', fontSize: 12.5,
          }}
        >
          Quick add a word…
        </div>
        <button
          onClick={onQuickAdd}
          style={{
            width: 38, height: 38, borderRadius: '50%',
            background: 'var(--accent)', border: 'none', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <PlusIcon />
        </button>
      </div>

      {/* Tab bar */}
      <div style={{
        display: 'flex',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-screen)',
        paddingBottom: 30,
      }}>
        {TABS.map(({ href, label, Icon }) => {
          const active = pathname === href
          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              style={{
                flex: 1, padding: '10px 0 8px',
                background: 'transparent', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                color: active ? 'var(--accent)' : 'var(--text-hint)',
                fontSize: 10, fontWeight: 500, letterSpacing: '0.04em',
              }}
            >
              <Icon />
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
