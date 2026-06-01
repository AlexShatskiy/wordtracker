'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppHeader } from '../components/AppHeader'
import { BottomNav } from '../components/BottomNav'
import { SearchInput } from '../components/SearchInput'
import { PairSwitcherSheet } from '../components/PairSwitcherSheet'
import { AddPairConfirmSheet } from '../components/AddPairConfirmSheet'
import { usePair } from '../lib/PairContext'
import { type Pair } from '../lib/pairs'

export default function TranslatePage() {
  const router = useRouter()
  const { pair } = usePair()
  const [query, setQuery] = useState('')
  const [pairSheetOpen, setPairSheetOpen] = useState(false)
  const [confirmPair, setConfirmPair] = useState<Pair | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('wt-pair')
    if (!stored) router.push('/choose-pair')
  }, [router])

  if (!mounted) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AppHeader
        subtitle="Good morning, Anna"
        streak={5}
        onPairSwitcherOpen={() => setPairSheetOpen(true)}
      />

      <main style={{ flex: 1, overflowY: 'auto', padding: '4px 14px 14px' }}>
        <SearchInput value={query} onChange={setQuery} />
      </main>

      <BottomNav onQuickAdd={() => {}} />

      {pairSheetOpen && !confirmPair && (
        <PairSwitcherSheet
          onClose={() => setPairSheetOpen(false)}
          onAddPair={(p) => setConfirmPair(p)}
        />
      )}
      {confirmPair && (
        <AddPairConfirmSheet
          pair={confirmPair}
          onConfirm={() => { setConfirmPair(null); setPairSheetOpen(false) }}
          onCancel={() => setConfirmPair(null)}
        />
      )}
    </div>
  )
}
