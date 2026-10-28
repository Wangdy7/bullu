import { ArrowUpRight, Heart, MapPin } from 'lucide-react'
import { useApp } from '../app-context'
import { Logo } from './Logo'
import type { View } from '../types'

const exploreLinks: Array<{ label: string; view: View }> = [
  { label: '校园地图', view: 'map' },
  { label: '新生中心', view: 'freshman' },
  { label: '二手市场', view: 'market' },
  { label: '校园社区', view: 'community' },
]

const serviceLinks: Array<{ label: string; view: View }> = [
  { label: '校园巴士', view: 'bus' },
  { label: '学生优惠', view: 'deals' },
  { label: '商家合作', view: 'merchant' },
]

export function Footer() {
  const { navigate, toast, openAuth, user, t } = useApp()

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <Logo />
            <p>
              {t('你的校园，你的生活，我们的社区。')}
              <br />
              {t('为 UKM Bangi 学生而建的智慧校园入口。')}
            </p>
            <span className="site-footer__location">
              <MapPin size={13} strokeWidth={2} />
              Bangi, Selangor · Malaysia
            </span>
          </div>

          <div className="site-footer__links">
            <div className="site-footer__column">
              <span className="site-footer__label">{t('探索')}</span>
              {exploreLinks.map((link) => (
                <button key={link.view} onClick={() => navigate(link.view)}>
                  {t(link.label)}
                </button>
              ))}
            </div>
            <div className="site-footer__column">
              <span className="site-footer__label">{t('服务')}</span>
              {serviceLinks.map((link) => (
                <button key={link.view} onClick={() => navigate(link.view)}>
                  {t(link.label)}
                </button>
              ))}
              <button onClick={() => toast(t('搜索功能可以通过右上角放大镜或 ⌘K 打开。'))}>{t('全站搜索')}</button>
            </div>
            <div className="site-footer__column">
              <span className="site-footer__label">{t('关于')}</span>
              <span className="site-footer__text">{t('独立学生项目')}</span>
              <span className="site-footer__text">{t('中文 / English / Bahasa Melayu')}</span>
              <button onClick={() => toast(t('隐私政策与服务条款将在正式上线前提供。'))}>{t('隐私与条款')}</button>
            </div>
          </div>

          <div className="site-footer__cta">
            <span>{t('FOR UKM STUDENTS')}</span>
            <strong>{t('把校园生活，装进一个地方。')}</strong>
            <button onClick={() => (user ? navigate('map') : openAuth())}>
              {user ? t('继续探索') : t('免费加入 BullU')}
              <ArrowUpRight size={15} strokeWidth={2.2} />
            </button>
          </div>
        </div>

        <div className="site-footer__bottom">
          <span>{t('© 2026 BullU · 独立学生项目，非 UKM 官方平台。')}</span>
          <span>
            {t('部分摄影素材来自 Unsplash')}
            <i>·</i>
            <Heart size={11} strokeWidth={2} fill="currentColor" /> {t('Built for campus life')}
          </span>
        </div>
      </div>
      <div className="site-footer__word" aria-hidden="true">
        BullU
      </div>
    </footer>
  )
}
