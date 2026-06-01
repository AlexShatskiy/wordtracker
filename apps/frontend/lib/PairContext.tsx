'use client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { type Pair, pairsEqual } from './pairs'

type PairState = {
  pair: Pair | null
  pairs: Pair[]
  setPair: (p: Pair) => void
  addPair: (p: Pair) => void
}

const PairContext = createContext<PairState | null>(null)

export function PairProvider({ children }: { children: ReactNode }) {
  const [pair, setPairState] = useState<Pair | null>(null)
  const [pairs, setPairs] = useState<Pair[]>([])

  useEffect(() => {
    const storedPair = localStorage.getItem('wt-pair')
    const storedPairs = localStorage.getItem('wt-pairs')
    if (storedPair) setPairState(JSON.parse(storedPair))
    if (storedPairs) setPairs(JSON.parse(storedPairs))
  }, [])

  function setPair(p: Pair) {
    setPairState(p)
    localStorage.setItem('wt-pair', JSON.stringify(p))
    if (!pairs.some(existing => pairsEqual(existing, p))) {
      const next = [...pairs, p]
      setPairs(next)
      localStorage.setItem('wt-pairs', JSON.stringify(next))
    }
  }

  function addPair(p: Pair) {
    if (pairs.some(existing => pairsEqual(existing, p))) {
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
