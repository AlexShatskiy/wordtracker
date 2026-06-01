'use client'
import { SheetOverlay } from './SheetOverlay'
import { LangChip } from './LangChip'
import { usePair } from '../lib/PairContext'
import { ALL_PAIRS, LANG_NAMES, pairsEqual, type Pair } from '../lib/pairs'

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="4" y1="4" x2="14" y2="14"/>
    <line x1="14" y1="4" x2="4" y2="14"/>
  </svg>
)

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <line x1="7" y1="1" x2="7" y2="13"/>
    <line x1="1" y1="7" x2="13" y2="7"/>
  </svg>
)

function SheetHandle() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 4px' }}>
      <div style={{ width: 40, height: 4, borderRadius: 100, background: 'var(--border)' }} />
    </div>
  )
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-hint)', letterSpacing: '0.07em', marginBottom: 8 }}>
      {children}
    </div>
  )
}

type Props = {
  onClose: () => void
  onAddPair: (pair: Pair) => void
}

export function PairSwitcherSheet({ onClose, onAddPair }: Props) {
  const { pair, pairs, setPair } = usePair()
  const remaining = ALL_PAIRS().filter(p => !pairs.some(q => pairsEqual(p, q)))

  return (
    <SheetOverlay onClose={onClose} half>
      <div style={{ background: 'var(--bg-screen)', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <SheetHandle />

        <div style={{ padding: '4px 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Language pair</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 1 }}>Switch what you're learning</div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-hint)', cursor: 'pointer', padding: 4 }}>
            <CloseIcon />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px' }}>
          <SectionLabel>YOUR PAIRS</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {pairs.map(p => {
              const active = pair !== null && pairsEqual(p, pair)
              return (
                <button
                  key={`${p.from}-${p.to}`}
                  onClick={() => { setPair(p); onClose() }}
                  style={{
                    padding: '12px 12px', borderRadius: 13,
                    background: active ? 'var(--accent-tint)' : 'var(--bg-card)',
                    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', gap: 12,
                    cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                  }}
                >
                  <LangChip lang={p.from} size="md" />
                  <LangChip lang={p.to} size="md" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                      {LANG_NAMES[p.from]} ↔ {LANG_NAMES[p.to]}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-hint)', marginTop: 1 }}>0 saved words</div>
                  </div>
                  {active && (
                    <span style={{
                      background: 'var(--accent)', color: '#fff',
                      fontSize: 10, fontWeight: 600, letterSpacing: '0.06em',
                      padding: '4px 9px', borderRadius: 100, whiteSpace: 'nowrap',
                    }}>
                      ACTIVE
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {remaining.length > 0 && (
            <>
              <SectionLabel>ADD A PAIR</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {remaining.map(p => (
                  <button
                    key={`${p.from}-${p.to}`}
                    onClick={() => onAddPair(p)}
                    style={{
                      padding: '12px 12px', borderRadius: 13,
                      background: 'var(--bg-card)', border: '1px dashed var(--border)',
                      display: 'flex', alignItems: 'center', gap: 12,
                      cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                    }}
                  >
                    <LangChip lang={p.from} size="md" />
                    <LangChip lang={p.to} size="md" />
                    <div style={{ flex: 1, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                      {LANG_NAMES[p.from]} ↔ {LANG_NAMES[p.to]}
                    </div>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'var(--accent-tint)', color: 'var(--accent)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <PlusIcon />
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {remaining.length === 0 && (
            <div style={{
              padding: 16, borderRadius: 12, textAlign: 'center',
              background: 'var(--bg-card)', border: '1px dashed var(--border)',
              fontSize: 11.5, color: 'var(--text-hint)', lineHeight: 1.5,
            }}>
              You're using all 3 available languages.<br />More languages are coming soon.
            </div>
          )}
        </div>
      </div>
    </SheetOverlay>
  )
}
