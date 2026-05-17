'use client'
import { useState } from 'react'
import { AppHeader } from '../components/AppHeader'
import { TabBar } from '../components/TabBar'
import { SearchInput } from '../components/SearchInput'
import { LanguagePill } from '../components/LanguagePill'
import { TranslationCard } from '../components/TranslationCard'
import { QuickAddBar } from '../components/QuickAddBar'
import { BottomNav } from '../components/BottomNav'
import { mockTranslation } from '../lib/mock'

export default function TranslatePage() {
  const [query, setQuery] = useState('')

  return (
    <div className="flex flex-col h-full">
      <AppHeader />
      <TabBar />
      <main className="flex-1 overflow-y-auto px-3 pt-4 pb-3 flex flex-col gap-3">
        <SearchInput value={query} onChange={setQuery} />
        <LanguagePill from="en" to="ru" />
        <TranslationCard
          term={mockTranslation.term}
          lang={mockTranslation.lang}
          phonetic={mockTranslation.phonetic}
          translation={mockTranslation.translation}
          examples={mockTranslation.examples}
        />
      </main>
      <QuickAddBar />
      <BottomNav />
    </div>
  )
}
