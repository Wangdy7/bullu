import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight, MapPin } from 'lucide-react'
import { useApp } from '../../app-context'

const places = [
  { id: 'library', label: '图书馆' },
  { id: 'pusanika', label: 'Pusanika' },
  { id: 'health', label: '健康中心' },
]

export function CampusExploreCard() {
  const { navigate } = useApp()
  const reduce = useReducedMotion()

  return (
    <motion.section
      className="fc-campus"
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="fc-campus__media">
        <img src="./images/students-collab.jpg" alt="UKM 学生在校园交流" />
        <span>
          <MapPin size={13} strokeWidth={2} /> UKM BANGI
        </span>
      </div>
      <div className="fc-campus__copy">
        <span className="fc-eyebrow">CAMPUS EXPLORE</span>
        <h2>先去走一遍校园。</h2>
        <p>图书馆、Pusanika 和健康中心，是新生最常用的三个地点。</p>
        <div className="fc-campus__places">
          {places.map((place) => (
            <button key={place.id} onClick={() => navigate('map', { targetId: place.id })}>
              {place.label}
            </button>
          ))}
        </div>
        <button className="fc-campus__link" onClick={() => navigate('map')}>
          打开完整校园地图 <ArrowRight size={15} strokeWidth={2} />
        </button>
      </div>
    </motion.section>
  )
}
