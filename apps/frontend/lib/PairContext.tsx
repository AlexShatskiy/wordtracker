'use client'
import { createContext, useContext, useState, type ReactNode } from 'react'
import { type Pair, pairsEqual } from './pairs'

type PairState = {
  pair: Pair | null
  pairs: Pair[]
  setPair: (p: Pair) => void
  addPair: (p: Pair) => void
}

const PairContext = createContext<PairState | null>(null)

export function PairProvider({ children }: { children: ReactNode }) {
  const [pair, setPairState] = useState<Pair | null>(() => {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem('wt-pair')
    return stored ? (JSON.parse(stored) as Pair) : null
  })
  const [pairs, setPairs] = useState<Pair[]>(() => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem('wt-pairs')
    return stored ? (JSON.parse(stored) as Pair[]) : []
  })

  function setPair(p: Pair) {
    setPairState(p)
    localStorage.setItem('wt-pair', JSON.stringify(p))
    if (!pairs.some((existing) => pairsEqual(existing, p))) {
      const next = [...pairs, p]
      setPairs(next)
      localStorage.setItem('wt-pairs', JSON.stringify(next))
    }
  }

  function addPair(p: Pair) {
    if (pairs.some((existing) => pairsEqual(existing, p))) {
      setPairState(p)
      localStorage.setItem('wt-pair', JSON.stringify(p))
      return
    }
    const next = [...pairs, p]
    setPairs(next)
    localStorage.setItem('wt-pairs', JSON.stringify(next))
    setPairState(p)
    localStorage.setItem('wt-pair', JSON.stringify(p))
  }

  return (
    <PairContext.Provider value={{ pair, pairs, setPair, addPair }}>
      {children}
    </PairContext.Provider>
  )
}

export function usePair(): PairState {
  const ctx = useContext(PairContext)
  if (!ctx) throw new Error('usePair must be used inside PairProvider')
  return ctx
}
