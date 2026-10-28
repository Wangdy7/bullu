import { useMemo, useState, type CSSProperties } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  BadgePercent,
  Check,
  Coffee,
  MapPin,
  Printer,
  Sparkles,
  Store,
} from 'lucide-react'
import { useApp } from '../app-context'
import { studentDeals } from '../data'
import { useLocalStorage } from '../lib/useLocalStorage'
import { cn } from '../lib/utils'
import { Reveal } from '../components/Reveal'
import { LocalizedPage } from '../components/LocalizedPage'

const dealCategories = ['全部', '餐饮', '打印', '文具', '生活'] as const

const categoryIcons = {
  餐饮: Coffee,
  打印: Printer,
  文具: BadgePercent,
  生活: Store,
}

export function DealsPage() {
  const { toast, navigate, user, openAuth, t } = useApp()
  const [category, setCategory] = useState<(typeof dealCategories)[number]>('全部')
  const [claimed, setClaimed] = useLocalStorage<string[]>('bullu-claimed-deals', [])

  const filtered = useMemo(
    () => studentDeals.filter((deal) => category === '全部' || deal.category === category),
    [category],
  )

  const claimDeal = (id: string, partner: string) => {
    if (!user) {
      openAuth()
      return
    }
    setClaimed((current) => (current.includes(id) ? current : [...current, id]))
    toast(t('已领取 {partner} 的学生优惠，出示 BullU 页面即可使用。', { partner }))
  }

  return (
    <LocalizedPage>
      <main className="inner-page deals-page">
      <section className="page-width compact-page-head">
        <div>
          <span className="eyebrow">
            <span>STUDENT DEALS</span>
            <i />
            CAMPUS PARTNERS
          </span>
          <h1>学生优惠</h1>
          <p>校园附近的合作商家，为 UKM 学生留了一点小小的好意。</p>
        </div>
        <button className="button button--soft" onClick={() => navigate('merchant')}>
          <Store size={16} strokeWidth={2} /> 成为校园伙伴
        </button>
      </section>

      <div className="page-width">
        <Reveal>
          <div className="deals-hero">
            <div className="deals-hero__copy">
              <span className="deals-hero__eyebrow">
                <Sparkles size={13} strokeWidth={2} /> SHOW YOUR STUDENT SIDE
              </span>
              <h2>学生证，<br />本来就该有点用。</h2>
              <p>出示 BullU 学生页面，在合作商家享受专属优惠。所有推广内容都会明确标记 Sponsored。</p>
              <div className="deals-hero__actions">
                <button className="button button--white" onClick={() => claimDeal('coffee', 'The Daily Grind')}>
                  <Coffee size={16} strokeWidth={2} /> 领取咖啡优惠
                </button>
                <button className="button button--glass" onClick={() => navigate('merchant')}>
                  商家合作 <ArrowRight size={15} strokeWidth={2} />
                </button>
              </div>
            </div>
            <div className="deals-hero__image">
              <img src="./images/coffee.jpg" alt="咖啡" />
              <span className="deals-hero__sticker">
                15% OFF
                <small>STUDENT DEAL</small>
              </span>
            </div>
            <span className="deals-hero__orb" aria-hidden="true" />
          </div>
        </Reveal>

        <div className="deals-toolbar">
          <div className="filter-chips">
            {dealCategories.map((item) => (
              <button
                key={item}
                className={cn('filter-chip', category === item && 'is-active')}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <span className="sponsored-inline">
            <span>SPONSORED</span> 合作商家内容
          </span>
        </div>

        <div className="deals-grid">
          {filtered.map((deal, index) => {
            const Icon = categoryIcons[deal.category]
            const isClaimed = claimed.includes(deal.id)
            return (
              <Reveal key={deal.id} delay={index * 60}>
                <article className="deal-card" style={{ '--deal-bg': deal.color } as CSSProperties}>
                  <div className="deal-card__image">
                    <img src={deal.image} alt={deal.title} loading="lazy" />
                    <span className="deal-card__offer">{deal.offer}</span>
                    {deal.sponsored && <span className="deal-card__sponsored">SPONSORED</span>}
                  </div>
                  <div className="deal-card__body">
                    <span className="deal-card__partner">
                      <span>
                        <Icon size={15} strokeWidth={2} />
                      </span>
                      {deal.partner}
                    </span>
                    <h3>{deal.title}</h3>
                    <p>{deal.description}</p>
                    <span className="deal-card__meta">
                      <MapPin size={12} strokeWidth={2} /> {deal.distance}
                    </span>
                    <div className="deal-card__foot">
                      <span>{deal.category}</span>
                      <button
                        className={cn('deal-claim', isClaimed && 'is-claimed')}
                        onClick={() => claimDeal(deal.id, deal.partner)}
                      >
                        {isClaimed ? (
                          <>
                            <Check size={13} strokeWidth={2.6} /> 已领取
                          </>
                        ) : (
                          <>
                            领取优惠 <ArrowUpRight size={14} strokeWidth={2} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>

        <div className="deals-disclosure">
          <BadgePercent size={17} strokeWidth={1.8} />
          <p>
            BullU 会明确标记所有合作商家内容。商家不能影响普通学生讨论、校园地点信息或二手商品的排序。
            优惠规则以商家现场说明为准。
          </p>
        </div>

        <Reveal>
          <div className="partner-cta">
            <div>
              <span className="eyebrow eyebrow--light">
                <span>FOR CAMPUS PARTNERS</span>
                <i />
                商家合作
              </span>
              <h2>被下一位学生看见。</h2>
              <p>如果你的店就在 UKM 附近，欢迎成为 BullU 的校园伙伴。</p>
            </div>
            <button className="button button--white" onClick={() => navigate('merchant')}>
              了解合作方案 <ArrowUpRight size={16} strokeWidth={2} />
            </button>
          </div>
        </Reveal>
      </div>
    </main>
    </LocalizedPage>
  )
}
