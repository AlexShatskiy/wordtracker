'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

function markOnboardingDone() {
  localStorage.setItem('wt-onboarding-done', '1')
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getNameFromEmail(email: string): string {
  const known: Record<string, string> = {
    'anna.volkova@gmail.com': 'Anna Volkova',
    'd.petrov@workmail.io': 'Dmitry Petrov',
  }
  return known[email] ?? email.split('@')[0]
}

const HOW_IT_WORKS = [
  {
    title: 'Type or paste a word',
    body: 'Language is auto-detected — EN or RU.',
  },
  {
    title: 'We translate and remember',
    body: 'Each lookup is silently logged.',
  },
  {
    title: 'Frequency surfaces struggle',
    body: 'Words you search often get a red badge.',
  },
]

export default function WelcomePage() {
  const router = useRouter()
  const [email] = useState(() =>
    typeof window === 'undefined'
      ? ''
      : (localStorage.getItem('wt-account') ?? ''),
  )
  const [name] = useState(() => getNameFromEmail(email))

  function start() {
    markOnboardingDone()
    router.push('/choose-pair')
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        padding: '28px 24px 32px',
        minHeight: '100dvh',
        gap: 24,
      }}
    >
      <div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 500,
            color: 'var(--text-primary)',
            marginBottom: 4,
          }}
        >
          Welcome{name ? `, ${name.split(' ')[0]}` : ''}!
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          You&apos;re all set to start building your vocabulary.
        </div>
      </div>

      {email && (
        <div
          style={{
            background: 'var(--accent-tint)',
            border:
              '1px solid color-mix(in oklch, var(--accent) 30%, transparent)',
            borderRadius: 14,
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'var(--accent)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {getInitials(name)}
          </div>
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--text-primary)',
              }}
            >
              {name}
            </div>
            <div
              style={{
                fontSize: 11.5,
                color: 'var(--text-muted)',
                marginTop: 1,
              }}
            >
              {email}
            </div>
          </div>
        </div>
      )}

      <div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--text-hint)',
            letterSpacing: '0.07em',
            marginBottom: 14,
          }}
        >
          HOW IT WORKS
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {HOW_IT_WORKS.map((item, i) => (
            <div
              key={item.title}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: 'var(--accent-tint)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    color: 'var(--text-muted)',
                    marginTop: 2,
                  }}
                >
                  {item.body}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={start}
        style={{
          marginTop: 'auto',
          width: '100%',
          padding: '14px 16px',
          borderRadius: 14,
          background: 'var(--accent)',
          color: '#fff',
          border: 'none',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        Start looking up words
      </button>
    </div>
  )
}
