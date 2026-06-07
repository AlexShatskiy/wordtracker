'use client'
import { useState, useEffect, useCallback } from 'react'
import { AppHeader } from '../../components/AppHeader'
import { BottomNav } from '../../components/BottomNav'
import { LangChip } from '../../components/LangChip'
import { FrequencyBadge } from '../../components/FrequencyBadge'
import { PairSwitcherSheet } from '../../components/PairSwitcherSheet'
import { AddPairConfirmSheet } from '../../components/AddPairConfirmSheet'
import { QuickAddSheet } from '../../components/QuickAddSheet'
import {
  WordDetailSheet,
  type WordDetail,
} from '../../components/WordDetailSheet'
import { usePair } from '../../lib/PairContext'
import { type Pair } from '../../lib/pairs'
import { api, type SavedWord } from '../../lib/api'

const TrendUpIcon = () => (
  <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
    <path
      d="M2 10 6 6l2.5 2.5L12 4M9 4h3v3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

function StatTile({
  label,
  value,
  tint,
  color,
}: {
  label: string
  value: number
  tint: string
  color: string
}) {
  return (
    <div
      style={{
        padding: '10px 12px',
        borderRadius: 12,
        background: tint,
        border: '1px solid var(--border)',
      }}
    >
      <div
        style={{
          fontSize: 20,
          fontWeight: 600,
          color,
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: 'var(--text-hint)',
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          marginTop: 5,
        }}
      >
        {label}
      </div>
    </div>
  )
}

function isToday(iso: string): boolean {
  return new Date(iso).toDateString() === new Date().toDateString()
}

export default function WordsPage() {
  const { pair } = usePair()
  const [words, setWords] = useState<SavedWord[]>([])
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState<'count' | 'az'>('count')
  const [pairSheetOpen, setPairSheetOpen] = useState(false)
  const [confirmPair, setConfirmPair] = useState<Pair | null>(null)
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [detailWord, setDetailWord] = useState<WordDetail | null>(null)
  const [toast, setToast] = useState('')
  const [offline, setOffline] = useState(
    () => typeof navigator !== 'undefined' && !navigator.onLine,
  )

  useEffect(() => {
    const onOnline = () => setOffline(false)
    const onOffline = () => setOffline(true)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  const loadWords = useCallback(() => {
    api
      .listWords(pair?.from, pair?.to)
      .then((res) => setWords(res.data))
      .catch(() => setToast('Could not load words — check your connection'))
  }, [pair])

  useEffect(() => {
    loadWords()
  }, [loadWords])

  const dirFilters = pair
    ? [
        ['all', 'All'],
        [
          `${pair.from}-${pair.to}`,
          `${pair.from.toUpperCase()} → ${pair.to.toUpperCase()}`,
        ],
        [
          `${pair.to}-${pair.from}`,
          `${pair.to.toUpperCase()} → ${pair.from.toUpperCase()}`,
        ],
      ]
    : [['all', 'All']]

  let list = [...words]
  if (filter !== 'all') {
    const [src, tgt] = filter.split('-')
    list = list.filter((w) => w.lang === src && w.targetLang === tgt)
  }
  if (sort === 'count') list.sort((a, b) => b.lookups - a.lookups)
  else list.sort((a, b) => a.term.localeCompare(b.term))

  const totalCount = words.length
  const stuckCount = words.filter((w) => w.lookups >= 15).length
  const todayCount = words.filter((w) => isToday(w.lastSeenAt)).length

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 1800)
  }

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
        title="My Words"
        subtitle="Sorted by lookup count"
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

        {/* Stats row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 8,
            marginBottom: 12,
          }}
        >
          <StatTile
            label="Total"
            value={totalCount}
            tint="var(--bg-card)"
            color="var(--text-primary)"
          />
          <StatTile
            label="Stuck"
            value={stuckCount}
            tint="color-mix(in oklch, var(--danger) 12%, transparent)"
            color="var(--danger)"
          />
          <StatTile
            label="Today"
            value={todayCount}
            tint="var(--accent-tint)"
            color="var(--accent)"
          />
        </div>

        {/* Filter pills + sort toggle */}
        <div
          style={{
            display: 'flex',
            gap: 6,
            marginBottom: 10,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            alignItems: 'center',
          }}
        >
          {dirFilters.map(([id, label]) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              style={{
                padding: '6px 12px',
                borderRadius: 100,
                fontSize: 11.5,
                fontWeight: 500,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: filter === id ? 'var(--accent)' : 'var(--border)',
                background:
                  filter === id ? 'var(--accent-tint)' : 'var(--bg-card)',
                color: filter === id ? 'var(--accent)' : 'var(--text-muted)',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <button
            onClick={() => setSort((s) => (s === 'count' ? 'az' : 'count'))}
            style={{
              padding: '6px 12px',
              borderRadius: 100,
              fontSize: 11.5,
              fontWeight: 500,
              cursor: 'pointer',
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
              color: 'var(--text-muted)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
            }}
          >
            <TrendUpIcon /> {sort === 'count' ? 'By count' : 'A–Z'}
          </button>
        </div>

        {/* Word list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {list.length === 0 ? (
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
                No words in this view.
              </div>
              <div
                style={{
                  fontSize: 11.5,
                  color: 'var(--text-hint)',
                  marginTop: 4,
                }}
              >
                Translate one to add it here.
              </div>
            </div>
          ) : (
            list.map((w) => (
              <button
                key={w.id}
                onClick={() => setDetailWord(w)}
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
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <span
                      style={{
                        fontSize: 14.5,
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                      }}
                    >
                      {w.term}
                    </span>
                    <LangChip lang={w.lang} size="sm" />
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: 'var(--text-hint)',
                      marginTop: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
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
          onSave={() => {
            showToast('Saved to My Words')
            loadWords()
          }}
        />
      )}
      {detailWord && (
        <WordDetailSheet
          word={detailWord}
          onClose={() => setDetailWord(null)}
          onRemove={async () => {
            await api.unsaveWord(detailWord.id)
            setDetailWord(null)
            loadWords()
            showToast('Removed from list')
          }}
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
