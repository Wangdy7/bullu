import { cn } from '../lib/utils'

interface LogoProps {
  className?: string
  compact?: boolean
  light?: boolean
}

export function Logo({ className, compact = false, light = false }: LogoProps) {
  return (
    <span className={cn('brand', light && 'brand--light', className)}>
      <span className="brand__mark" aria-hidden="true">
        <img src="./brand/bullu-mark.png" alt="" width="512" height="512" />
      </span>
      {!compact && (
        <span className="brand__copy">
          <strong>BullU</strong>
          <small>UKM · BANGI</small>
        </span>
      )}
    </span>
  )
}
