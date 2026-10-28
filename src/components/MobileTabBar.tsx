import { BusFront, House, MapPin, UserRound, type LucideIcon } from 'lucide-react'
import { useApp } from '../app-context'
import type { View } from '../types'

const tabs: Array<{ view: View; label: string; icon: LucideIcon }> = [
  { view: 'home', label: '首页', icon: House },
  { view: 'map', label: '地图', icon: MapPin },
  { view: 'bus', label: '校园巴士', icon: BusFront },
  { view: 'profile', label: '个人中心', icon: UserRound },
]

export function MobileTabBar() {
  const { view, navigate, t } = useApp()

  return (
    <nav className="mobile-tabbar" aria-label={t('移动端导航')}>
      {tabs.map((tab) => {
        const Icon = tab.icon
        const active = view === tab.view
        return (
          <button
            key={tab.view}
            type="button"
            className={active ? 'is-active' : undefined}
            aria-current={active ? 'page' : undefined}
            onClick={() => navigate(tab.view)}
          >
            <Icon size={21} strokeWidth={active ? 2.25 : 1.8} />
            <span>{t(tab.label)}</span>
          </button>
        )
      })}
    </nav>
  )
}
