import { useState, type FormEvent } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BadgeCheck,
  Check,
  Eye,
  Megaphone,
  MousePointerClick,
  Sparkles,
  Store,
  Ticket,
  TrendingUp,
  UsersRound,
} from 'lucide-react'
import { useApp } from '../app-context'
import { cn } from '../lib/utils'
import { Reveal } from '../components/Reveal'
import { LocalizedPage } from '../components/LocalizedPage'

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'RM49',
    summary: '把你的店放进校园目录。',
    features: ['商家资料页', '校园伙伴目录展示', '基础访问统计'],
    featured: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 'RM99',
    summary: '让学生真正看见你的优惠。',
    features: ['包含 Starter 全部功能', '学生优惠展示位', '优惠券领取与点击统计'],
    featured: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 'RM199',
    summary: '成为首页上的校园伙伴。',
    features: ['包含 Growth 全部功能', '首页推广位', '专题活动合作与效果报表'],
    featured: false,
  },
]

const chart = [
  { label: '第 1 周', value: 34 },
  { label: '第 2 周', value: 52 },
  { label: '第 3 周', value: 47 },
  { label: '第 4 周', value: 74 },
]

export function MerchantPage() {
  const { toast, user, openAuth, t } = useApp()
  const [form, setForm] = useState({ name: '', shop: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!form.name.trim() || !form.shop.trim() || !form.email.trim()) {
      toast('请填写姓名、店铺名称和联系邮箱。')
      return
    }
    setSubmitted(true)
    toast('已收到合作意向。这是演示环境，不会真的发送资料。')
    setForm({ name: '', shop: '', email: '', message: '' })
  }

  return (
    <LocalizedPage>
      <main className="inner-page merchant-page">
      <section className="merchant-hero">
        <div className="page-width merchant-hero__layout">
          <div className="merchant-hero__copy">
            <span className="eyebrow eyebrow--light">
              <span>FOR CAMPUS PARTNERS</span>
              <i />
              BULLU MERCHANT
            </span>
            <h1>让下一位学生，<br />刚好看见你的店。</h1>
            <p>
              BullU 把校园附近真正有用的商家优惠，带到学生的日常动线里。
              不打扰、不伪装，只在对的时候出现。
            </p>
            <div className="merchant-hero__actions">
              <button
                className="button button--white"
                onClick={() => document.getElementById('merchant-plans')?.scrollIntoView({ behavior: 'smooth' })}
              >
                查看合作方案 <ArrowRight size={16} strokeWidth={2} />
              </button>
              <button
                className="button button--glass"
                onClick={() => (user ? document.getElementById('merchant-contact')?.scrollIntoView({ behavior: 'smooth' }) : openAuth())}
              >
                预约演示
              </button>
            </div>
            <div className="merchant-hero__points">
              <span>
                <Check size={13} strokeWidth={2.6} /> 学生免费
              </span>
              <span>
                <Check size={13} strokeWidth={2.6} /> 广告明确标记
              </span>
              <span>
                <Check size={13} strokeWidth={2.6} /> 随时暂停
              </span>
            </div>
          </div>

          <div className="merchant-hero__visual">
            <div className="merchant-visual-card">
              <div className="merchant-visual-card__head">
                <span>
                  <BarChart3 size={17} strokeWidth={2} /> MERCHANT DASHBOARD
                </span>
                <span>演示数据</span>
              </div>
              <div className="merchant-metrics">
                <span>
                  <small>广告展示</small>
                  <strong>12,480</strong>
                  <i>
                    <TrendingUp size={11} strokeWidth={2} /> +18.4%
                  </i>
                </span>
                <span>
                  <small>广告点击</small>
                  <strong>426</strong>
                  <i>
                    <MousePointerClick size={11} strokeWidth={2} /> 3.4%
                  </i>
                </span>
                <span>
                  <small>优惠券领取</small>
                  <strong>83</strong>
                  <i>
                    <Ticket size={11} strokeWidth={2} /> +21
                  </i>
                </span>
              </div>
              <div className="merchant-chart">
                {chart.map((bar) => (
                  <span key={bar.label}>
                    <i style={{ height: `${bar.value}%` }} />
                    <small>{bar.label}</small>
                  </span>
                ))}
              </div>
              <div className="merchant-visual-card__foot">
                <span>
                  <Eye size={13} strokeWidth={2} /> 本月曝光
                </span>
                <strong>RM99 <small>/ 月</small></strong>
              </div>
            </div>
            <div className="merchant-visual-note">
              <span>
                <Store size={17} strokeWidth={1.9} />
              </span>
              <p>
                <strong>The Daily Grind</strong>
                校园伙伴 · 合作中
              </p>
              <BadgeCheck size={17} strokeWidth={2} />
            </div>
          </div>
        </div>
      </section>

      <section className="section merchant-benefits">
        <div className="page-width merchant-benefits__inner">
          {[
            { icon: Eye, title: '被认真看见', text: '出现在学生真正会打开的校园页面，而不是一个没人看的广告角落。' },
            { icon: Megaphone, title: '清楚标注', text: '所有合作内容都会明确标记 Sponsored，不混进普通学生内容。' },
            { icon: UsersRound, title: '贴近校园', text: '面向 UKM Bangi 学生与附近生活圈，只连接真正相关的人。' },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="merchant-benefit">
                <span>
                  <Icon size={18} strokeWidth={1.9} />
                </span>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="section merchant-plans" id="merchant-plans">
        <div className="page-width">
          <Reveal>
            <div className="section-heading merchant-plans__head">
              <div>
                <span className="eyebrow">
                  <span>PARTNERSHIP PLANS</span>
                  <i />
                  合作方案
                </span>
                <h2>先从适合你的规模开始。</h2>
              </div>
              <p className="section-heading__aside">
                以下方案是用于验证校园商家需求的初始设计，正式上线前会补充明确的展示规则与退款政策。
              </p>
            </div>
          </Reveal>

          <div className="plan-grid">
            {plans.map((plan, index) => (
              <Reveal key={plan.id} delay={index * 70}>
                <div className={cn('plan-card', plan.featured && 'plan-card--featured')}>
                  {plan.featured && (
                    <span className="plan-card__badge">
                      <Sparkles size={12} strokeWidth={2} /> 最受欢迎
                    </span>
                  )}
                  <span className="plan-card__name">{plan.name}</span>
                  <strong className="plan-card__price">
                    {plan.price}
                    <small>/ 月</small>
                  </strong>
                  <p>{plan.summary}</p>
                  <ul>
                    {plan.features.map((feature) => (
                      <li key={feature}>
                        <Check size={13} strokeWidth={2.5} /> {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={cn(
                      'button button--full',
                      plan.featured ? 'button--blue' : 'button--soft',
                    )}
                    onClick={() => {
                      if (!user) {
                        openAuth()
                        return
                      }
                      document.getElementById('merchant-contact')?.scrollIntoView({ behavior: 'smooth' })
                      toast(t('已选择 {plan}，请留下联系方式。', { plan: plan.name }))
                    }}
                  >
                    选择 {plan.name} <ArrowUpRight size={15} strokeWidth={2} />
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="plan-note">
            价格与展示量为初始测试方案，不构成收入或曝光保证。所有广告内容都会标注 Sponsored。
          </p>
        </div>
      </section>

      <section className="section merchant-contact-section" id="merchant-contact">
        <div className="page-width merchant-contact-layout">
          <Reveal>
            <div className="merchant-contact-copy">
              <span className="eyebrow">
                <span>SAY HELLO</span>
                <i />
                聊聊合作
              </span>
              <h2>你的店，<br />离校园只差一次介绍。</h2>
              <p>
                告诉我们你的店在哪里、想让学生知道什么。我们会在演示环境中生成一份合作方案，
                正式上线后接入真实审核与账单流程。
              </p>
              <div className="merchant-contact-note">
                <Sparkles size={15} strokeWidth={2} />
                <span>目前为演示阶段，不会产生真实扣款。</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <form className="merchant-form" onSubmit={submit}>
              <div className="field-row">
                <label className="field">
                  <span>怎么称呼你</span>
                  <span className="field__control">
                    <input
                      value={form.name}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, name: event.target.value }))
                      }
                      placeholder="你的名字"
                    />
                  </span>
                </label>
                <label className="field">
                  <span>店铺名称</span>
                  <span className="field__control">
                    <input
                      value={form.shop}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, shop: event.target.value }))
                      }
                      placeholder="例如：The Daily Grind"
                    />
                  </span>
                </label>
              </div>
              <label className="field">
                <span>联系邮箱</span>
                <span className="field__control">
                  <input
                    value={form.email}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, email: event.target.value }))
                    }
                    type="email"
                    placeholder="hello@yourcafe.com"
                  />
                </span>
              </label>
              <label className="field">
                <span>想对学生说点什么</span>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, message: event.target.value }))
                  }
                  placeholder="店铺位置、主要产品、想提供的学生优惠…"
                />
              </label>
              <button className="button button--blue button--full" type="submit">
                提交合作意向 <ArrowRight size={15} strokeWidth={2} />
              </button>
              {submitted && (
                <p className="form-success">
                  <Check size={14} strokeWidth={2.4} /> 已收到。这是演示提交，不会向外部发送数据。
                </p>
              )}
              <p className="form-note">BullU 只会在获得商家许可后展示品牌与优惠内容。</p>
            </form>
          </Reveal>
        </div>
      </section>
    </main>
    </LocalizedPage>
  )
}
