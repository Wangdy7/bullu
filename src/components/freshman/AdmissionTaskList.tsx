import { motion, useReducedMotion } from 'motion/react'
import { ChevronRight } from 'lucide-react'
import type { AdmissionStatus, AdmissionTask } from '../../types'
import { admissionIconMap } from './icons'
import { statusLabel } from './status'

interface AdmissionTaskListProps {
  tasks: AdmissionTask[]
  statuses: Record<string, AdmissionStatus>
  onOpen: (task: AdmissionTask) => void
}

export function AdmissionTaskList({ tasks, statuses, onOpen }: AdmissionTaskListProps) {
  const reduce = useReducedMotion()

  return (
    <section className="fc-checklist" id="fc-checklist" aria-labelledby="fc-checklist-title">
      <div className="fc-section-head">
        <div>
          <span className="fc-eyebrow">YOUR CHECKLIST</span>
          <h2 id="fc-checklist-title">你的入学清单</h2>
        </div>
        <span>{tasks.length} 个阶段</span>
      </div>

      <div className="fc-task-rows">
        {tasks.map((task, index) => {
          const Icon = admissionIconMap[task.icon]
          const status = statuses[task.id] ?? 'not_started'
          return (
            <motion.button
              key={task.id}
              className={`fc-task-row is-${status}`}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: reduce ? 0 : 0.42, delay: reduce ? 0 : Math.min(index * 0.035, 0.18) }}
              onClick={() => onOpen(task)}
            >
              <span className="fc-task-row__icon">
                <Icon size={21} strokeWidth={1.7} />
              </span>
              <span className="fc-task-row__copy">
                <strong>{task.title}</strong>
                <small>{statusLabel(status)}</small>
              </span>
              <span className="fc-task-row__number">{task.number}</span>
              <ChevronRight size={17} strokeWidth={1.8} />
            </motion.button>
          )
        })}
      </div>
    </section>
  )
}
