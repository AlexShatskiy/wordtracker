'use client'
import { useState } from 'react'
import { AppHeader } from '../../components/AppHeader'
import { BottomNav } from '../../components/BottomNav'
import { PairSwitcherSheet } from '../../components/PairSwitcherSheet'
import { AddPairConfirmSheet } from '../../components/AddPairConfirmSheet'
import { type Pair } from '../../lib/pairs'

export default function WordsPage() {
  const [pairSheetOpen, setPairSheetOpen] = useState(false)
  const [confirmPair, setConfirmPair] = useState<Pair | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AppHeader
        title="My Words"
        subtitle="Sorted by lookup count"
        onPairSwitcherOpen={() => setPairSheetOpen(true)}
      />

      <main style={{ flex: 1, overflowY: 'auto', padding: '4px 14px 14px' }}>
        {/* Word list — added in step 19 */}
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
