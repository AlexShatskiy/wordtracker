import { AppHeader } from '../../components/AppHeader'
import { TabBar } from '../../components/TabBar'
import { WordList } from '../../components/WordList'
import { QuickAddBar } from '../../components/QuickAddBar'
import { BottomNav } from '../../components/BottomNav'
import { mockWords } from '../../lib/mock'

export default function WordsPage() {
  return (
    <div className="flex flex-col h-full">
      <AppHeader />
      <TabBar />
      <main className="flex-1 overflow-y-auto px-3 pt-4 pb-3">
        <WordList words={mockWords} />
      </main>
      <QuickAddBar />
      <BottomNav />
    </div>
  )
}
