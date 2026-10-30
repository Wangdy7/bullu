import { useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  HelpCircle,
  MapPin,
  RotateCcw,
  X,
} from 'lucide-react'
import type { AdmissionStatus, AdmissionTask, StudentAudience } from '../../types'
import { admissionIconMap } from './icons'
import { statusOptions } from './status'
import { cn } from '../../lib/utils'

interface TaskDetailSheetProps {
  task: AdmissionTask | null
  status: AdmissionStatus
  checklist: string[]
  audience: StudentAudience
  onClose: () => void
  onStatusChange: (status: AdmissionStatus) => void
  onToggleCheck: (itemId: string) => void
  onGoMap: (task: AdmissionTask) => void
}

export function TaskDetailSheet({
  task,
  status,
  checklist,
  audience,
  onClose,
  onStatusChange,
  onToggleCheck,
  onGoMap,
}: TaskDetailSheetProps) {
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!task) return
    const previous = document.body.style.overflow
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [task, onClose])

  const items = useMemo(
    () => (task ? task.checklist[audience] : []),
    [task, audience],
  )
  const Icon = task ? admissionIconMap[task.icon] : null
  const checkedCount = items.filter((item) => checklist.includes(item.id)).length

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {task && (
        <div className="fc-sheet-layer">
          <motion.button
            className="fc-sheet-backdrop"
            aria-label="关闭任务详情"
            onClick={onClose}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
          />
          <motion.aside
            className="fc-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="fc-sheet-title"
            initial={reduce ? false : { opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: 24 }}
            transition={{ duration: reduce ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="fc-sheet__grab" aria-hidden="true" />
            <button className="fc-sheet__close" onClick={onClose} aria-label="关闭">
              <X size={19} strokeWidth={2} />
            </button>

            <header className="fc-sheet__head">
              <span className="fc-sheet__number">STEP {task.number} / 06</span>
              <div className="fc-sheet__title-row">
                <h2 id="fc-sheet-title">{task.title}</h2>
                {Icon && (
                  <span className="fc-sheet__icon">
                    <Icon size={24} strokeWidth={1.7} />
                  </span>
                )}
              </div>
              <p>{task.subtitle}</p>
            </header>

            <div className="fc-sheet__quick-actions">
              <button onClick={() => onGoMap(task)}>
                <MapPin size={16} strokeWidth={2} />
                {task.location?.label ?? '校园地图'}
              </button>
              <a href={task.officialLinks[0]?.url} target="_blank" rel="noreferrer">
                <ExternalLink size={16} strokeWidth={2} />
                官方入口
              </a>
              <a href="#fc-sheet-faq">
                <HelpCircle size={16} strokeWidth={2} />
                常见问题
              </a>
            </div>

            <div className="fc-sheet__body">
              <section className="fc-sheet__section">
                <div className="fc-sheet__section-head">
                  <h3>准备清单</h3>
                  <span>
                    {checkedCount}/{items.length}
                  </span>
                </div>
                {items.length === 0 ? (
                  <p className="fc-sheet__empty">该流程不适用于当前学生类型。</p>
                ) : (
                  <div className="fc-sheet__checklist">
                    {items.map((item) => {
                      const checked = checklist.includes(item.id)
                      return (
                        <button
                          key={item.id}
                          className={cn('fc-sheet-check', checked && 'is-checked')}
                          onClick={() => onToggleCheck(item.id)}
                          aria-pressed={checked}
                        >
                          <span>{checked && <Check size={13} strokeWidth={3} />}</span>
                          {item.label}
                        </button>
                      )
                    })}
                  </div>
                )}
              </section>

              <section className="fc-sheet__section">
                <div className="fc-sheet__section-head">
                  <h3>当前状态</h3>
                  <span>只能由你手动标记</span>
                </div>
                <div className="fc-status-control" role="group" aria-label="任务状态">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      className={cn(status === option.value && 'is-active')}
                      onClick={() => onStatusChange(option.value)}
                      aria-pressed={status === option.value}
                    >
                      {option.value === 'completed' && <CheckCircle2 size={14} strokeWidth={2} />}
                      {option.label}
                    </button>
                  ))}
                </div>
                <button
                  className={cn('fc-sheet__complete', status === 'completed' && 'is-undo')}
                  onClick={() =>
                    onStatusChange(status === 'completed' ? 'in_progress' : 'completed')
                  }
                >
                  {status === 'completed' ? (
                    <>
                      <RotateCcw size={16} strokeWidth={2} /> 撤销完成
                    </>
                  ) : (
                    <>
                      <Check size={16} strokeWidth={2.6} /> 标记完成
                    </>
                  )}
                </button>
              </section>

              <section className="fc-sheet__section">
                <div className="fc-sheet__section-head">
                  <h3>任务步骤</h3>
                  <span>{task.steps.length} 步</span>
                </div>
                <ol className="fc-sheet-steps">
                  {task.steps.map((step, index) => (
                    <li key={step.title}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <div>
                        <strong>{step.title}</strong>
                        <p>{step.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="fc-sheet__section" id="fc-sheet-faq">
                <div className="fc-sheet__section-head">
                  <h3>常见问题</h3>
                  <span>以学校通知为准</span>
                </div>
                <div className="fc-sheet-faqs">
                  {task.faqs.map((faq) => (
                    <details key={faq.question}>
                      <summary>
                        {faq.question}
                        <ChevronDown size={16} strokeWidth={2} />
                      </summary>
                      <p>{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </section>

              <section className="fc-sheet__section">
                <div className="fc-sheet__section-head">
                  <h3>官方入口</h3>
                  <span>外部网站</span>
                </div>
                <div className="fc-sheet-links">
                  {task.officialLinks.map((link) => (
                    <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
                      {link.label} <ArrowUpRight size={14} strokeWidth={2} />
                    </a>
                  ))}
                </div>
              </section>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
