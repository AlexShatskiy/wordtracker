'use client'
import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AppHeader } from '../components/AppHeader'
import { BottomNav } from '../components/BottomNav'
import { LangChip } from '../components/LangChip'
import { FrequencyBadge } from '../components/FrequencyBadge'
import { PairSwitcherSheet } from '../components/PairSwitcherSheet'
import { AddPairConfirmSheet } from '../components/AddPairConfirmSheet'
import { QuickAddSheet } from '../components/QuickAddSheet'
import { WordDetailSheet, type WordDetail } from '../components/WordDetailSheet'
import { usePair } from '../lib/PairContext'
import { LANG_NAMES, type Pair, type LangCode } from '../lib/pairs'
import { detectLang } from '../lib/words'
import { api, type TranslateResponse, type SavedWord } from '../lib/api'

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
    <path
      d="M10.6 10.6 14 14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

const ChevronRight = () => (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
    <path
      d="m4.5 2.5 3.5 3.5-3.5 3.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

function RecentSection({
  words,
  onOpen,
}: {
  words: SavedWord[]
  onOpen: (w: WordDetail) => void
}) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: '6px 4px 8px',
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--text-hint)',
            letterSpacing: '0.07em',
          }}
        >
          RECENT LOOKUPS
        </span>
        <span style={{ fontSize: 11, color: 'var(--accent)' }}>This week</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {words.length === 0 ? (
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              padding: '24px 14px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              No words in this pair yet.
            </div>
            <div
              style={{
                fontSize: 11.5,
                color: 'var(--text-hint)',
                marginTop: 4,
              }}
            >
              Look one up above to get started.
            </div>
          </div>
        ) : (
          words.map((w) => (
            <button
              key={w.id}
              onClick={() => onOpen(w)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
                fontFamily: 'inherit',
                textAlign: 'left',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {w.term}
                  </span>
                  <LangChip lang={w.lang as LangCode} size="sm" />
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    color: 'var(--text-hint)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginTop: 2,
                  }}
                >
                  {w.translation}
                </div>
              </div>
              <FrequencyBadge count={w.lookups} />
            </button>
          ))
        )}
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
  const [result, setResult] = useState<TranslateResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [recentWords, setRecentWords] = useState<SavedWord[]>([])
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [toast, setToast] = useState('')
  const [pairSheetOpen, setPairSheetOpen] = useState(false)
  const [confirmPair, setConfirmPair] = useState<Pair | null>(null)
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [detailWord, setDetailWord] = useState<WordDetail | null>(null)
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
    if (!localStorage.getItem('wt-onboarding-done')) {
      router.push('/onboarding')
      return
    }
    if (!localStorage.getItem('wt-pair')) {
      router.push('/choose-pair')
      return
    }

    const onOnline = () => setOffline(false)
    const onOffline = () => setOffline(true)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    setOffline(!navigator.onLine)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [router])

  const loadWords = useCallback(() => {
    if (!pair) return
    api
      .listWords(pair.from, pair.to)
      .then((res) => {
        setRecentWords(res.data.slice(0, 4))
        setSavedIds(new Set(res.data.map((w) => w.id)))
      })
      .catch(() => showToast('Could not load words — check your connection'))
  }, [pair])

  useEffect(() => {
    loadWords()
  }, [loadWords])

  const detected = useMemo(() => detectLang(query), [query])

  const direction = useMemo(() => {
    if (!pair) return { from: 'en' as LangCode, to: 'ru' as LangCode }
    if (detected === pair.from) return { from: pair.from, to: pair.to }
    if (detected === pair.to) return { from: pair.to, to: pair.from }
    return { from: pair.from, to: pair.to }
  }, [pair, detected])

  // Debounced translate
  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed || !pair) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResult(null)
      setLoading(false)
      return
    }
    setLoading(true)
    const timer = setTimeout(async () => {
      try {
        const res = await api.translate(trimmed, direction.from, direction.to)
        setResult(res)
      } catch {
        setResult(null)
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query, direction, pair])

  function bumpStreak() {
    const today = new Date().toDateString()
    const lastDay = localStorage.getItem('wt-streak-day')
    if (lastDay === today) return
    const current = parseInt(localStorage.getItem('wt-streak') ?? '0', 10)
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    const next = lastDay === yesterday ? current + 1 : 1
    localStorage.setItem('wt-streak', String(next))
    localStorage.setItem('wt-streak-day', today)
  }

  async function toggleSaved(res: TranslateResponse) {
    const wasSaved = savedIds.has(res.id)
    try {
      if (wasSaved) {
        await api.unsaveWord(res.id)
      } else {
        await api.saveWord(res.id)
        bumpStreak()
      }
      setSavedIds((prev) => {
        const next = new Set(prev)
        if (wasSaved) next.delete(res.id)
        else next.add(res.id)
        return next
      })
      showToast(wasSaved ? 'Removed from list' : 'Saved to My Words')
      loadWords()
    } catch {
      showToast('Error — try again')
    }
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
      }}
    >
      <AppHeader
        subtitle="Good morning, Anna"
        onPairSwitcherOpen={() => setPairSheetOpen(true)}
      />

      <main style={{ flex: 1, overflowY: 'auto', padding: '4px 14px 14px' }}>
        {offline && (
          <div
            style={{
              padding: '8px 12px',
              borderRadius: 10,
              background:
                'color-mix(in oklch, var(--warning) 12%, transparent)',
              color: 'var(--warning)',
              fontSize: 11.5,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 10,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M2 2l12 12M6.3 4.3A6 6 0 0 1 14 10M2 10a6 6 0 0 1 2.5-4.9M8 14v.01" />
            </svg>
            Offline — showing cached results only
          </div>
        )}

        {/* Search input */}
        <div style={{ position: 'relative', marginBottom: 10 }}>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            style={{
              width: '100%',
              height: 44,
              borderRadius: 13,
              padding: '0 38px 0 14px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              fontSize: 13,
              color: 'var(--text-primary)',
              outline: 'none',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
          <span
            style={{
              position: 'absolute',
              right: 14,
              top: 14,
              color: loading ? 'var(--accent)' : 'var(--text-hint)',
              pointerEvents: 'none',
            }}
          >
            <SearchIcon />
          </span>
        </div>

        {/* Direction indicator */}
        {query && (
          <div
            style={{
              display: 'flex',
              gap: 6,
              marginBottom: 12,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 8px 4px 4px',
                borderRadius: 100,
                background: 'var(--accent-tint)',
              }}
            >
              <LangChip lang={direction.from} size="sm" />
              <span style={{ fontSize: 10, color: 'var(--accent)' }}>→</span>
              <LangChip lang={direction.to} size="sm" />
            </div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 9px',
                borderRadius: 100,
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.06em',
                color: 'var(--text-hint)',
              }}
            >
              Detected · {LANG_NAMES[detected]}
            </span>
          </div>
        )}

        {/* Result card */}
        {result ? (
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '14px 14px 12px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 10,
                  flexWrap: 'wrap',
                }}
              >
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {result.term}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontStyle: 'italic',
                    color: 'var(--text-hint)',
                  }}
                >
                  {result.phonetic}
                </span>
                <div style={{ marginLeft: 'auto' }}>
                  <FrequencyBadge count={result.lookups} />
                </div>
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'var(--accent)',
                  marginTop: 6,
                  lineHeight: 1.4,
                }}
              >
                {result.translation}
              </div>
            </div>

            <div style={{ height: 1, background: 'var(--border)' }} />

            <div style={{ padding: '12px 14px 14px' }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: 'var(--text-hint)',
                  letterSpacing: '0.07em',
                  marginBottom: 8,
                }}
              >
                EXAMPLES
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {result.examples.slice(0, 2).map((ex, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: 11.5,
                      lineHeight: 1.5,
                      color: 'var(--text-muted)',
                      borderLeft: '2px solid var(--accent)',
                      paddingLeft: 10,
                    }}
                  >
                    {ex}
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 14,
                  gap: 8,
                }}
              >
                <button
                  onClick={() => setDetailWord(result)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-hint)',
                    fontSize: 11.5,
                    padding: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontFamily: 'inherit',
                  }}
                >
                  More examples <ChevronRight />
                </button>
                <button
                  onClick={() => toggleSaved(result)}
                  style={{
                    background: 'var(--accent-tint)',
                    color: 'var(--accent)',
                    border: 'none',
                    borderRadius: 100,
                    padding: '7px 13px',
                    fontSize: 11.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: 'inherit',
                  }}
                >
                  <BookmarkIcon filled={savedIds.has(result.id)} />
                  {savedIds.has(result.id) ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        ) : query && !loading ? (
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              padding: '28px 14px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              No result found.
            </div>
          </div>
        ) : query && loading ? (
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              padding: '28px 14px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 11.5, color: 'var(--text-hint)' }}>
              Translating…
            </div>
          </div>
        ) : pair ? (
          <RecentSection words={recentWords} onOpen={setDetailWord} />
        ) : null}
      </main>

      <BottomNav onQuickAdd={() => setQuickAddOpen(true)} />

      {pairSheetOpen && !confirmPair && (
        <PairSwitcherSheet
          onClose={() => setPairSheetOpen(false)}
          onAddPair={(p) => setConfirmPair(p)}
        />
      )}
      {confirmPair && (
        <AddPairConfirmSheet
          pair={confirmPair}
          onConfirm={() => {
            showToast(
              `Added ${confirmPair.from.toUpperCase()} ↔ ${confirmPair.to.toUpperCase()}`,
            )
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
          onSave={(id) => {
            setSavedIds((prev) => new Set([...prev, id]))
            showToast('Saved to My Words')
            loadWords()
          }}
        />
      )}
      {detailWord && (
        <WordDetailSheet
          word={detailWord}
          onClose={() => setDetailWord(null)}
          onRemove={
            savedIds.has(detailWord.id)
              ? async () => {
                  await api.unsaveWord(detailWord.id)
                  setDetailWord(null)
                  loadWords()
                  showToast('Removed from list')
                }
              : undefined
          }
        />
      )}

      {toast && (
        <div
          style={{
            position: 'absolute',
            bottom: 110,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--text-primary)',
            color: 'var(--bg-card)',
            padding: '8px 14px',
            borderRadius: 100,
            fontSize: 11.5,
            fontWeight: 500,
            zIndex: 100,
            boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
            animation: 'wtToastIn 0.25s ease-out',
            whiteSpace: 'nowrap',
          }}
        >
          {toast}
        </div>
      )}
    </div>
  )
}
