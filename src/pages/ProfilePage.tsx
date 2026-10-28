import {
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  BusFront,
  LogOut,
  MapPin,
  ShoppingBag,
  UserRound,
} from 'lucide-react'
import { useApp } from '../app-context'
import type { View } from '../types'
import { Avatar } from '../components/Avatar'
import { LocalizedPage } from '../components/LocalizedPage'

const quickLinks: Array<{ label: string; view: View; icon: typeof MapPin }> = [
  { label: '校园地图', view: 'map', icon: MapPin },
  { label: '校园巴士', view: 'bus', icon: BusFront },
  { label: '二手市场', view: 'market', icon: ShoppingBag },
  { label: '新生中心', view: 'freshman', icon: BookOpenCheck },
]

export function ProfilePage() {
  const { user, openAuth, logout, navigate, toast, t } = useApp()

  return (
    <LocalizedPage>
      <main className="profile-page">
        <div className="page-width profile-page__inner">
          <span className="eyebrow">
            <span>MY BULLU</span>
            <i />
            {t('个人中心')}
          </span>

          {user ? (
            <>
              <section className="profile-card">
                <div className="profile-card__identity">
                  <Avatar name={user.name} size="lg" />
                  <div>
                    <span className="profile-card__status">
                      <i /> {t('已登录')}
                    </span>
                    <h1>{user.name}</h1>
                    <p>{user.email}</p>
                    <span className="profile-card__badge">
                      <UserRound size={13} strokeWidth={2} />
                      {user.student ? t('UKM 学生') : t('演示身份')}
                    </span>
                  </div>
                </div>
                <button
                  className="profile-card__logout"
                  type="button"
                  onClick={() => {
                    logout()
                    toast(t('已退出登录。'))
                    navigate('home')
                  }}
                >
                  <LogOut size={15} strokeWidth={2} />
                  {t('退出登录')}
                </button>
              </section>

              <section className="profile-links" aria-labelledby="profile-links-title">
                <div className="profile-links__head">
                  <h2 id="profile-links-title">{t('继续探索')}</h2>
                  <button type="button" onClick={() => navigate('home')}>
                    {t('回到首页')} <ArrowUpRight size={14} strokeWidth={2} />
                  </button>
                </div>
                <div className="profile-links__grid">
                  {quickLinks.map((link) => {
                    const Icon = link.icon
                    return (
                      <button key={link.view} type="button" onClick={() => navigate(link.view)}>
                        <span>
                          <Icon size={19} strokeWidth={1.9} />
                        </span>
                        <strong>{t(link.label)}</strong>
                        <ArrowRight size={15} strokeWidth={2} />
                      </button>
                    )
                  })}
                </div>
              </section>
            </>
          ) : (
            <section className="profile-card profile-card--guest">
              <span className="profile-card__guest-icon">
                <UserRound size={26} strokeWidth={1.8} />
              </span>
              <h1>{t('登录 BullU')}</h1>
              <p>{t('登录后管理你的校园信息、收藏和二手发布。')}</p>
              <button className="button button--blue" type="button" onClick={openAuth}>
                {t('加入 BullU')} <ArrowUpRight size={16} strokeWidth={2.1} />
              </button>
            </section>
          )}
        </div>
      </main>
    </LocalizedPage>
  )
}
