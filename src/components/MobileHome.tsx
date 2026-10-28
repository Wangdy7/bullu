import { useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  BusFront,
  GraduationCap,
  MapPin,
  Search,
  ShoppingBag,
  type LucideIcon,
} from 'lucide-react'
import { useApp } from '../app-context'
import type { View } from '../types'

interface MobileFeature {
  id: string
  view: View
  title: string
  en: string
  description: string
  tag?: string
  icon: LucideIcon
}

const mobileFeatures: MobileFeature[] = [
  {
    id: 'map',
    view: 'map',
    title: '校园地图',
    en: 'Campus Map',
    description: '找教学楼、图书馆、食堂、宿舍，一键规划路线。',
    tag: '核心功能',
    icon: MapPin,
  },
  {
    id: 'bus',
    view: 'bus',
    title: '校园巴士',
    en: 'Campus Bus',
    description: '查看校园巴士路线、站点和班次，轻松规划出行。',
    icon: BusFront,
  },
  {
    id: 'market',
    view: 'market',
    title: '二手市场',
    en: 'Student Marketplace',
    description: '买卖课本、家具、电器、自行车等校园二手物品。',
    tag: '高频使用',
    icon: ShoppingBag,
  },
  {
    id: 'freshman',
    view: 'freshman',
    title: '新生中心',
    en: 'Freshman Hub',
    description: '入学指南、选课帮助、校园生活和常见问题。',
    tag: '新生必看',
    icon: GraduationCap,
  },
]

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

export function MobileHome() {
  const { navigate, openSearch, t } = useApp()
  const [mapFailed, setMapFailed] = useState(false)
  const previewMapUrl = MAPBOX_TOKEN
    ? `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+2378e8(101.78,2.93)/101.78,2.93,13.2,0/720x360@2x?access_token=${MAPBOX_TOKEN}&logo=false&attribution=false`
    : ''

  return (
    <div className="mobile-home">
      <section className="mobile-hero" aria-labelledby="mobile-home-title">
        <div className="mobile-hero__photo-wrap">
          <img
            className="mobile-hero__photo"
            src="./images/ukm-campus-sign.jpg"
            alt="UKM Bangi 校园入口的红黄蓝 UKM 标志"
          />
          <div className="mobile-hero__wash" aria-hidden="true" />
        </div>
        <div className="mobile-hero__copy">
          <h1 id="mobile-home-title">
            <span>{t('你的校园，')}</span>
            <span>
              {t('尽在 ')}
              <b>BullU。</b>
            </span>
          </h1>
          <p>{t('探索 UKM，发现更简单的校园生活。')}</p>
        </div>
      </section>

      <button className="mobile-home-search" onClick={openSearch} type="button">
        <Search size={19} strokeWidth={2} />
        <span>{t('搜索教学楼、食堂、巴士站或二手好物...')}</span>
      </button>

      <section className="mobile-section mobile-services" aria-label={t('校园服务')}>
        <div className="mobile-section__head">
          <div>
            <span className="mobile-kicker">CAMPUS ESSENTIALS</span>
            <h2>{t('校园服务')}</h2>
          </div>
          <span className="mobile-section__note">{t('常用入口')}</span>
        </div>

        <div className="mobile-feature-grid">
          {mobileFeatures.map((feature) => {
            const Icon = feature.icon
            return (
              <button
                key={feature.id}
                className="mobile-feature-card"
                type="button"
                onClick={() => navigate(feature.view)}
              >
                <span className="mobile-feature-card__top">
                  <span className="mobile-feature-card__icon">
                    <Icon size={21} strokeWidth={1.9} />
                  </span>
                  {feature.tag && <span className="mobile-feature-card__tag">{t(feature.tag)}</span>}
                </span>
                <span className="mobile-feature-card__title">{t(feature.title)}</span>
                <span className="mobile-feature-card__en">{feature.en}</span>
                <span className="mobile-feature-card__description">{t(feature.description)}</span>
                <span className="mobile-feature-card__arrow" aria-hidden="true">
                  <ArrowRight size={17} strokeWidth={2} />
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="mobile-section mobile-map-section" aria-labelledby="mobile-map-title">
        <div className="mobile-map-section__head">
          <div>
            <h2 id="mobile-map-title">{t('探索 UKM 校园')}</h2>
            <p>{t('查看完整地图，发现更多地点。')}</p>
          </div>
          <button className="mobile-map-section__link" type="button" onClick={() => navigate('map')}>
            {t('进入地图')}
            <ArrowUpRight size={15} strokeWidth={2.1} />
          </button>
        </div>

        <button
          className="mobile-map-preview"
          type="button"
          onClick={() => navigate('map')}
          aria-label={t('打开 UKM 校园地图')}
        >
          {previewMapUrl && !mapFailed ? (
            <img
              src={previewMapUrl}
              alt="UKM Bangi 校园地图预览"
              loading="lazy"
              decoding="async"
              onError={() => setMapFailed(true)}
            />
          ) : (
            <span className="mobile-map-preview__placeholder">
              <MapPin size={25} strokeWidth={1.8} />
              <span>{mapFailed ? t('地图暂时无法加载，点击进入完整地图') : t('打开完整校园地图')}</span>
            </span>
          )}
          <span className="mobile-map-preview__label">
            <MapPin size={13} strokeWidth={2.2} />
            UKM Bangi
          </span>
          <span className="mobile-map-preview__attribution">© Mapbox © OpenStreetMap</span>
        </button>
      </section>
    </div>
  )
}
