import { Check } from 'lucide-react'
import { useApp } from '../app-context'
import { translateText } from '../i18n'

export function Toast({ message }: { message: string | null }) {
  const { language } = useApp()
  const display = message ? translateText(language, message) : message
  return (
    <div className={`toast ${message ? 'toast--visible' : ''}`} role="status" aria-live="polite">
      <span className="toast__icon">
        <Check size={14} strokeWidth={2.6} />
      </span>
      {display}
    </div>
  )
}
