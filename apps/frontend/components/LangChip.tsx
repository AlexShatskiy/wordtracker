import { type LangCode, LANG_CHIP_COLORS } from '../lib/pairs'

type Size = 'sm' | 'md' | 'lg'

type Props = {
  lang: LangCode
  size?: Size
}

const SIZES: Record<Size, { width: number; height: number; radius: number; fontSize: number }> = {
  sm: { width: 26, height: 22, radius: 7,  fontSize: 10.5 },
  md: { width: 36, height: 36, radius: 11, fontSize: 13   },
  lg: { width: 48, height: 48, radius: 14, fontSize: 16   },
}

export function LangChip({ lang, size = 'md' }: Props) {
  const { fg, bg } = LANG_CHIP_COLORS[lang]
  const { width, height, radius, fontSize } = SIZES[size]

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width,
        height,
        borderRadius: radius,
        backgroundColor: bg,
        color: fg,
        fontSize,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {lang.toUpperCase()}
    </span>
  )
}
