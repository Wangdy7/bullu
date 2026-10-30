import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import type { AdmissionTask, AdmissionStatus } from '../../types'
import { admissionIconMap } from './icons'
import { statusLabel } from './status'

interface NextTaskCardProps {
  task: AdmissionTask
  status: AdmissionStatus
  onOpen: () => void
}

export function NextTaskCard({ task, status, onOpen }: NextTaskCardProps) {
  const reduce = useReducedMotion()
  const Icon = admissionIconMap[task.icon]

  return (
    <motion.section
      className="fc-next"
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.1 }}
    >
      <div className="fc-next__head">
        <span className="fc-eyebrow">
          UP NEXT <i /> 下一步
        </span>
        <ArrowUpRight size={16} strokeWidth={1.8} />
      </div>
      <div className="fc-next__body">
        <div>
          <h2>{task.title}</h2>
          <p>{task.subtitle}</p>
          <span className="fc-next__status">{statusLabel(status)}</span>
        </div>
        <span className="fc-next__icon">
          <Icon size={25} strokeWidth={1.7} />
        </span>
      </div>
      <button className="fc-next__button" onClick={onOpen}>
        查看任务详情 <ArrowRight size={16} strokeWidth={2} />
      </button>
    </motion.section>
  )
}
