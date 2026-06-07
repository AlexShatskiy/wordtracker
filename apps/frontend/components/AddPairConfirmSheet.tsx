'use client'
import { SheetOverlay } from './SheetOverlay'
import { LangChip } from './LangChip'
import { usePair } from '../lib/PairContext'
import { LANG_NAMES, type Pair } from '../lib/pairs'

function SheetHandle() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '8px 0 4px',
      }}
    >
      <div
        style={{
          width: 40,
          height: 4,
          borderRadius: 100,
          background: 'var(--border)',
        }}
      />
    </div>
  )
}

const SwapArrow = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    style={{ color: 'var(--accent)', flexShrink: 0 }}
  >
    <path
      d="M2 7h13M13 4l3 3-3 3M18 13H5M7 10l-3 3 3 3"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

type Props = {
  pair: Pair
  onConfirm: () => void
  onCancel: () => void
}

export function AddPairConfirmSheet({ pair, onConfirm, onCancel }: Props) {
  const { addPair } = usePair()

  function handleConfirm() {
    addPair(pair)
    onConfirm()
  }

  return (
    <SheetOverlay onClose={onCancel} half>
      <div
        style={{
          background: 'var(--bg-screen)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <SheetHandle />

        <div style={{ padding: '8px 18px 0' }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            Add this pair?
          </div>
          <div
            style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 4 }}
          >
            It will be added to your pair switcher and become active.
          </div>
        </div>

        <div
          style={{
            padding: '18px 18px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              padding: 18,
              borderRadius: 18,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <LangChip lang={pair.from} size="lg" />
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--text-hint)',
                  letterSpacing: '0.06em',
                }}
              >
                {LANG_NAMES[pair.from].toUpperCase()}
              </div>
            </div>
            <SwapArrow />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <LangChip lang={pair.to} size="lg" />
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--text-hint)',
                  letterSpacing: '0.06em',
                }}
              >
                {LANG_NAMES[pair.to].toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            padding: '0 18px',
            fontSize: 11.5,
            color: 'var(--text-muted)',
            lineHeight: 1.55,
            marginBottom: 18,
          }}
        >
          Translations are bidirectional — you can type in either language and
          we&apos;ll detect it automatically. Your word lists for each pair stay
          separate.
        </div>

        <div style={{ flex: 1 }} />

        <div
          style={{
            display: 'flex',
            gap: 10,
            padding: '10px 16px 18px',
            borderTop: '1px solid var(--border)',
          }}
        >
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              height: 44,
              borderRadius: 13,
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Not now
          </button>
          <button
            onClick={handleConfirm}
            style={{
              flex: 2,
              height: 44,
              borderRadius: 13,
              background: 'var(--accent)',
              border: 'none',
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Add pair
          </button>
        </div>
      </div>
    </SheetOverlay>
  )
}
