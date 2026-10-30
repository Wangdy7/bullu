import { motion, useReducedMotion } from 'motion/react'
import type { StudentAudience } from '../../types'

interface AdmissionProgressProps {
  percent: number
  completedCount: number
  totalCount: number
  audience: StudentAudience
}

export function AdmissionProgress({
  percent,
  completedCount,
  totalCount,
  audience,
}: AdmissionProgressProps) {
  const reduce = useReducedMotion()
  const complete = totalCount > 0 && completedCount === totalCount

  return (
    <section className="fc-progress-card" aria-labelledby="fc-progress-title">
      <div className="fc-progress-card__top">
        <div>
          <span className="fc-eyebrow" id="fc-progress-title">
            入学进度
          </span>
          <div className="fc-progress-card__value">
            {percent}
            <span>%</span>
          </div>
          <p className="fc-progress-card__meta">
            已完成 <strong>{completedCount}</strong> / {totalCount} 项
            <i />
            {audience === 'international' ? '国际学生流程' : '本地学生流程'}
          </p>
        </div>
        <span className={complete ? 'fc-status-pill is-complete' : 'fc-status-pill'}>
          {complete ? '全部完成' : '进行中'}
        </span>
      </div>

      <div
        className="fc-progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label="入学任务完成进度"
      >
        <motion.span
          initial={reduce ? false : { width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: reduce ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </section>
  )
}
