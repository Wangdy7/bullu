import { useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  MapPin,
  RotateCcw,
  Search,
} from 'lucide-react'
import { useApp } from '../app-context'
import { campusLocations } from '../data'
import { MapboxGlobe } from './MapboxGlobe'
import { categoryColors } from './CampusMap2D'

const shortcutIds = ['library', 'pusanika', 'zaaba', 'bus']
const shortcutLabels: Record<string, string> = {
  library: '图书馆',
  pusanika: 'Pusanika',
  zaaba: "Kolej Za'ba",
  bus: '巴士总站',
}

const activityBars = [42, 58, 51, 74, 66, 88, 79]

export function GlobeHero() {
  const { navigate, openSearch, t } = useApp()
  const [arrived, setArrived] = useState(false)
  const [replaySignal, setReplaySignal] = useState(0)

  const shortcuts = shortcutIds.flatMap((id) => {
    const location = campusLocations.find((item) => item.id === id)
    return location ? [location] : []
  })

  const replay = () => {
    setArrived(false)
    setReplaySignal((signal) => signal + 1)
  }

  return (
    <section className="globe-hero">
      <div className="globe-hero__atmosphere" aria-hidden="true" />

      <div className="page-width globe-hero__content">
        <div className="globe-hero__copy">
          <span className="eyebrow">
            <span>BULLU · UKM BANGI</span>
            <i />
            {t('WORLD → CAMPUS')}
          </span>
          <h1>
            {t('从世界，')}
            <br />
            <span>{t('回到 UKM。')}</span>
          </h1>
          <p className="globe-hero__sub">{t('你的校园，你的生活，我们的社区。')}</p>
          <p className="globe-hero__lede">
            {t('报到、找教室、买一本二手教材。一个入口，装下整个校园生活。')}
          </p>

          <button className="hero-search globe-hero__search" onClick={openSearch}>
            <Search size={19} strokeWidth={2} />
            <span>{t('搜索教学楼、食堂、巴士站或二手好物…')}</span>
            <kbd>⌘ K</kbd>
          </button>

          <div className="globe-hero__actions">
            <button className="button button--blue" onClick={() => navigate('map')}>
              {t('探索校园地图')} <ArrowUpRight size={17} strokeWidth={2.2} />
            </button>
            <button className="button button--soft" onClick={() => navigate('freshman')}>
              {t('我是新生')} <ArrowRight size={16} strokeWidth={2} />
            </button>
          </div>

          <div className="globe-hero__stats">
            <span>
              <strong>
                2,400<sup>+</sup>
              </strong>
              <small>{t('学生')}</small>
            </span>
            <span>
              <strong>10</strong>
              <small>{t('校园地点')}</small>
            </span>
            <span>
              <strong>8</strong>
              <small>{t('校园路线')}</small>
            </span>
          </div>
        </div>

        <div className="globe-hero__visual">
          <div className="globe-hero__mapbox">
            <MapboxGlobe
              onArrived={() => setArrived(true)}
              onDepart={() => setArrived(false)}
              replaySignal={replaySignal}
            />
          </div>

          <aside
            className="globe-card"
            style={{
              opacity: arrived ? 1 : 0,
              transform: arrived ? 'translateY(0)' : 'translateY(12px)',
            }}
            aria-hidden={!arrived}
            inert={!arrived}
          >
            <div className="globe-card__top">
              <span className="globe-card__eyebrow">
                <span className="live-dot" /> UKM BANGI · LIVE
              </span>
              <span className="globe-card__country">MALAYSIA</span>
            </div>
            <div className="globe-card__title">Bangi Campus</div>
            <p className="globe-card__place">Selangor · 2.929°N 101.780°E</p>

            <div className="globe-card__stats">
              <span>
                <small>{t('学生')}</small>
                <strong>
                  2,400<span>+</span>
                </strong>
              </span>
              <span>
                <small>{t('校园地点')}</small>
                <strong>10</strong>
              </span>
              <span>
                <small>{t('路线')}</small>
                <strong>8</strong>
              </span>
            </div>

            <div className="globe-card__chart" aria-hidden="true">
              {activityBars.map((height, index) => (
                <i key={index} style={{ height: `${height}%` }} />
              ))}
            </div>
            <div className="globe-card__chart-label">
              <span>{t('校园活跃度')}</span>
              <span>+12.4%</span>
            </div>

            <button className="globe-card__link" onClick={() => navigate('map')}>
              {t('打开完整地图')} <ArrowUpRight size={14} strokeWidth={2.2} />
            </button>
          </aside>

          <div className="globe-shortcuts">
            <span className="globe-shortcuts__label">
              <MapPin size={13} strokeWidth={2} /> {t('热门地点')}
            </span>
            {shortcuts.map((location) => (
              <button
                key={location.id}
                onClick={() => navigate('map', { targetId: location.id })}
              >
                <i style={{ background: categoryColors[location.category] }} />
                {t(shortcutLabels[location.id] ?? location.name)}
              </button>
            ))}
          </div>

          <div className="globe-visual__foot">
            <span className="globe-hero__live">
              <span className="live-dot" /> {t('2,400+ 位同学 · 10 个校园地点')}
            </span>
            <button className="globe-hero__replay" onClick={replay}>
              <RotateCcw size={13} strokeWidth={2.2} />
              {t('重播俯冲')}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
