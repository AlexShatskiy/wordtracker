'use client'
import { useState, useEffect, useRef } from 'react'
import { SheetOverlay } from './SheetOverlay'
import { LangChip } from './LangChip'
import { detectLang } from '../lib/words'
import { LANG_NAMES, type Pair } from '../lib/pairs'
import { api, type TranslateResponse, type SavedWord } from '../lib/api'

const CloseIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <line x1="4" y1="4" x2="14" y2="14" />
    <line x1="14" y1="4" x2="4" y2="14" />
  </svg>
)

const SparkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
    <path
      d="M7 1v3M7 10v3M1 7h3M10 7h3M3 3l2 2M9 9l2 2M11 3 9 5M5 9l-2 2"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
)

type Props = {
  pair: Pair
  onClose: () => void
  onSave: (id: string) => void
}

export function QuickAddSheet({ pair, onClose, onSave }: Props) {
  const [q, setQ] = useState('')
  const [result, setResult] = useState<TranslateResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [recents, setRecents] = useState<SavedWord[]>([])
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    ref.current?.focus()
  }, [])

  useEffect(() => {
    api
      .listWords(pair.from, pair.to)
      .then((res) => setRecents(res.data.slice(0, 5)))
      .catch(() => {})
  }, [pair])

  const detected = q ? detectLang(q) : pair.from

  // Debounced translate
  useEffect(() => {
    const trimmed = q.trim()
    if (!trimmed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResult(null)
      setLoading(false)
      return
    }
    setLoading(true)
    const timer = setTimeout(async () => {
      try {
        const res = await api.translate(
          trimmed,
          detected === pair.to ? pair.to : pair.from,
          detected === pair.to ? pair.from : pair.to,
        )
        setResult(res)
      } catch {
        setResult(null)
      } finally {
        setLoading(false)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [q, detected, pair])

  async function handleSave() {
    if (!result) return
    await api.saveWord(result.id)
    onSave(result.id)
    onClose()
  }

  return (
    <SheetOverlay onClose={onClose}>
      <div
        style={{
          background: 'var(--bg-screen)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '14px 16px 8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            Quick add
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-hint)',
              cursor: 'pointer',
              padding: 4,
            }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Input */}
        <div style={{ padding: '8px 16px 0' }}>
          <input
            ref={ref}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type a word…"
            style={{
              width: '100%',
              height: 48,
              padding: '0 14px',
              border: '1px solid var(--border)',
              borderRadius: 14,
              background: 'var(--bg-card)',
              fontSize: 17,
              fontWeight: 500,
              color: 'var(--text-primary)',
              outline: 'none',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
          {q && (
            <div
              style={{
                marginTop: 10,
                display: 'flex',
                gap: 6,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '4px 9px',
                  borderRadius: 100,
                  background: 'var(--accent-tint)',
                  color: 'var(--accent)',
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                }}
              >
                Detected · {LANG_NAMES[detected]}
              </span>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '4px 8px 4px 4px',
                  borderRadius: 100,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                }}
              >
                <LangChip lang={pair.from} size="sm" />
                <span style={{ fontSize: 10, color: 'var(--text-hint)' }}>
                  ⇄
                </span>
                <LangChip lang={pair.to} size="sm" />
              </div>
            </div>
          )}
        </div>

        {/* Recent chips (when empty) */}
        {!q && recents.length > 0 && (
          <div style={{ padding: '14px 16px 0' }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: 'var(--text-hint)',
                letterSpacing: '0.07em',
                marginBottom: 8,
              }}
            >
              RECENT
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {recents.map((w) => (
                <button
                  key={w.id}
                  onClick={() => setQ(w.term)}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 100,
                    padding: '6px 12px',
                    fontSize: 12,
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {w.term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Preview / spinner */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
          {q && result && (
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: 14,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--text-hint)',
                  letterSpacing: '0.07em',
                  marginBottom: 8,
                }}
              >
                PREVIEW
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 8,
                  flexWrap: 'wrap',
                }}
              >
                <span
                  style={{
                    fontSize: 20,
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                  }}
                >
                  {result.term}
                </span>
                <span
                  style={{
                    fontSize: 11.5,
                    fontStyle: 'italic',
                    color: 'var(--text-hint)',
                  }}
                >
                  {result.phonetic}
                </span>
              </div>
              <div
                style={{
                  fontSize: 13.5,
                  fontWeight: 500,
                  color: 'var(--accent)',
                  marginTop: 4,
                }}
              >
                {result.translation}
              </div>
              {result.examples[0] && (
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 11.5,
                    color: 'var(--text-muted)',
                    borderLeft: '2px solid var(--accent)',
                    paddingLeft: 10,
                    lineHeight: 1.5,
                  }}
                >
                  {result.examples[0]}
                </div>
              )}
            </div>
          )}
          {q && loading && !result && (
            <div
              style={{
                padding: '22px 12px',
                textAlign: 'center',
                color: 'var(--text-hint)',
              }}
            >
              <SparkIcon />
              <div style={{ marginTop: 8, fontSize: 12 }}>Translating…</div>
            </div>
          )}
          {q && !loading && !result && (
            <div
              style={{
                padding: '22px 12px',
                textAlign: 'center',
                color: 'var(--text-hint)',
                fontSize: 12,
              }}
            >
              No result found.
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '10px 16px 18px',
            display: 'flex',
            gap: 10,
            borderTop: '1px solid var(--border)',
          }}
        >
          <button
            onClick={onClose}
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
            Skip
          </button>
          <button
            disabled={!result}
            onClick={handleSave}
            style={{
              flex: 2,
              height: 44,
              borderRadius: 13,
              background: 'var(--accent)',
              color: '#fff',
              border: 'none',
              fontSize: 13,
              fontWeight: 600,
              cursor: result ? 'pointer' : 'not-allowed',
              opacity: result ? 1 : 0.4,
              fontFamily: 'inherit',
            }}
          >
            Save word
          </button>
        </div>
      </div>
    </SheetOverlay>
  )
}
