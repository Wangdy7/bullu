import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Search,
  Sparkles,
} from 'lucide-react'
import { useApp } from '../app-context'
import { freshmanFaqs, freshmanResources, freshmanSteps, resourceQuickFacts } from '../data'
import type { FreshmanResource } from '../types'
import { useLocalStorage } from '../lib/useLocalStorage'
import { resourceIconMap, stepIconMap } from '../lib/icons'
import { cn } from '../lib/utils'
import { Modal } from '../components/Modal'
import { Reveal } from '../components/Reveal'
import { LocalizedPage } from '../components/LocalizedPage'

export function FreshmanPage() {
  const { navigate, toast, initialSearch, targetId, t } = useApp()
  const [completed, setCompleted] = useLocalStorage<string[]>('bullu-freshman-steps', [])
  const [readResources, setReadResources] = useLocalStorage<string[]>('bullu-read-resources', [])
  const [openResource, setOpenResource] = useState<FreshmanResource | null>(null)
  const [query, setQuery] = useState(initialSearch ?? '')
  const [category, setCategory] = useState('全部')
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  useEffect(() => {
    if (initialSearch) setQuery(initialSearch)
  }, [initialSearch])

  useEffect(() => {
    if (!targetId) return
    const resource = freshmanResources.find((item) => item.id === targetId)
    if (resource) setOpenResource(resource)
  }, [targetId])

  const categories = useMemo(
    () => ['全部', ...Array.from(new Set(freshmanResources.map((item) => item.category)))],
    [],
  )

  const filteredResources = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return freshmanResources.filter((item) => {
      const inCategory = category === '全部' || item.category === category
      const inQuery =
        !normalized ||
        `${item.title} ${item.subtitle} ${item.category} ${item.intro}`
          .toLowerCase()
          .includes(normalized)
      return inCategory && inQuery
    })
  }, [category, query])

  const completedCount = completed.length
  const progress = (completedCount / freshmanSteps.length) * 100

  const toggleStep = (id: string) => {
    const isComplete = completed.includes(id)
    setCompleted((current) =>
      isComplete ? current.filter((item) => item !== id) : [...current, id],
    )
    toast(isComplete ? '已取消这一步的完成标记。' : '已完成，一步步来就好。')
  }

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleResourceOpen = (resource: FreshmanResource) => {
    setOpenResource(resource)
    if (!readResources.includes(resource.id)) {
      setReadResources((current) => [...current, resource.id])
    }
  }

  return (
    <LocalizedPage>
      <main className="freshman-page">
      <section className="freshman-hero">
        <div className="freshman-hero__wash" aria-hidden="true" />
        <div className="page-width freshman-hero__layout">
          <div className="freshman-hero__copy">
            <span className="eyebrow">
              <span>FRESHMAN CENTER</span>
              <i />
              第一次来 UKM
            </span>
            <h1>新生中心</h1>
            <p className="freshman-hero__sub">从报到第一天起，轻松开启你的校园生活。</p>
            <p className="freshman-hero__desc">
              注册、校园卡、选课、住宿……那些刚来时最容易卡住的几步，
              已经有人替你走过，并整理在这里。
            </p>
            <div className="freshman-hero__actions">
              <button className="button button--blue" onClick={() => scrollTo('freshman-checklist')}>
                开始我的入学清单 <ArrowRight size={16} strokeWidth={2} />
              </button>
              <button className="button button--soft" onClick={() => scrollTo('freshman-resources')}>
                查看新生指南 <BookOpenCheck size={16} strokeWidth={2} />
              </button>
            </div>
            <div className="freshman-facts">
              {resourceQuickFacts.map((fact) => (
                <span key={fact.label}>
                  <strong>{fact.value}</strong>
                  {fact.label}
                </span>
              ))}
            </div>
          </div>

          <div className="freshman-hero__visual">
            <span className="freshman-hero__deco" aria-hidden="true" />
            <div className="freshman-hero__photo">
              <img src="./images/students-collab.jpg" alt="学生在校园里一起学习" />
              <span className="freshman-photo__tag">
                <MapPin size={12} strokeWidth={2} /> UKM · Bangi
              </span>
            </div>
            <div className="freshman-mini-card">
              <span className="freshman-mini-card__icon">
                <Sparkles size={17} strokeWidth={2} />
              </span>
              <span>
                <small>{t('新生清单')}</small>
                <strong>{completedCount} / 4 步已完成</strong>
              </span>
              <span className="freshman-mini-card__progress">
                <i style={{ width: `${progress}%` }} />
              </span>
            </div>
            <div className="freshman-float-note">
              <span>第一次一个人来？</span>
              <strong>别担心，从这里开始。</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="page-width freshman-stepper-section" id="freshman-checklist">
        <Reveal>
          <div className="freshman-stepper">
            <div className="freshman-stepper__head">
              <div>
                <span className="eyebrow">
                  <span>YOUR FIRST WEEK</span>
                  <i />
                  入学准备
                </span>
                <h2>四步，把新的校园生活安顿好。</h2>
              </div>
              <div className="freshman-stepper__progress">
                <span>
                  <strong>{completedCount}</strong> / {freshmanSteps.length}
                </span>
                <div>
                  <i style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>

            <div className="freshman-steps">
              {freshmanSteps.map((step, index) => {
                const StepIcon = stepIconMap[step.icon]
                const done = completed.includes(step.id)
                const active = !done && completedCount === index
                return (
                  <button
                    key={step.id}
                    className={cn('freshman-step', done && 'is-done', active && 'is-current')}
                    onClick={() => toggleStep(step.id)}
                    aria-pressed={done}
                  >
                    <span className="freshman-step__top">
                      <span className="freshman-step__number">
                        {done ? <Check size={14} strokeWidth={2.8} /> : `0${index + 1}`}
                      </span>
                      <span className="freshman-step__icon">
                        <StepIcon size={18} strokeWidth={1.8} />
                      </span>
                    </span>
                    <strong>{step.title}</strong>
                    <small>{step.subtitle}</small>
                    <span className="freshman-step__detail">{step.detail}</span>
                    <span className="freshman-step__status">
                      {done ? '已完成' : active ? '现在做这一步' : '点击标记完成'}
                    </span>
                    {index < freshmanSteps.length - 1 && <span className="freshman-step__line" />}
                  </button>
                )
              })}
            </div>

            <div className="freshman-stepper__foot">
              <span>
                <Sparkles size={13} strokeWidth={2} />
                进度自动保存在当前浏览器中
              </span>
              {completedCount > 0 && (
                <button onClick={() => setCompleted([])}>重置进度</button>
              )}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="section freshman-resources" id="freshman-resources">
        <div className="page-width">
          <Reveal>
            <div className="section-heading section-heading--compact">
              <div>
                <span className="eyebrow">
                  <span>NEW STUDENT TOOLKIT</span>
                  <i />
                  新生必备资源
                </span>
                <h2>先把最常用的答案放在手边。</h2>
              </div>
              <p className="section-heading__aside">
                这些内容是学生团队根据真实经验整理的，不是官方公告的替代品。
                涉及学校政策时，请以 UKM 最新通知为准。
              </p>
            </div>
          </Reveal>

          <div className="resource-toolbar">
            <label className="search-field resource-search">
              <Search size={17} strokeWidth={2} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索：宿舍、选课、校园卡…"
                aria-label="搜索新生指南"
              />
              {query && (
                <button onClick={() => setQuery('')} aria-label="清除搜索">
                  ×
                </button>
              )}
            </label>
            <div className="filter-chips filter-chips--scroll">
              {categories.map((item) => (
                <button
                  key={item}
                  className={cn('filter-chip', category === item && 'is-active')}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {filteredResources.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state__icon">
                <CircleHelp size={24} strokeWidth={1.7} />
              </span>
              <h3>清单里还没有这个答案。</h3>
              <p>换个关键词，或者去校园社区问问学长姐。</p>
              <button className="button button--blue button--sm" onClick={() => navigate('community')}>
                去校园社区
              </button>
            </div>
          ) : (
            <div className="resource-grid">
              {filteredResources.map((resource, index) => {
                const Icon = resourceIconMap[resource.icon]
                return (
                  <Reveal key={resource.id} delay={index * 60}>
                    <button
                      className={cn(
                        'resource-card',
                        `resource-card--${resource.icon}`,
                        readResources.includes(resource.id) && 'is-read',
                      )}
                      onClick={() => handleResourceOpen(resource)}
                    >
                      <span className="resource-card__top">
                        <span className="resource-card__icon">
                          <Icon size={22} strokeWidth={1.7} />
                        </span>
                        <span className="resource-card__meta">
                          {resource.category}
                          <i />
                          <Clock3 size={11} strokeWidth={2} /> {resource.readTime}
                        </span>
                        {readResources.includes(resource.id) && (
                          <span className="resource-card__read">
                            <Check size={11} strokeWidth={3} /> 已读
                          </span>
                        )}
                      </span>
                      <span className="resource-card__copy">
                        <strong>{resource.title}</strong>
                        <small>{resource.subtitle}</small>
                      </span>
                      <span className="resource-card__footer">
                        <span>打开指南</span>
                        <span className="resource-card__arrow">
                          <ArrowUpRight size={15} strokeWidth={2} />
                        </span>
                      </span>
                    </button>
                  </Reveal>
                )
              })}
            </div>
          )}

          <div className="freshman-help">
            <div className="freshman-help__icon">
              <MessageCircle size={20} strokeWidth={1.8} />
            </div>
            <div>
              <strong>手册里没有你想问的？</strong>
              <span>去校园社区发一条提问，通常很快就会有同学回答。</span>
            </div>
            <button className="button button--white button--sm" onClick={() => navigate('community')}>
              问一个问题 <ArrowRight size={14} strokeWidth={2} />
            </button>
          </div>
        </div>
      </section>

      <section className="section freshman-faq">
        <div className="page-width freshman-faq__layout">
          <Reveal className="freshman-faq__intro">
            <span className="eyebrow">
              <span>BEFORE YOU ASK</span>
              <i />
              常见问题
            </span>
            <h2>第一次来，<br />不知道从哪里问起？</h2>
            <p>
              先把最常见的几个问题放在这里。如果仍然找不到答案，
              校园社区里总有人愿意接住你的问题。
            </p>
            <div className="freshman-faq__contact">
              <span className="freshman-faq__mail">
                <Mail size={17} strokeWidth={1.8} />
              </span>
              <span>
                <small>学生团队邮箱</small>
                <strong>hello@bullu.app</strong>
              </span>
              <button
                onClick={() => toast('演示版本不会真的发送邮件。可以先去校园社区提问。')}
                aria-label="发送邮件"
              >
                <ArrowUpRight size={16} strokeWidth={2} />
              </button>
            </div>
          </Reveal>

          <Reveal className="freshman-accordion" delay={80}>
            {freshmanFaqs.map((faq, index) => {
              const open = openFaq === index
              return (
                <div key={faq.q} className={cn('faq-item', open && 'is-open')}>
                  <button
                    className="faq-item__question"
                    onClick={() => setOpenFaq(open ? null : index)}
                    aria-expanded={open}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={18} strokeWidth={2} />
                  </button>
                  {open && <p>{faq.a}</p>}
                </div>
              )
            })}
          </Reveal>
        </div>
      </section>

      <Modal
        open={Boolean(openResource)}
        onClose={() => setOpenResource(null)}
        size="lg"
        className="resource-modal"
        ariaLabel={openResource ? openResource.title : '新生指南'}
      >
        {openResource && (
          <>
            <div className="resource-modal__head">
              <span className="resource-modal__icon">
                {(() => {
                  const Icon = resourceIconMap[openResource.icon]
                  return <Icon size={25} strokeWidth={1.7} />
                })()}
              </span>
              <span className="eyebrow">
                <span>{openResource.category}</span>
                <i />
                {openResource.readTime}阅读
              </span>
              <h2>{openResource.title}</h2>
              <p>{openResource.intro}</p>
            </div>
            <div className="resource-modal__body">
              {openResource.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 20)}>{paragraph}</p>
              ))}
              <div className="resource-tips">
                <strong>
                  <Sparkles size={14} strokeWidth={2} /> 学长姐的小提示
                </strong>
                <ul>
                  {openResource.tips.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="resource-modal__foot">
              <span>
                <Mail size={13} strokeWidth={2} />
                内容由 BullU 学生团队整理，以 UKM 官方信息为准。
              </span>
              <div>
                <button
                  className="button button--soft button--sm"
                  onClick={() => {
                    toast('已保存到阅读记录。')
                    setReadResources((current) =>
                      current.includes(openResource.id) ? current : [...current, openResource.id],
                    )
                  }}
                >
                  <Check size={14} strokeWidth={2} /> 标记为已读
                </button>
                <button
                  className="button button--blue button--sm"
                  onClick={() => {
                    setOpenResource(null)
                    navigate('community')
                  }}
                >
                  去社区提问 <ArrowRight size={14} strokeWidth={2} />
                </button>
              </div>
            </div>
          </>
        )}
      </Modal>
    </main>
    </LocalizedPage>
  )
}
