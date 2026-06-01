'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ALL_PAIRS, LANG_NAMES, pairsEqual, type Pair } from '../../lib/pairs'
import { usePair } from '../../lib/PairContext'
import { LangChip } from '../../components/LangChip'

const SwapIcon = ({ active }: { active: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    style={{ color: active ? 'var(--accent)' : 'var(--tx-hint)', flexShrink: 0 }}
  >
    <path
      d="M2 4.5h10M9 2l3 2.5-3 2.5M12 9.5H2M5 7l-3 2.5 3 2.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M2 5l2.5 2.5 3.5-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const SparkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--tx-hint)', flexShrink: 0 }}>
    <path
      d="M8 1l1.8 5H15l-4.2 3 1.6 5L8 11l-4.4 3 1.6-5L1 6h5.2L8 1z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
)

export default function ChoosePairPage() {
  const router = useRouter()
  const { setPair } = usePair()
  const [pick, setPick] = useState<Pair | null>(null)

  function handleContinue() {
    if (!pick) return
    setPair(pick)
    router.push('/')
  }

  const pairs = ALL_PAIRS()

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 18px 22px',
        gap: 20,
        overflowY: 'auto',
        background: 'var(--bg-screen)',
        minHeight: 0,
      }}
    >
      {/* Top block */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span
          style={{
            display: 'inline-flex',
            alignSelf: 'flex-start',
            padding: '4px 12px',
            borderRadius: 100,
            background: 'var(--accent-tint)',
            color: 'var(--accent)',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.07em',
          }}
        >
          GET STARTED
        </span>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 500,
            color: 'var(--tx-primary)',
            lineHeight: 1.25,
            margin: 0,
            textWrap: 'balance',
          }}
        >
          Which languages do you read in?
        </h1>
        <p style={{ fontSize: 12.5, color: 'var(--tx-muted)', margin: 0, lineHeight: 1.5 }}>
          Pick a pair to start — you can add more later.
        </p>
      </div>

      {/* Pair cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {pairs.map(p => {
          const selected = pick !== null && pairsEqual(pick, p)
          return (
            <button
              key={`${p.from}-${p.to}`}
              onClick={() => setPick(p)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: 14,
                borderRadius: 14,
                border: selected ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                background: selected ? 'var(--accent-tint)' : 'var(--bg-card)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s, border-color 0.15s',
              }}
            >
              <LangChip lang={p.from} size="md" />
              <SwapIcon active={selected} />
              <LangChip lang={p.to} size="md" />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--tx-primary)' }}>
                  {LANG_NAMES[p.from]} ↔ {LANG_NAMES[p.to]}
                </span>
                <span style={{ fontSize: 11.5, color: 'var(--tx-hint)' }}>
                  Two-way · auto-detected as you type
                </span>
              </div>
              {/* Radio disc */}
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  border: selected ? 'none' : '1.5px solid var(--border)',
                  background: selected ? 'var(--accent)' : 'transparent',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {selected && <CheckIcon />}
              </div>
            </button>
          )
        })}
      </div>

      {/* Info note */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8,
          padding: '10px 12px',
          borderRadius: 12,
          border: '1px dashed var(--border)',
          background: 'var(--bg-card)',
        }}
      >
        <SparkIcon />
        <p style={{ fontSize: 11, color: 'var(--tx-hint)', margin: 0, lineHeight: 1.5 }}>
          You can add Polish ↔ Russian or any other combination later — your word lists stay separate per pair.
        </p>
      </div>

      {/* Continue button */}
      <button
        onClick={handleContinue}
        disabled={pick === null}
        style={{
          marginTop: 'auto',
          width: '100%',
          height: 48,
          borderRadius: 13,
          border: 'none',
          background: 'var(--accent)',
          color: 'white',
          fontSize: 13.5,
          fontWeight: 500,
          cursor: pick ? 'pointer' : 'not-allowed',
          opacity: pick ? 1 : 0.4,
          transition: 'opacity 0.15s',
        }}
      >
        {pick
          ? `Continue with ${pick.from.toUpperCase()} ↔ ${pick.to.toUpperCase()}`
          : 'Select a language pair'}
      </button>
    </div>
  )
}
