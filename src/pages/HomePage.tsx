import { useEffect, useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  BusFront,
  CalendarDays,
  ChevronRight,
  Clock3,
  Compass,
  MapPin,
  ShoppingBag,
  Sparkles,
  UsersRound,
  UtensilsCrossed,
} from 'lucide-react'
import { useApp } from '../app-context'
import {
  communityPosts,
  homepageHighlights,
  marketItems,
  studentDeals,
} from '../data'
import type { View } from '../types'
import { Avatar } from '../components/Avatar'
import { GlobeHero } from '../components/GlobeHero'
import { MobileHome } from '../components/MobileHome'
import { Reveal } from '../components/Reveal'
import { LocalizedPage } from '../components/LocalizedPage'

const studentAvatars = [
  { name: 'Jia Wen', tone: '#1469ff' },
  { name: 'Hafiz', tone: '#0e9f84' },
  { name: 'Nurul', tone: '#df8a51' },
  { name: 'Leo', tone: '#7161e8' },
]

const featureCards = [
  {
    id: 'map',
    view: 'map' as View,
    eyebrow: 'EXPLORE',
    title: '校园地图',
    subtitle: 'Mapbox 地图与 3D，一眼看清整个 UKM。',
    icon: MapPin,
    className: 'feature-card--map',
  },
  {
    id: 'freshman',
    view: 'freshman' as View,
    eyebrow: 'START HERE',
    title: '新生中心',
    subtitle: '从报到到第一堂课，少走一点弯路。',
    icon: BookOpenCheck,
    className: 'feature-card--freshman',
  },
  {
    id: 'market',
    view: 'market' as View,
    eyebrow: 'MARKETPLACE',
    title: '二手市场',
    subtitle: '让好东西留在校园里继续流转。',
    icon: ShoppingBag,
    className: 'feature-card--market',
  },
  {
    id: 'community',
    view: 'community' as View,
    eyebrow: 'TOGETHER',
    title: '校园社区',
    subtitle: '真实经验与同频的人，都在这里。',
    icon: UsersRound,
    className: 'feature-card--community',
  },
]

function MiniMap() {
  return (
    <svg className="mini-map" viewBox="0 0 340 150" aria-hidden="true">
      <path d="M-20 100C50 70 96 86 143 65s92-6 137 21 72 9 110-15" className="mini-map__road" />
      <path d="M54 160c6-58 47-69 84-89s68-34 117-26" className="mini-map__road mini-map__road--thin" />
      <path d="M36 38c55-8 90 14 73 42s4 42 49 42 68 9 78 28" className="mini-map__road mini-map__road--thin" />
      <rect x="74" y="44" width="48" height="28" rx="7" className="mini-map__building" />
      <rect x="139" y="66" width="66" height="36" rx="8" className="mini-map__building" />
      <rect x="220" y="46" width="42" height="35" rx="7" className="mini-map__building mini-map__building--soft" />
      <rect x="231" y="104" width="53" height="25" rx="7" className="mini-map__building" />
      <circle cx="222" cy="98" r="15" className="mini-map__green" />
      <circle cx="88" cy="119" r="13" className="mini-map__green" />
      <circle cx="178" cy="39" r="10" className="mini-map__green" />
      <g className="mini-map__pin">
        <path d="M243 15c-8 0-14 6-14 14 0 11 14 22 14 22s14-11 14-22c0-8-6-14-14-14Z" />
        <circle cx="243" cy="29" r="4.2" />
      </g>
      <g className="mini-map__pin mini-map__pin--green">
        <path d="M98 82c-6 0-11 5-11 11 0 8 11 17 11 17s11-9 11-17c0-6-5-11-11-11Z" />
        <circle cx="98" cy="93" r="3.4" />
      </g>
    </svg>
  )
}

function useMobileHomepage() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 900px)').matches : false,
  )

  useEffect(() => {
    const query = window.matchMedia('(max-width: 900px)')
    const onChange = () => setIsMobile(query.matches)
    onChange()
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return isMobile
}

export function HomePage() {
  const { navigate, openAuth, user, toast, t } = useApp()
  const isMobile = useMobileHomepage()

  if (isMobile) {
    return (
      <LocalizedPage>
        <main className="home-page">
          <MobileHome />
        </main>
      </LocalizedPage>
    )
  }

  const goHighlight = (highlight: (typeof homepageHighlights)[number]) => {
    navigate(highlight.view as View, highlight.targetId ? { targetId: highlight.targetId } : undefined)
  }

  return (
    <LocalizedPage>
      <main className="home-page">
      <GlobeHero />

      <section className="section home-features">
        <div className="page-width">
          <Reveal>
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  <span>EXPLORE BULLU</span>
                  <i />
                  {t('从校园出发')}
                </span>
                <h2>{t('校园里的每一件事，')}<br />{t('都有一个更轻松的入口。')}</h2>
              </div>
              <p className="section-heading__aside">
                {t('不管你是刚落地的新生，还是已经在准备毕业的学长姐，都能在这里找到下一步。')}
              </p>
            </div>
          </Reveal>

          <div className="feature-grid">
            {featureCards.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Reveal key={feature.id} delay={index * 60}>
                  <button
                    className={`feature-card ${feature.className}`}
                    onClick={() => navigate(feature.view)}
                  >
                    <span className="feature-card__head">
                      <span className="feature-card__icon">
                        <Icon size={20} strokeWidth={1.8} />
                      </span>
                      <span className="feature-card__eyebrow">{feature.eyebrow}</span>
                      <span className="feature-card__arrow">
                        <ArrowUpRight size={17} strokeWidth={2} />
                      </span>
                    </span>
                    <span className="feature-card__copy">
                      <strong>{t(feature.title)}</strong>
                      <small>{t(feature.subtitle)}</small>
                    </span>

                    {feature.id === 'map' && (
                      <span className="feature-visual feature-visual--map">
                        <MiniMap />
                        <span className="feature-map-pill">
                          <MapPin size={12} strokeWidth={2} /> Pusanika
                        </span>
                      </span>
                    )}
                    {feature.id === 'freshman' && (
                      <span className="feature-visual feature-visual--steps">
                        <span className="mini-step is-done">
                          <i>01</i>
                          {t('注册报到')}
                        </span>
                        <span className="mini-step is-done">
                          <i>02</i>
                          {t('领取校园卡')}
                        </span>
                        <span className="mini-step">
                          <i>03</i>
                          {t('加入社团')}
                        </span>
                        <span className="mini-step mini-step--muted">
                          <i>04</i>
                          {t('熟悉设施')}
                        </span>
                      </span>
                    )}
                    {feature.id === 'market' && (
                      <span className="feature-visual feature-visual--market">
                        <span className="mini-product mini-product--back">
                          <img src="./images/books.jpg" alt="" />
                          <i>RM65</i>
                        </span>
                        <span className="mini-product">
                          <img src="./images/laptop.jpg" alt="" />
                          <i>RM1,850</i>
                        </span>
                        <span className="market-live-pill">
                          <span className="live-dot" /> {t('263 件在流转')}
                        </span>
                      </span>
                    )}
                    {feature.id === 'community' && (
                      <span className="feature-visual feature-visual--community">
                        <span className="mini-chat mini-chat--one">
                          <Avatar name="Jia Wen" size="xs" />
                          <span>{t('图书馆几点关门？')}</span>
                        </span>
                        <span className="mini-chat mini-chat--two">
                          <Avatar name="Hafiz" size="xs" tone="#0e9f84" />
                          <span>{t('今天到 22:00，三楼还有位置。')}</span>
                        </span>
                        <span className="mini-chat-reaction">
                          <Sparkles size={12} strokeWidth={2} /> {t('2,400+ 同学在这里')}
                        </span>
                      </span>
                    )}
                  </button>
                </Reveal>
              )
            })}
          </div>

          <div className="utility-grid">
            <Reveal delay={80}>
              <button className="utility-card utility-card--bus" onClick={() => navigate('bus')}>
                <span className="utility-card__icon">
                  <BusFront size={20} strokeWidth={1.9} />
                </span>
                <span className="utility-card__copy">
                  <small>CAMPUS BUS</small>
                  <strong>{t('校园巴士')}</strong>
                  <span>{t('Zone A 正在运行 · 下一班 08:42')}</span>
                </span>
                <span className="utility-card__status">
                  <span className="live-dot" /> LIVE
                </span>
                <ChevronRight size={18} strokeWidth={2} />
              </button>
            </Reveal>
            <Reveal delay={140}>
              <button className="utility-card utility-card--deals" onClick={() => navigate('deals')}>
                <span className="utility-card__icon">
                  <Sparkles size={20} strokeWidth={1.9} />
                </span>
                <span className="utility-card__copy">
                  <small>STUDENT DEALS</small>
                  <strong>{t('学生优惠')}</strong>
                  <span>{t('附近 4 家校园伙伴 · 最低 RM8 套餐')}</span>
                </span>
                <span className="utility-card__tag">Sponsored</span>
                <ChevronRight size={18} strokeWidth={2} />
              </button>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section home-today">
        <div className="page-width">
          <Reveal>
            <div className="section-heading section-heading--compact">
              <div>
                <span className="eyebrow">
                  <span>TODAY ON CAMPUS</span>
                  <i />
                  {t('今天')}
                </span>
                <h2>{t('现在出门，刚刚好。')}</h2>
              </div>
              <button className="text-link" onClick={() => navigate('map')}>
                {t('打开完整地图')} <ArrowUpRight size={15} strokeWidth={2} />
              </button>
            </div>
          </Reveal>

          <div className="today-grid">
            {homepageHighlights.map((item, index) => {
              const Icon =
                item.id === 'library' ? BookOpenCheck : item.id === 'food' ? UtensilsCrossed : BusFront
              return (
                <Reveal key={item.id} delay={index * 70}>
                  <button className="today-card" onClick={() => goHighlight(item)}>
                    <span className="today-card__image">
                      <img src={item.image} alt="" />
                    </span>
                    <span className="today-card__body">
                      <span className="today-card__label">
                        <Icon size={13} strokeWidth={2} />
                        {t(item.label)}
                      </span>
                      <strong>{t(item.title)}</strong>
                      <small>{t(item.meta)}</small>
                    </span>
                    <span className="today-card__arrow">
                      <ArrowUpRight size={16} strokeWidth={2} />
                    </span>
                  </button>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section home-market">
        <div className="page-width">
          <Reveal>
            <div className="section-heading section-heading--compact">
              <div>
                <span className="eyebrow">
                  <span>CAMPUS MARKET</span>
                  <i />
                  {t('循环起来')}
                </span>
                <h2>{t('有些东西带不走，')}<br />{t('但可以留给下一位同学。')}</h2>
              </div>
              <button className="text-link" onClick={() => navigate('market')}>
                {t('逛二手市场')} <ArrowUpRight size={15} strokeWidth={2} />
              </button>
            </div>
          </Reveal>

          <div className="home-product-grid">
            {marketItems.slice(0, 4).map((item, index) => (
              <Reveal key={item.id} delay={index * 55}>
                <button
                  className="home-product"
                  onClick={() => navigate('market', { targetId: item.id })}
                >
                  <span className="home-product__image">
                    <img src={item.image} alt={item.title} />
                    {item.featured && <span className="product-boost">{t('推广')}</span>}
                    <span className="home-product__action">
                      <ArrowUpRight size={15} strokeWidth={2} />
                    </span>
                  </span>
                  <span className="home-product__body">
                    <span className="home-product__meta">
                      {t(item.condition)} <i /> {t(item.location)}
                    </span>
                    <strong>{t(item.title)}</strong>
                    <span className="home-product__price">
                      RM {item.price.toLocaleString('en-MY')}
                    </span>
                  </span>
                </button>
              </Reveal>
            ))}
          </div>

          <div className="market-banner">
            <span className="market-banner__icon">
              <ShoppingBag size={20} strokeWidth={1.9} />
            </span>
            <span>
              <strong>{t('宿舍里也有带不走的好东西？')}</strong>
              <small>{t('发一条闲置，让下一位同学刚好找到它。')}</small>
            </span>
            <button className="button button--white button--sm" onClick={() => navigate('market')}>
              {t('发布商品')} <ArrowRight size={14} strokeWidth={2} />
            </button>
          </div>
        </div>
      </section>

      <section className="section home-deals">
        <div className="page-width">
          <Reveal>
            <div className="section-heading section-heading--compact">
              <div>
                <span className="eyebrow">
                  <span>STUDENT DEALS</span>
                  <i />
                  {t('校园附近')}
                </span>
                <h2>{t('学生证，本来就该有点用。')}</h2>
              </div>
              <button className="text-link" onClick={() => navigate('deals')}>
                {t('查看全部优惠')} <ArrowUpRight size={15} strokeWidth={2} />
              </button>
            </div>
          </Reveal>

          <div className="home-deal-grid">
            {studentDeals.slice(0, 3).map((deal, index) => (
              <Reveal key={deal.id} delay={index * 70}>
                <button className="home-deal" onClick={() => navigate('deals')}>
                  <span className="home-deal__img">
                    <img src={deal.image} alt="" />
                  </span>
                  <span className="home-deal__body">
                    <span className="home-deal__top">
                      <span>{deal.partner}</span>
                      {deal.sponsored && <small>SPONSORED</small>}
                    </span>
                    <strong>{t(deal.title)}</strong>
                    <span className="home-deal__bottom">
                      <span>{t(deal.offer)}</span>
                      {t(deal.distance)}
                    </span>
                  </span>
                  <ArrowUpRight size={16} strokeWidth={2} />
                </button>
              </Reveal>
            ))}
          </div>
          <p className="sponsored-note">
            {t('Sponsored 内容由校园合作伙伴提供，并明确标记。普通学生内容不会受付费影响。')}
          </p>
        </div>
      </section>

      <section className="section home-community">
        <div className="page-width">
          <Reveal>
            <div className="community-strip">
              <div className="community-strip__copy">
                <span className="eyebrow eyebrow--light">
                  <span>THE BULLU COMMUNITY</span>
                  <i />
                  {t('一起把校园变简单')}
                </span>
                <h2>{t('一个人的经验，')}<br />{t('一群人的下一步。')}</h2>
                <p>
                  {t('从“XX 在哪里”到“这门课怎么复习”，每一个被认真回答的问题，都会让下一位同学少走一点弯路。')}
                </p>
                <div className="community-strip__actions">
                  <button className="button button--white" onClick={() => navigate('community')}>
                    {t('进入校园社区')} <ArrowUpRight size={16} strokeWidth={2} />
                  </button>
                  <button
                    className="button button--glass"
                    onClick={() => (user ? toast(t('你已经是 BullU 的一员了。')) : openAuth())}
                  >
                    {user ? t('今天也来回答一句') : t('加入 BullU')}
                  </button>
                </div>
                <span className="community-strip__fine">
                  <Sparkles size={13} strokeWidth={2} /> {t('学生免费 · 不替代任何官方渠道')}
                </span>
              </div>

              <div className="community-strip__feed">
                {communityPosts.slice(0, 3).map((post) => (
                  <button
                    key={post.id}
                    className="community-bubble"
                    onClick={() => navigate('community')}
                  >
                    <Avatar name={post.author} size="sm" />
                    <span>
                      <span className="community-bubble__meta">
                        {post.author} <i /> {t(post.topic)}
                      </span>
                      <strong>{t(post.title)}</strong>
                      <small>
                        <UsersRound size={11} strokeWidth={2} /> {t('{count} 条回应', { count: post.comments })}
                      </small>
                    </span>
                  </button>
                ))}
                <div className="community-people">
                  <div className="avatar-stack">
                    {studentAvatars.map((person) => (
                      <Avatar key={person.name} name={person.name} tone={person.tone} size="xs" />
                    ))}
                    <span>+2.4k</span>
                  </div>
                  <span>{t('正在一起建设 BullU')}</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section home-cta-section">
        <div className="page-width">
          <Reveal>
            <div className="home-cta">
              <div className="home-cta__orb home-cta__orb--one" aria-hidden="true" />
              <div className="home-cta__orb home-cta__orb--two" aria-hidden="true" />
              <span className="home-cta__eyebrow">
                <CalendarDays size={14} strokeWidth={2} />
                YOUR CAMPUS, YOUR UNIVERSE
              </span>
              <h2>{t('从第一天起，')}<br />{t('就不必独自摸索。')}</h2>
              <p>{t('打开地图、找到食堂、认识同院同学。你的 UKM 生活，从这里开始。')}</p>
              <div className="home-cta__actions">
                <button className="button button--white" onClick={() => navigate('map')}>
                  {t('探索校园地图')} <ArrowUpRight size={16} strokeWidth={2.2} />
                </button>
                <button
                  className="button button--glass"
                  onClick={() => (user ? navigate('freshman') : openAuth())}
                >
                  {user ? t('继续我的新生清单') : t('免费加入 BullU')}
                  <ArrowRight size={16} strokeWidth={2} />
                </button>
              </div>
              <div className="home-cta__stats">
                <span>
                  <Clock3 size={13} strokeWidth={2} /> {t('平均 3 天完成一次校园物品流转')}
                </span>
                <span>
                  <Compass size={13} strokeWidth={2} /> {t('10 个校园地点已上线')}
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <MobileHome />
    </main>
    </LocalizedPage>
  )
}
