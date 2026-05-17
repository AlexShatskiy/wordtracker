'use client'
import { useState, useEffect, useRef } from 'react'

interface Props {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}

export function SearchInput({ value, onChange, placeholder = 'Search a word…' }: Props) {
  const [local, setLocal] = useState(value)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { setLocal(value) }, [value])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    setLocal(v)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => onChange(v), 500)
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={local}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-[13px] px-4 pr-10 py-3 text-[13px] font-medium text-[var(--tx-primary)] placeholder:text-[var(--tx-hint)] outline-none focus:border-[var(--accent-bd)] transition-colors"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--tx-hint)] pointer-events-none">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </span>
    </div>
  )
}
