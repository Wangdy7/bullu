import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '../lib/utils'
import { useApp } from '../app-context'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  ariaLabel?: string
  children: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  header?: ReactNode
  bare?: boolean
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function Modal({
  open,
  onClose,
  title,
  ariaLabel,
  children,
  className,
  size = 'md',
  header,
  bare = false,
}: ModalProps) {
  const { t } = useApp()
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    document.body.style.overflow = 'hidden'

    const getFocusable = () =>
      panelRef.current
        ? Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
            (element) => element.getClientRects().length > 0,
          )
        : []

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') return
      const focusable = getFocusable()
      if (focusable.length === 0) {
        event.preventDefault()
        panelRef.current?.focus({ preventScroll: true })
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement
      if (event.shiftKey && (active === first || !panelRef.current?.contains(active))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (active === last || !panelRef.current?.contains(active))) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    const focusTimer = window.setTimeout(() => {
      const target = panelRef.current?.querySelector<HTMLElement>('input, textarea, select')
      if (target) target.focus({ preventScroll: true })
      else panelRef.current?.focus({ preventScroll: true })
    }, 60)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      window.clearTimeout(focusTimer)
      if (previousFocus?.isConnected) {
        window.setTimeout(() => previousFocus.focus({ preventScroll: true }), 0)
      }
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div className="modal-layer">
      <button className="modal__backdrop" aria-label={t('关闭弹窗')} onClick={onClose} />
      <div
        ref={panelRef}
        className={cn('modal', `modal--${size}`, bare && 'modal--bare', className)}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        aria-label={!title ? (ariaLabel ?? t('对话框')) : undefined}
        aria-labelledby={title ? titleId : undefined}
      >
        {header}
        {!bare && (
          <button className="modal__close" onClick={onClose} aria-label={t('关闭')}>
            <X size={18} strokeWidth={2} />
          </button>
        )}
        {title && (
          <h2 className="modal__title" id={titleId}>
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>,
    document.body,
  )
}
