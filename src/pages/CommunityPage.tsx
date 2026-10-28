import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  MessageCircle,
  PenLine,
  Search,
  Sparkles,
  TrendingUp,
  UsersRound,
} from 'lucide-react'
import { useApp } from '../app-context'
import { communityPosts } from '../data'
import type { CommunityPost } from '../types'
import { useLocalStorage } from '../lib/useLocalStorage'
import { cn, uid } from '../lib/utils'
import { Avatar } from '../components/Avatar'
import { Modal } from '../components/Modal'
import { Reveal } from '../components/Reveal'
import { LocalizedPage } from '../components/LocalizedPage'

const topics = ['全部', '校园日常', '学习搭子', '交通出行', '活动', '问答']

const avatarNames = ['Jia Wen', 'Hafiz', 'Nurul', 'Leo']

export function CommunityPage() {
  const { user, toast, initialSearch, navigate, t } = useApp()
  const [posts, setPosts] = useLocalStorage<CommunityPost[]>('bullu-community-posts', [])
  const [liked, setLiked] = useLocalStorage<string[]>('bullu-community-liked', [])
  const [topic, setTopic] = useState('全部')
  const [query, setQuery] = useState(initialSearch ?? '')
  const [sort, setSort] = useState<'new' | 'hot'>('new')
  const [composerOpen, setComposerOpen] = useState(false)
  const [draft, setDraft] = useState({
    title: '',
    body: '',
    topic: '校园日常',
    tone: 'blue',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialSearch) setQuery(initialSearch)
  }, [initialSearch])

  const allPosts = useMemo(() => [...posts, ...communityPosts], [posts])
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const matches = allPosts.filter((post) => {
      const inTopic = topic === '全部' || post.topic === topic
      const inQuery =
        !normalized ||
        `${post.title} ${post.body} ${post.topic} ${post.author}`.toLowerCase().includes(normalized)
      return inTopic && inQuery
    })
    if (sort === 'hot') return [...matches].sort((a, b) => b.likes - a.likes)
    return matches
  }, [allPosts, query, sort, topic])

  const openComposer = () => {
    if (!user) {
      toast('你仍然可以发布；登录后会显示你的学院信息。')
    }
    setComposerOpen(true)
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (draft.title.trim().length < 6) {
      setError('标题至少写 6 个字，让大家一眼看懂。')
      return
    }
    if (draft.body.trim().length < 10) {
      setError('再补充一句吧，让大家知道前因后果。')
      return
    }
    const author = user?.name ?? '访客同学'
    const next: CommunityPost = {
      id: uid('post'),
      author,
      faculty: user?.student ? 'UKM 学生' : 'BullU 演示用户',
      time: '刚刚',
      topic: draft.topic,
      title: draft.title.trim(),
      body: draft.body.trim(),
      likes: 0,
      comments: 0,
      tone: draft.tone,
    }
    setPosts((current) => [next, ...current])
    setDraft({ title: '', body: '', topic: '校园日常', tone: 'blue' })
    setError('')
    setComposerOpen(false)
    setTopic('全部')
    setSort('new')
    toast('讨论已经发布到 BullU 校园社区。')
  }

  const toggleLike = (id: string) => {
    setLiked((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  return (
    <LocalizedPage>
      <main className="inner-page community-page">
      <section className="community-head page-width">
        <div>
          <span className="eyebrow">
            <span>STUDENT COMMUNITY</span>
            <i />
            ASK · SHARE · CONNECT
          </span>
          <h1>校园社区</h1>
          <p>真实经验、具体问题，以及那些值得被分享的校园日常。</p>
        </div>
        <div className="community-head__actions">
          <label className="community-search">
            <Search size={17} strokeWidth={2} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索讨论"
              aria-label="搜索校园社区讨论"
            />
          </label>
          <button className="button button--blue" onClick={openComposer}>
            <PenLine size={16} strokeWidth={2} /> 发起讨论
          </button>
        </div>
      </section>

      <div className="page-width community-layout">
        <section className="community-feed">
          <div className="community-toolbar">
            <div className="filter-chips filter-chips--scroll">
              {topics.map((item) => (
                <button
                  key={item}
                  className={cn('filter-chip', topic === item && 'is-active')}
                  onClick={() => setTopic(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="community-sort">
              <button className={cn(sort === 'new' && 'is-active')} onClick={() => setSort('new')}>
                最新
              </button>
              <button className={cn(sort === 'hot' && 'is-active')} onClick={() => setSort('hot')}>
                热门
              </button>
            </div>
          </div>

          <button className="community-composer" onClick={openComposer}>
            <Avatar name={user?.name ?? t('你')} size="md" />
            <span>今天想和校园里的大家聊点什么？</span>
            <span className="community-composer__tags">
              <i>问答</i>
              <i>分享</i>
              <i>找搭子</i>
            </span>
            <span className="community-composer__send">
              <PenLine size={15} strokeWidth={2} />
            </span>
          </button>

          <div className="community-feed__items">
            {filtered.length === 0 && (
              <div className="empty-state">
                <span className="empty-state__icon">
                  <MessageCircle size={24} strokeWidth={1.7} />
                </span>
                <h3>这个话题还没有人开口。</h3>
                <p>也许你就是第一个值得被回应的人。</p>
                <button className="button button--blue button--sm" onClick={openComposer}>
                  发起讨论
                </button>
              </div>
            )}
            {filtered.map((post, index) => {
              const postLiked = liked.includes(post.id)
              return (
                <Reveal key={post.id} delay={index * 50}>
                  <article className="community-card">
                    <div className={`community-card__accent accent-${post.tone}`} />
                    <div className="community-card__head">
                      <Avatar name={post.author} size="md" />
                      <span>
                        <strong>{post.author}</strong>
                        <small>
                          {post.faculty} · {post.time}
                        </small>
                      </span>
                      <span className="community-card__topic">{post.topic}</span>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.body}</p>
                    <div className="community-card__foot">
                      <button
                        className={cn('community-action', postLiked && 'is-liked')}
                        onClick={() => toggleLike(post.id)}
                        aria-pressed={postLiked}
                      >
                        <Heart
                          size={16}
                          strokeWidth={1.9}
                          fill={postLiked ? 'currentColor' : 'none'}
                        />
                        {post.likes + (postLiked ? 1 : 0)}
                      </button>
                      <button
                        className="community-action"
                        onClick={() => toast('讨论详情与评论将在下一阶段接入。')}
                      >
                        <MessageCircle size={16} strokeWidth={1.9} />
                        {post.comments} 条回应
                      </button>
                      <button
                        className="community-action community-action--end"
                        onClick={() => {
                          navigator.clipboard?.writeText(`${location.origin}/#/community`)
                          toast('讨论链接已复制。')
                        }}
                      >
                        分享
                      </button>
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </div>
        </section>

        <aside className="community-aside">
          <div className="community-side-card community-side-card--blue">
            <span className="community-side-card__eyebrow">
              <UsersRound size={14} strokeWidth={2} /> THE BULLU COMMUNITY
            </span>
            <strong>2,400+ 位同学，正在让校园更简单。</strong>
            <p>问一个问题，分享一次经验，或者只是告诉别人食堂今天有什么。</p>
            <div className="avatar-stack">
              {avatarNames.map((name) => (
                <Avatar key={name} name={name} size="sm" />
              ))}
              <span>+2.4k</span>
            </div>
          </div>

          <div className="community-side-card">
            <span className="community-side-card__eyebrow">
              <TrendingUp size={14} strokeWidth={2} /> TRENDING
            </span>
            <strong>本周热门话题</strong>
            <div className="trend-list">
              {[
                ['期中周生存', 86],
                ['Pusanika 吃什么', 64],
                ['周末搭子', 51],
                ['宿舍小事', 47],
              ].map(([label, count], index) => (
                <button key={label} onClick={() => setQuery(String(label))}>
                  <span>0{index + 1}</span>
                  <strong>#{label}</strong>
                  <small>{count} 条</small>
                </button>
              ))}
            </div>
          </div>

          <div className="community-side-card community-side-card--rules">
            <span className="community-side-card__eyebrow">
              <Sparkles size={14} strokeWidth={2} /> 一起守护这里
            </span>
            <strong>先尊重，再回答。</strong>
            <ul>
              <li>先搜一搜，也许答案已经在了。</li>
              <li>分享真实经验，不替别人下定义。</li>
              <li>重要信息以 UKM 官方通知为准。</li>
            </ul>
            <button
              className="text-link"
              onClick={() => toast('完整社区公约会在正式版本中上线。')}
            >
              阅读社区公约 <ArrowUpRight size={14} strokeWidth={2} />
            </button>
          </div>

          <button className="community-aside-cta" onClick={() => navigate('market')}>
            <span>把书读完了？</span>
            <strong>让它去下一间宿舍。</strong>
            <span>
              去二手市场 <ArrowRight size={14} strokeWidth={2} />
            </span>
          </button>
        </aside>
      </div>

      <section className="page-width community-bottom">
        <div>
          <span className="eyebrow">
            <span>STAY CURIOUS</span>
            <i />
            校园很大，一起探索
          </span>
          <h2>每一个答案，<br />都来自一个愿意停下来的人。</h2>
        </div>
        <button className="button button--soft" onClick={() => openComposer()}>
          <PenLine size={16} strokeWidth={2} /> 留下你的第一个回答
        </button>
      </section>

      <Modal
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        size="md"
        className="compose-modal"
        title="发起一条校园讨论"
      >
        <p className="modal-intro">
          不用写得完美。具体的问题、真实的一点点经验，都可能正好帮到另一个人。
        </p>
        <form className="stack-form" onSubmit={submit}>
          <div className="field-row">
            <label className="field">
              <span>话题</span>
              <span className="field__control field__control--select">
                <UsersRound size={16} strokeWidth={1.9} />
                <select
                  value={draft.topic}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, topic: event.target.value }))
                  }
                >
                  {topics
                    .filter((item) => item !== '全部')
                    .map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                </select>
              </span>
            </label>
            <label className="field">
              <span>卡片颜色</span>
              <span className="field__control field__control--select">
                <Sparkles size={16} strokeWidth={1.9} />
                <select
                  value={draft.tone}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, tone: event.target.value }))
                  }
                >
                  <option value="blue">蓝色</option>
                  <option value="green">绿色</option>
                  <option value="orange">橙色</option>
                  <option value="violet">紫色</option>
                </select>
              </span>
            </label>
          </div>
          <label className="field">
            <span>标题</span>
            <span className="field__control">
              <PenLine size={16} strokeWidth={1.9} />
              <input
                value={draft.title}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, title: event.target.value }))
                }
                placeholder="一句话说清楚你想聊什么"
              />
            </span>
          </label>
          <label className="field">
            <span>具体说说</span>
            <textarea
              rows={5}
              value={draft.body}
              onChange={(event) =>
                setDraft((current) => ({ ...current, body: event.target.value }))
              }
              placeholder="经验、问题、时间地点，或者一点想分享的小事…"
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="button button--soft" onClick={() => setComposerOpen(false)}>
              取消
            </button>
            <button type="submit" className="button button--blue">
              发布讨论 <ArrowUpRight size={15} strokeWidth={2} />
            </button>
          </div>
          <p className="form-note">
            以 {user ? user.name : '访客同学'} 的身份发布 · 请友善发言
          </p>
        </form>
      </Modal>
    </main>
    </LocalizedPage>
  )

}
