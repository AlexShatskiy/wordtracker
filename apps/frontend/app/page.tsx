'use client'
import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { AppHeader } from '../components/AppHeader'
import { BottomNav } from '../components/BottomNav'
import { LangChip } from '../components/LangChip'
import { FrequencyBadge } from '../components/FrequencyBadge'
import { PairSwitcherSheet } from '../components/PairSwitcherSheet'
import { AddPairConfirmSheet } from '../components/AddPairConfirmSheet'
import { QuickAddSheet } from '../components/QuickAddSheet'
import { WordDetailSheet } from '../components/WordDetailSheet'
import { usePair } from '../lib/PairContext'
import { LANG_NAMES, type Pair } from '../lib/pairs'
import { SAMPLE_WORDS, detectLang, findResult, type Word } from '../lib/words'

const BookmarkIcon = ({ filled }: { filled: boolean }) => (
  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
    <path
      d="M3 2.5h8v9.5L7 9.5l-4 2.5V2.5Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
      fill={filled ? 'currentColor' : 'none'}
    />
  </svg>
)

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10.6 10.6 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const ChevronRight = () => (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
    <path d="m4.5 2.5 3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function RecentSection({ pair, onOpen }: { pair: Pair; onOpen: (w: Word) => void }) {
  const recent = SAMPLE_WORDS
    .filter(w => (w.lang === pair.from && w.target === pair.to) || (w.lang === pair.to && w.target === pair.from))
    .slice(0, 4)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '6px 4px 8px' }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-hint)', letterSpacing: '0.07em' }}>
          RECENT LOOKUPS
        </span>
        <span style={{ fontSize: 11, color: 'var(--accent)' }}>This week</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {recent.length === 0 ? (
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 14, padding: '24px 14px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>No words in this pair yet.</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-hint)', marginTop: 4 }}>Look one up above to get started.</div>
          </div>
        ) : recent.map(w => (
          <button key={w.id} onClick={() => onOpen(w)} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 14, padding: 12,
            display: 'flex', alignItems: 'center', gap: 10,
            cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{w.term}</span>
                <LangChip lang={w.lang} size="sm" />
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--text-hint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>
                {w.translation}
              </div>
            </div>
            <FrequencyBadge count={w.lookups} />
          </button>
        ))}
      </div>
    </div>
  )
}

export default function TranslatePage() {
  const router = useRouter()
  const { pair } = usePair()
  const inputRef = useRef<HTMLInputElement>(null)

  const [mounted, setMounted] = useState(false)
  const [query, setQuery] = useState('')
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set(['w1', 'w2', 'w4']))
  const [toast, setToast] = useState('')
  const [pairSheetOpen, setPairSheetOpen] = useState(false)
  const [confirmPair, setConfirmPair] = useState<Pair | null>(null)
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [detailWord, setDetailWord] = useState<Word | null>(null)

  useEffect(() => {
    setMounted(true)
    if (!localStorage.getItem('wt-pair')) router.push('/choose-pair')
  }, [router])

  const detected = useMemo(() => detectLang(query), [query])
  const result = useMemo(() => pair ? findResult(query, pair) : null, [query, pair])

  const direction = useMemo(() => {
    if (!pair) return { from: 'en' as const, to: 'ru' as const }
    if (detected === pair.from) return { from: pair.from, to: pair.to }
    if (detected === pair.to)   return { from: pair.to,   to: pair.from }
    return { from: pair.from, to: pair.to }
  }, [pair, detected])

  function toggleSaved(word: Word) {
    const wasSaved = savedIds.has(word.id)
    setSavedIds(prev => {
      const next = new Set(prev)
      wasSaved ? next.delete(word.id) : next.add(word.id)
      return next
    })
    showToast(wasSaved ? 'Removed from list' : 'Saved to My Words')
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 1800)
  }

  if (!mounted) return null

  const placeholder = pair
    ? `Type in ${LANG_NAMES[pair.from]} or ${LANG_NAMES[pair.to]}…`
    : 'Type a word…'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <AppHeader
        subtitle="Good morning, Anna"
        streak={7}
        onPairSwitcherOpen={() => setPairSheetOpen(true)}
      />

      <main style={{ flex: 1, overflowY: 'auto', padding: '4px 14px 14px' }}>
        {/* Search input */}
        <div style={{ position: 'relative', marginBottom: 10 }}>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={placeholder}
            style={{
              width: '100%', height: 44, borderRadius: 13,
              padding: '0 38px 0 14px',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              fontSize: 13, color: 'var(--text-primary)', outline: 'none',
              fontFamily: 'inherit', boxSizing: 'border-box',
            }}
          />
          <span style={{ position: 'absolute', right: 14, top: 14, color: 'var(--text-hint)', pointerEvents: 'none' }}>
            <SearchIcon />
          </span>
        </div>

        {/* Direction indicator */}
        {query && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '4px 8px 4px 4px', borderRadius: 100,
              background: 'var(--accent-tint)',
            }}>
              <LangChip lang={direction.from} size="sm" />
              <span style={{ fontSize: 10, color: 'var(--accent)' }}>→</span>
              <LangChip lang={direction.to} size="sm" />
            </div>
            <span style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '4px 9px', borderRadius: 100,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              fontSize: 10, fontWeight: 600, letterSpacing: '0.06em',
              color: 'var(--text-hint)',
            }}>
              Detected · {LANG_NAMES[detected]}
            </span>
          </div>
        )}

        {/* Result card */}
        {result ? (
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 14, overflow: 'hidden',
          }}>
            <div style={{ padding: '14px 14px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 22, fontWeight: 500, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                  {result.term}
                </span>
                <span style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--text-hint)' }}>
                  {result.phonetic}
                </span>
                <div style={{ marginLeft: 'auto' }}>
                  <FrequencyBadge count={result.lookups} />
                </div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--accent)', marginTop: 6, lineHeight: 1.4 }}>
                {result.translation}
              </div>
            </div>

            <div style={{ height: 1, background: 'var(--border)' }} />

            <div style={{ padding: '12px 14px 14px' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-hint)', letterSpacing: '0.07em', marginBottom: 8 }}>
                EXAMPLES
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {result.examples.slice(0, 2).map((ex, i) => (
                  <div key={i} style={{
                    fontSize: 11.5, lineHeight: 1.5, color: 'var(--text-muted)',
                    borderLeft: '2px solid var(--accent)', paddingLeft: 10,
                  }}>
                    {ex}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, gap: 8 }}>
                <button onClick={() => setDetailWord(result)} style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: 'var(--text-hint)', fontSize: 11.5, padding: 0,
                  display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'inherit',
                }}>
                  More examples <ChevronRight />
                </button>
                <button onClick={() => toggleSaved(result)} style={{
                  background: 'var(--accent-tint)', color: 'var(--accent)',
                  border: 'none', borderRadius: 100, padding: '7px 13px',
                  fontSize: 11.5, fontWeight: 600, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'inherit',
                }}>
                  <BookmarkIcon filled={savedIds.has(result.id)} />
                  {savedIds.has(result.id) ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        ) : query ? (
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 14, padding: '28px 14px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>No match in cache.</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-hint)' }}>Translating with Gemini Flash…</div>
          </div>
        ) : pair ? (
          <RecentSection pair={pair} onOpen={setDetailWord} />
        ) : null}
      </main>

      <BottomNav onQuickAdd={() => setQuickAddOpen(true)} />

      {/* Sheets */}
      {pairSheetOpen && !confirmPair && (
        <PairSwitcherSheet
          onClose={() => setPairSheetOpen(false)}
          onAddPair={p => setConfirmPair(p)}
        />
      )}
      {confirmPair && (
        <AddPairConfirmSheet
          pair={confirmPair}
          onConfirm={() => {
            showToast(`Added ${confirmPair.from.toUpperCase()} ↔ ${confirmPair.to.toUpperCase()}`)
            setConfirmPair(null)
            setPairSheetOpen(false)
          }}
          onCancel={() => setConfirmPair(null)}
        />
      )}
      {quickAddOpen && pair && (
        <QuickAddSheet
          pair={pair}
          onClose={() => setQuickAddOpen(false)}
          onSave={word => {
            setSavedIds(prev => new Set([...prev, word.id]))
            showToast('Saved to My Words')
          }}
        />
      )}
      {detailWord && (
        <WordDetailSheet word={detailWord} onClose={() => setDetailWord(null)} />
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'absolute', bottom: 110, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--text-primary)', color: 'var(--bg-card)',
          padding: '8px 14px', borderRadius: 100, fontSize: 11.5, fontWeight: 500,
          zIndex: 100, boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
          animation: 'wtToastIn 0.25s ease-out',
          whiteSpace: 'nowrap',
        }}>
          {toast}
        </div>
      )}
    </div>
  )
}
