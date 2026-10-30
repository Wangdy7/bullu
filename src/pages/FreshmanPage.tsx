import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Mail,
  MessageCircle,
  Search,
  Sparkles,
} from 'lucide-react'
import { useApp } from '../app-context'
import { freshmanFaqs, freshmanResources } from '../data'
import type { FreshmanResource } from '../types'
import { useLocalStorage } from '../lib/useLocalStorage'
import { resourceIconMap } from '../lib/icons'
import { cn } from '../lib/utils'
import { Modal } from '../components/Modal'
import { Reveal } from '../components/Reveal'
import { LocalizedPage } from '../components/LocalizedPage'
import { FreshmanCenter } from '../components/freshman/FreshmanCenter'

export function FreshmanPage() {
  const { navigate, toast, initialSearch, targetId } = useApp()
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
      <FreshmanCenter />

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
