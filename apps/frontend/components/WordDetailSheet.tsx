'use client'
import { useMemo } from 'react'
import { SheetOverlay } from './SheetOverlay'
import { LangChip } from './LangChip'
import { FrequencyBadge } from './FrequencyBadge'
import { badgeTier } from '../lib/words'
import { type LangCode, LANG_NAMES } from '../lib/pairs'

const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="m10 3-5 5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2.5 3.5h9M5 3.5V2.5h4v1M3.5 3.5 4 12h6l.5-8.5M6 6v4M8 6v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ padding: '10px 12px', borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-hint)', letterSpacing: '0.07em', textTransform: 'uppercase', marginTop: 5 }}>{label}</div>
    </div>
  )
}

function Sparkbars({ seed, max }: { seed: string; max: number }) {
  const arr = useMemo(() => {
    let h = 0
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
    const out: number[] = []
    for (let i = 0; i < 14; i++) {
      h = (h * 1103515245 + 12345) & 0x7fffffff
      out.push(h % (max + 1))
    }
    return out
  }, [seed, max])

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 50 }}>
      {arr.map((v, i) => (
        <div key={i} style={{
          flex: 1,
          height: `${Math.max(8, max > 0 ? (v / max) * 100 : 8)}%`,
          borderRadius: 3,
          background: v === 0 ? 'var(--border)' : 'var(--accent)',
          opacity: v === 0 ? 0.4 : 0.3 + (max > 0 ? (v / max) * 0.7 : 0),
        }} />
      ))}
    </div>
  )
}

function formatDate(iso?: string): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export type WordDetail = {
  id: string
  term: string
  lang: LangCode
  targetLang: LangCode
  phonetic: string
  translation: string
  examples: string[]
  lookups: number
  lastSeenAt?: string
  addedAt?: string
}

type Props = {
  word: WordDetail
  onClose: () => void
  onRemove?: () => void
}

export function WordDetailSheet({ word, onClose, onRemove }: Props) {
  void badgeTier // used by FrequencyBadge internally
  void LANG_NAMES
  const sparkMax = Math.max(3, Math.ceil(word.lookups / 4))

  return (
    <SheetOverlay onClose={onClose}>
      <div style={{ background: 'var(--bg-screen)', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '12px 14px 6px' }}>
          <button onClick={onClose} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 13, fontFamily: 'inherit', padding: 4,
          }}>
            <ChevronLeft /> My words
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 14px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
            <span style={{ fontSize: 26, fontWeight: 500, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              {word.term}
            </span>
            <span style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--text-hint)' }}>
              {word.phonetic}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 8px 4px 4px', borderRadius: 100, background: 'var(--accent-tint)' }}>
              <LangChip lang={word.lang} size="sm" />
              <span style={{ fontSize: 10, color: 'var(--accent)' }}>→</span>
              <LangChip lang={word.targetLang} size="sm" />
            </div>
            <FrequencyBadge count={word.lookups} />
          </div>

          <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--accent)', lineHeight: 1.45, marginBottom: 16 }}>
            {word.translation}
          </div>

          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-hint)', letterSpacing: '0.07em', marginBottom: 8 }}>
            EXAMPLES
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
            {word.examples.map((ex, i) => (
              <div key={i} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 12, padding: 12,
                fontSize: 12.5, lineHeight: 1.5, color: 'var(--text-muted)',
                borderLeft: '3px solid var(--accent)',
              }}>
                {ex}
              </div>
            ))}
          </div>

          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-hint)', letterSpacing: '0.07em', marginBottom: 8 }}>
            STATS
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 18 }}>
            <div style={{ padding: '10px 12px', borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                {word.lookups}
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-hint)', letterSpacing: '0.07em', textTransform: 'uppercase', marginTop: 5 }}>
                Lookups
              </div>
            </div>
            <StatCard label="Last seen" value={formatDate(word.lastSeenAt)} />
            <StatCard label="Added" value={formatDate(word.addedAt)} />
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 12, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-hint)', letterSpacing: '0.07em' }}>LAST 14 DAYS</span>
              <span style={{ fontSize: 11, color: 'var(--text-hint)' }}>Lookups per day</span>
            </div>
            <Sparkbars seed={word.id} max={sparkMax} />
          </div>

          {onRemove && (
            <button
              onClick={onRemove}
              style={{
                width: '100%', height: 40, borderRadius: 12,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                color: 'var(--text-muted)', fontSize: 12.5, fontWeight: 500,
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <TrashIcon /> Remove from list
            </button>
          )}
        </div>
      </div>
    </SheetOverlay>
  )
}
