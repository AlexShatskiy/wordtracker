export function QuickAddBar() {
  return (
    <div className="flex gap-2 px-3 py-3 bg-[var(--bg-screen)] border-t border-[var(--border)]">
      <input
        type="text"
        placeholder="Quick add a word..."
        className="flex-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-[10px] px-4 py-2.5 text-[13px] text-[var(--tx-primary)] placeholder:text-[var(--tx-hint)] outline-none"
      />
      <button className="w-10 h-10 flex items-center justify-center rounded-[10px] bg-[var(--accent)] text-white shrink-0">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  )
}
