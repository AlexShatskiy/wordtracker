'use client'
import { useRouter } from 'next/navigation'

function markOnboardingDone() {
  localStorage.setItem('wt-onboarding-done', '1')
}

const TranslateIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <path d="M2 4h7M5.5 2v2M2 4c0 2.5 2 4.5 5 5M3.5 9c.5-.5 1.5-1 3.5-.5" />
    <path d="M8 13l3-7 3 7M9.2 11h3.6" />
  </svg>
)

const TrendUpIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12l4-4 3 3 5-6" />
    <path d="M10 5h4v4" />
  </svg>
)

const CloudIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <path d="M8 10V6M6 8l2-2 2 2" />
    <path d="M11.5 12a3 3 0 0 0 0-6h-.3A4 4 0 1 0 4 10.5" />
  </svg>
)

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path
      d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      fill="#4285F4"
    />
    <path
      d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
      fill="#34A853"
    />
    <path
      d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
      fill="#FBBC05"
    />
    <path
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      fill="#EA4335"
    />
  </svg>
)

const FEATURES = [
  {
    tint: 'color-mix(in oklch, var(--success) 14%, transparent)',
    color: 'var(--success)',
    icon: <TranslateIcon />,
    title: 'Instant EN ↔ RU translation',
    body: 'Two-way, with real usage examples.',
  },
  {
    tint: 'color-mix(in oklch, var(--warning) 16%, transparent)',
    color: 'var(--warning)',
    icon: <TrendUpIcon />,
    title: 'Frequency ranking',
    body: 'The more you search, the more it surfaces.',
  },
  {
    tint: 'var(--accent-tint)',
    color: 'var(--accent)',
    icon: <CloudIcon />,
    title: 'Works offline · syncs everywhere',
    body: 'Service Worker + Google sign-in.',
  },
]

export default function OnboardingPage() {
  const router = useRouter()

  function skipToChoosePair() {
    markOnboardingDone()
    router.push('/choose-pair')
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        padding: '24px 24px 32px',
        minHeight: '100dvh',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          textAlign: 'center',
          gap: 18,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: 'var(--accent-tint)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 0 var(--border) inset',
          }}
        >
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
            <rect
              x="4"
              y="8"
              width="20"
              height="20"
              rx="3"
              stroke="var(--accent)"
              strokeWidth="2"
            />
            <path
              d="M9 14h10M9 18h10M9 22h7"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="25" cy="9" r="5" fill="var(--accent)" />
          </svg>
        </div>

        <div>
          <div
            style={{
              fontSize: 21,
              fontWeight: 500,
              lineHeight: 1.25,
              color: 'var(--text-primary)',
              textWrap: 'balance',
            }}
          >
            Remember words,
            <br />
            not just translations.
          </div>
          <div
            style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              marginTop: 10,
              lineHeight: 1.5,
              maxWidth: 280,
            }}
          >
            Every lookup is counted. The words you keep forgetting rise to the
            top — quietly, no flashcards required.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            width: '100%',
            maxWidth: 320,
          }}
        >
          {FEATURES.map((f) => (
            <div
              key={f.title}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 9,
                  background: f.tint,
                  color: f.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {f.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                  }}
                >
                  {f.title}
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    color: 'var(--text-muted)',
                    marginTop: 1,
                  }}
                >
                  {f.body}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          onClick={() => router.push('/onboarding/oauth')}
          style={{
            width: '100%',
            padding: '13px 16px',
            borderRadius: 13,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            margin: '2px 0',
          }}
        >
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <div
            style={{
              fontSize: 10,
              color: 'var(--text-hint)',
              letterSpacing: '0.08em',
            }}
          >
            OR
          </div>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <button
          onClick={skipToChoosePair}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: 12,
            color: 'var(--text-hint)',
            textDecoration: 'underline',
            textUnderlineOffset: 3,
            padding: 6,
            fontFamily: 'inherit',
          }}
        >
          Continue without account
        </button>

        <div
          style={{
            fontSize: 10,
            color: 'var(--text-hint)',
            textAlign: 'center',
            lineHeight: 1.55,
            marginTop: 2,
          }}
        >
          By continuing you agree to our <u>Terms</u> and <u>Privacy Policy</u>.
        </div>
      </div>
    </div>
  )
}
