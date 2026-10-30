import { motion, useReducedMotion } from 'motion/react'
import { ArrowDown, Globe2, MapPin, Sparkles } from 'lucide-react'
import type { StudentAudience } from '../../types'
import { cn } from '../../lib/utils'

interface WelcomeHeroProps {
  audience: StudentAudience
  onAudienceChange: (audience: StudentAudience) => void
  onStart: () => void
}

export function WelcomeHero({ audience, onAudienceChange, onStart }: WelcomeHeroProps) {
  const reduce = useReducedMotion()

  return (
    <section className="fc-hero" aria-labelledby="fc-hero-title">
      <div className="fc-hero__media">
        <motion.img
          src="./images/ukm-campus-sign-clean.jpg"
          alt="UKM Bangi 校园入口标志"
          initial={reduce ? false : { opacity: 0, scale: 1.035 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduce ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="fc-hero__media-copy">
          <span>
            <MapPin size={13} strokeWidth={2} /> UKM · BANGI
          </span>
          <span>2026 / 27</span>
        </div>
      </div>

      <div className="fc-hero__copy">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.08 }}
        >
          <span className="fc-eyebrow">
            <Sparkles size={13} strokeWidth={2} /> WELCOME TO UKM
          </span>
          <h1 id="fc-hero-title">
            你的大学生活，
            <br />
            从这里开始。
          </h1>
          <p className="fc-hero__sub">一切准备，井然有序。</p>
          <p className="fc-hero__desc">
            从文件、体检到注册和选课，按自己的节奏完成每一步。
            进度只保存在本机，不会自动同步到学校系统。
          </p>
        </motion.div>

        <motion.div
          className="fc-hero__bottom"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.55, delay: reduce ? 0 : 0.16 }}
        >
          <div className="fc-audience" role="group" aria-label="选择学生类型">
            <button
              className={cn(audience === 'international' && 'is-active')}
              onClick={() => onAudienceChange('international')}
              aria-pressed={audience === 'international'}
            >
              <Globe2 size={14} strokeWidth={2} /> 国际学生
            </button>
            <button
              className={cn(audience === 'local' && 'is-active')}
              onClick={() => onAudienceChange('local')}
              aria-pressed={audience === 'local'}
            >
              <MapPin size={14} strokeWidth={2} /> 本地学生
            </button>
          </div>
          <button className="fc-hero__start" onClick={onStart}>
            开始我的入学清单 <ArrowDown size={15} strokeWidth={2} />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
