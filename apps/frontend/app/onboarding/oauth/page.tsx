'use client'
import { useRouter } from 'next/navigation'

const ACCOUNTS = [
  { name: 'Anna Volkova', email: 'anna.volkova@gmail.com', initials: 'AV', bg: '#1a73e8' },
  { name: 'Dmitry Petrov', email: 'd.petrov@workmail.io', initials: 'DP', bg: '#34a853' },
]

export default function OAuthPage() {
  const router = useRouter()

  function selectAccount(email: string) {
    localStorage.setItem('wt-account', email)
    router.push('/onboarding/welcome')
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#ffffff', fontFamily: '"Google Sans", Roboto, system-ui, sans-serif', color: '#202124', overflowY: 'auto' }}>
      <div style={{ maxWidth: 420, margin: '0 auto', padding: '48px 24px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <svg width="40" height="40" viewBox="0 0 40 40" style={{ marginBottom: 16 }}>
            <rect x="4" y="10" width="22" height="22" rx="3" stroke="#1a73e8" strokeWidth="2" fill="none" />
            <path d="M9 17h12M9 21h12M9 25h8" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" />
            <circle cx="30" cy="10" r="6" fill="#1a73e8" />
          </svg>
          <h1 style={{ fontSize: 22, fontWeight: 400, margin: '0 0 8px' }}>Sign in to WordTracker</h1>
          <p style={{ fontSize: 14, color: '#5f6368', margin: 0 }}>Choose an account to continue</p>
        </div>

        <div style={{ border: '1px solid #dadce0', borderRadius: 12, overflow: 'hidden' }}>
          {ACCOUNTS.map((acc, i) => (
            <button
              key={acc.email}
              onClick={() => selectAccount(acc.email)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: 'none', border: 'none', borderTop: i > 0 ? '1px solid #dadce0' : 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}
            >
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: acc.bg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 500, flexShrink: 0 }}>
                {acc.initials}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#202124' }}>{acc.name}</div>
                <div style={{ fontSize: 12, color: '#5f6368', marginTop: 2 }}>{acc.email}</div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => router.back()}
          style={{ display: 'block', width: '100%', marginTop: 16, padding: '10px', background: 'none', border: '1px solid #dadce0', borderRadius: 8, cursor: 'pointer', fontSize: 14, color: '#5f6368', fontFamily: 'inherit' }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
