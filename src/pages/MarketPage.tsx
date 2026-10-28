import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Camera,
  Check,
  ChevronDown,
  Clock3,
  Heart,
  ImagePlus,
  MapPin,
  MessageCircle,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Tag,
  X,
} from 'lucide-react'
import { useApp } from '../app-context'
import { marketItems } from '../data'
import type { MarketCategory, MarketItem } from '../types'
import { useLocalStorage } from '../lib/useLocalStorage'
import { cn, formatRM, uid } from '../lib/utils'
import { Avatar } from '../components/Avatar'
import { Modal } from '../components/Modal'
import { Reveal } from '../components/Reveal'
import { LocalizedPage } from '../components/LocalizedPage'

const categories = [
  '全部',
  '电子设备',
  '书籍教材',
  '家具',
  '运动出行',
  '生活用品',
] as const satisfies readonly MarketCategory[]

const conditions = ['全新', '九成新', '八成新', '有使用痕迹'] as const
const priceBuckets = [
  { id: 'all', label: '全部价格', min: 0, max: Infinity },
  { id: 'low', label: 'RM0 – 50', min: 0, max: 50 },
  { id: 'mid', label: 'RM51 – 200', min: 51, max: 200 },
  { id: 'high', label: 'RM201 – 500', min: 201, max: 500 },
  { id: 'premium', label: 'RM500 以上', min: 501, max: Infinity },
] as const

type SortMode = 'latest' | 'price-low' | 'price-high'

function MarketCard({
  item,
  saved,
  onOpen,
  onToggleSaved,
}: {
  item: MarketItem
  saved: boolean
  onOpen: () => void
  onToggleSaved: () => void
}) {
  const { t } = useApp()
  const seller = t(item.seller)
  return (
    <LocalizedPage>
      <article className="listing-card">
      <div className="listing-card__image">
        <button className="listing-card__image-button" onClick={onOpen} aria-label={`查看 ${item.title}`}>
          {item.image ? (
            <img src={item.image} alt={item.title} loading="lazy" />
          ) : (
            <span className="listing-card__placeholder">
              <Tag size={32} strokeWidth={1.4} />
              <small>等待一张好照片</small>
            </span>
          )}
        </button>
        {item.featured && (
          <span className="listing-card__promoted">
            <Sparkles size={11} strokeWidth={2.2} /> 推广
          </span>
        )}
        <button
          className={cn('listing-card__heart', saved && 'is-saved')}
          onClick={onToggleSaved}
          aria-label={saved ? '取消收藏' : '收藏商品'}
        >
          <Heart size={16} strokeWidth={2} fill={saved ? 'currentColor' : 'none'} />
        </button>
        <span className="listing-card__condition">{item.condition}</span>
      </div>
      <button className="listing-card__body" onClick={onOpen}>
        <span className="listing-card__meta">
          {item.category}
          <i />
          {item.time}
        </span>
        <strong>{item.title}</strong>
        <span className="listing-card__price">{formatRM(item.price)}</span>
        <span className="listing-card__footer">
          <span className="listing-card__seller">
            <Avatar name={seller} size="xs" />
            {seller}
          </span>
          <span>
            <MapPin size={11} strokeWidth={2} />
            {item.location}
          </span>
        </span>
      </button>
      </article>
    </LocalizedPage>
  )
}

export function MarketPage() {
  const { user, toast, initialSearch, targetId } = useApp()
  const [items, setItems] = useLocalStorage<MarketItem[]>('bullu-market-items', marketItems)
  const [favorites, setFavorites] = useLocalStorage<string[]>('bullu-market-favorites', [])
  const [category, setCategory] = useState<(typeof categories)[number]>('全部')
  const [conditionFilter, setConditionFilter] = useState<string[]>([])
  const [priceBucket, setPriceBucket] = useState<(typeof priceBuckets)[number]['id']>('all')
  const [sort, setSort] = useState<SortMode>('latest')
  const [query, setQuery] = useState(initialSearch ?? '')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [contacted, setContacted] = useState(false)
  const [publishOpen, setPublishOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [draft, setDraft] = useState({
    title: '',
    category: '电子设备' as Exclude<MarketCategory, '全部'>,
    condition: '九成新',
    price: '',
    location: 'Pusanika 附近',
    description: '',
  })
  const [draftImage, setDraftImage] = useState('')
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (initialSearch) setQuery(initialSearch)
  }, [initialSearch])

  useEffect(() => {
    if (!targetId) return
    const item = items.find((entry) => entry.id === targetId)
    if (item) {
      setSelectedId(item.id)
      setCategory('全部')
      setConditionFilter([])
      setPriceBucket('all')
      setQuery('')
    }
  }, [targetId, items])

  const selectedItem = items.find((item) => item.id === selectedId) ?? null
  const bucket = priceBuckets.find((entry) => entry.id === priceBucket) ?? priceBuckets[0]

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const filtered = items.filter((item) => {
      const inCategory = category === '全部' || item.category === category
      const inPrice = item.price >= bucket.min && item.price <= bucket.max
      const inCondition =
        conditionFilter.length === 0 || conditionFilter.includes(item.condition)
      const inQuery =
        !normalized ||
        `${item.title} ${item.description} ${item.category} ${item.seller}`
          .toLowerCase()
          .includes(normalized)
      return inCategory && inPrice && inCondition && inQuery
    })
    if (sort === 'price-low') return [...filtered].sort((a, b) => a.price - b.price)
    if (sort === 'price-high') return [...filtered].sort((a, b) => b.price - a.price)
    return filtered
  }, [bucket.max, bucket.min, category, conditionFilter, items, query, sort])

  const activeFilterCount =
    (category !== '全部' ? 1 : 0) +
    (conditionFilter.length > 0 ? 1 : 0) +
    (priceBucket !== 'all' ? 1 : 0)

  const resetFilters = () => {
    setCategory('全部')
    setConditionFilter([])
    setPriceBucket('all')
    setQuery('')
    setSort('latest')
  }

  const toggleFavorite = (id: string) => {
    const exists = favorites.includes(id)
    setFavorites((current) =>
      exists ? current.filter((item) => item !== id) : [...current, id],
    )
    toast(exists ? '已取消收藏。' : '已收藏这件好物。')
  }

  const toggleCondition = (value: string) => {
    setConditionFilter((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    )
  }

  const handleImage = (file?: File) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast('请选择一张图片。')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const image = new Image()
      image.onload = () => {
        const canvas = document.createElement('canvas')
        const scale = Math.min(1, 900 / Math.max(image.width, image.height))
        canvas.width = Math.max(1, Math.round(image.width * scale))
        canvas.height = Math.max(1, Math.round(image.height * scale))
        const context = canvas.getContext('2d')
        if (!context) return
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        setDraftImage(canvas.toDataURL('image/jpeg', 0.76))
      }
      image.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const submitListing = (event: FormEvent) => {
    event.preventDefault()
    if (draft.title.trim().length < 4) {
      setFormError('商品名称至少写 4 个字。')
      return
    }
    if (!draft.price.trim() || Number.isNaN(Number(draft.price)) || Number(draft.price) < 0) {
      setFormError('请输入一个有效的价格。')
      return
    }
    if (!draft.location.trim()) {
      setFormError('请填写一个大致的交收地点。')
      return
    }
    const newItem: MarketItem = {
      id: uid('listing'),
      title: draft.title.trim(),
      price: Number(draft.price),
      category: draft.category,
      condition: draft.condition,
      seller: user?.name ?? '访客同学',
      faculty: user?.student ? 'UKM 学生' : 'BullU 演示用户',
      location: draft.location.trim(),
      time: '刚刚',
      description:
        draft.description.trim() || '感兴趣的话可以在 BullU 联系我，再约校园内面交。',
      image: draftImage,
      mine: true,
    }
    setItems((current) => [newItem, ...current])
    setPublishOpen(false)
    setDraft({
      title: '',
      category: '电子设备',
      condition: '九成新',
      price: '',
      location: 'Pusanika 附近',
      description: '',
    })
    setDraftImage('')
    setFormError('')
    setCategory('全部')
    setConditionFilter([])
    setPriceBucket('all')
    resetFilters()
    toast('商品已发布到 BullU 二手市场。')
  }

  const openItem = (id: string) => {
    setSelectedId(id)
    setContacted(false)
  }

  return (
    <LocalizedPage>
      <main className="inner-page market-page">
      <section className="market-head">
        <div className="page-width market-head__inner">
          <div>
            <span className="eyebrow">
              <span>MARKETPLACE</span>
              <i />
              CAMPUS CIRCULATION
            </span>
            <h1>二手市场</h1>
            <p>校园内循环，让闲置物品继续发挥价值。</p>
          </div>
          <div className="market-head__actions">
            <label className="market-head__search">
              <Search size={17} strokeWidth={2} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索二手好物"
                aria-label="搜索二手商品"
              />
              {query && (
                <button onClick={() => setQuery('')} aria-label="清除搜索">
                  <X size={14} strokeWidth={2} />
                </button>
              )}
            </label>
            <button className="button button--blue" onClick={() => setPublishOpen(true)}>
              <Plus size={17} strokeWidth={2.2} /> 发布商品
            </button>
          </div>
        </div>
      </section>

      <div className="page-width market-layout">
        <aside className={cn('market-filter', filtersOpen && 'is-open')}>
          <div className="market-filter__head">
            <span>
              <SlidersHorizontal size={16} strokeWidth={2} /> 筛选
            </span>
            <button onClick={resetFilters}>
              <RotateCcw size={13} strokeWidth={2} /> 重置
            </button>
          </div>

          <div className="filter-block">
            <span className="filter-block__title">类别</span>
            <div className="market-category-list">
              {categories.map((item) => {
                const count =
                  item === '全部'
                    ? items.length
                    : items.filter((entry) => entry.category === item).length
                return (
                  <button
                    key={item}
                    className={cn('market-category-row', category === item && 'is-active')}
                    onClick={() => setCategory(item)}
                  >
                    <span>{item}</span>
                    <small>{count}</small>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="filter-block">
            <span className="filter-block__title">价格范围</span>
            <div className="price-options">
              {priceBuckets.map((item) => (
                <button
                  key={item.id}
                  className={cn('price-option', priceBucket === item.id && 'is-active')}
                  onClick={() => setPriceBucket(item.id)}
                >
                  <span className="radio-dot" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-block">
            <span className="filter-block__title">成色</span>
            <div className="condition-options">
              {conditions.map((item) => (
                <button
                  key={item}
                  className={cn('condition-option', conditionFilter.includes(item) && 'is-active')}
                  onClick={() => toggleCondition(item)}
                  aria-pressed={conditionFilter.includes(item)}
                >
                  <span>
                    {conditionFilter.includes(item) && <Check size={11} strokeWidth={3} />}
                  </span>
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-tip">
            <ShieldCheck size={15} strokeWidth={1.9} />
            <span>建议优先选择校内公共区域当面交易。</span>
          </div>
        </aside>

        <section className="market-main">
          <div className="market-toolbar">
            <button
              className="mobile-filter-button"
              onClick={() => setFiltersOpen((open) => !open)}
            >
              <SlidersHorizontal size={15} strokeWidth={2} />
              筛选{activeFilterCount > 0 ? ` · ${activeFilterCount}` : ''}
              <ChevronDown size={14} strokeWidth={2} className={cn(filtersOpen && 'rotate-180')} />
            </button>
            <span className="market-toolbar__count">
              <strong>{filteredItems.length}</strong> 件好物在流转
              {activeFilterCount > 0 && (
                <button onClick={resetFilters}>清除 {activeFilterCount} 个筛选</button>
              )}
            </span>
            <label className="market-sort">
              <span>排序</span>
              <select value={sort} onChange={(event) => setSort(event.target.value as SortMode)}>
                <option value="latest">最新发布</option>
                <option value="price-low">价格从低到高</option>
                <option value="price-high">价格从高到低</option>
              </select>
            </label>
          </div>

          {filteredItems.length === 0 ? (
            <div className="empty-state market-empty">
              <span className="empty-state__icon">
                <Search size={24} strokeWidth={1.7} />
              </span>
              <h3>还没有找到刚好合适的。</h3>
              <p>换个筛选条件，或者发一条求购让同学来找你。</p>
              <button className="button button--blue button--sm" onClick={resetFilters}>
                清除筛选
              </button>
            </div>
          ) : (
            <div className="listing-grid">
              {filteredItems.map((item, index) => (
                <Reveal key={item.id} delay={index * 45}>
                  <MarketCard
                    item={item}
                    saved={favorites.includes(item.id)}
                    onOpen={() => openItem(item.id)}
                    onToggleSaved={() => toggleFavorite(item.id)}
                  />
                </Reveal>
              ))}
            </div>
          )}

          <div className="market-trust">
            <span>
              <ShieldCheck size={16} strokeWidth={1.9} /> 学生优先 · 校内面交
            </span>
            <span>
              <MessageCircle size={16} strokeWidth={1.9} /> 有问题可以随时联系
            </span>
            <span>
              <Sparkles size={16} strokeWidth={1.9} /> 推广内容会明确标记
            </span>
          </div>
        </section>

        <aside className="market-aside">
          <div className="publish-card">
            <span className="publish-card__icon">
              <Tag size={20} strokeWidth={1.8} />
            </span>
            <strong>让闲置去找下一位主人。</strong>
            <p>普通发布永久免费。把物品描述清楚，通常更容易在校园内找到合适的同学。</p>
            <button className="button button--white button--sm" onClick={() => setPublishOpen(true)}>
              立即上架 <ArrowRight size={14} strokeWidth={2} />
            </button>
          </div>

          <div className="market-side-card">
            <span className="market-side-card__eyebrow">
              <Sparkles size={13} strokeWidth={2} /> BOOST
            </span>
            <strong>想让它更快被看到？</strong>
            <p>未来会提供可选的推广置顶服务，普通商品展示不受影响。</p>
            <div className="boost-pills">
              <span>3 天 · RM2</span>
              <span>7 天 · RM4</span>
              <span>14 天 · RM7</span>
            </div>
            <button
              className="text-link"
              onClick={() => toast('推广与支付功能将在下一阶段接入。')}
            >
              了解推广规则 <ArrowUpRight size={14} strokeWidth={2} />
            </button>
          </div>

          <div className="market-side-card market-side-card--safe">
            <span className="market-side-card__eyebrow">
              <ShieldCheck size={13} strokeWidth={2} /> SAFE TRADE
            </span>
            <strong>交易前，先见一面。</strong>
            <p>优先选择 Pusanika、图书馆门口或宿舍大厅等公共区域，确认物品后再付款。</p>
          </div>
        </aside>
      </div>

      <Modal
        open={Boolean(selectedItem)}
        onClose={() => setSelectedId(null)}
        size="xl"
        className="listing-modal"
        ariaLabel={selectedItem?.title ?? '二手商品详情'}
      >
        {selectedItem && (
          <div className="listing-detail">
            <div className="listing-detail__image">
              {selectedItem.image ? (
                <img src={selectedItem.image} alt={selectedItem.title} />
              ) : (
                <span className="listing-card__placeholder">
                  <Tag size={42} strokeWidth={1.3} />
                </span>
              )}
              {selectedItem.featured && (
                <span className="listing-card__promoted">
                  <Sparkles size={11} strokeWidth={2.2} /> 推广
                </span>
              )}
            </div>
            <div className="listing-detail__content">
              <div className="listing-detail__meta">
                <span>{selectedItem.category}</span>
                <span>{selectedItem.condition}</span>
                <small>{selectedItem.time}</small>
              </div>
              <h2>{selectedItem.title}</h2>
              <span className="listing-detail__price">{formatRM(selectedItem.price)}</span>
              <p className="listing-detail__desc">{selectedItem.description}</p>

              <div className="listing-detail__facts">
                <span>
                  <MapPin size={15} strokeWidth={2} />
                  <small>交收地点</small>
                  <strong>{selectedItem.location}</strong>
                </span>
                <span>
                  <Clock3 size={15} strokeWidth={2} />
                  <small>发布时间</small>
                  <strong>{selectedItem.time}</strong>
                </span>
                <span>
                  <ShieldCheck size={15} strokeWidth={2} />
                  <small>成色</small>
                  <strong>{selectedItem.condition}</strong>
                </span>
              </div>

              <div className="listing-seller">
                <Avatar name={selectedItem.seller} size="md" />
                <span>
                  <strong>{selectedItem.seller}</strong>
                  <small>{selectedItem.faculty}</small>
                </span>
                <span className="listing-seller__verified">
                  <Check size={11} strokeWidth={2.8} /> 学生发布
                </span>
              </div>

              {contacted ? (
                <div className="contact-confirm">
                  <Check size={18} strokeWidth={2.4} />
                  <span>
                    <strong>已经发出打招呼消息。</strong>
                    演示版本不会真的发送。正式版会在这里接入站内私信。
                  </span>
                </div>
              ) : (
                <div className="listing-detail__actions">
                  <button
                    className="button button--blue button--full"
                    onClick={() => {
                      setContacted(true)
                      toast('已向卖家发出打招呼消息（演示）。')
                    }}
                  >
                    <MessageCircle size={16} strokeWidth={2} /> 联系 {selectedItem.seller}
                  </button>
                  <button
                    className={cn(
                      'button button--soft listing-fav',
                      favorites.includes(selectedItem.id) && 'is-saved',
                    )}
                    onClick={() => toggleFavorite(selectedItem.id)}
                    aria-label={favorites.includes(selectedItem.id) ? '取消收藏' : '收藏商品'}
                  >
                    <Heart
                      size={17}
                      strokeWidth={2}
                      fill={favorites.includes(selectedItem.id) ? 'currentColor' : 'none'}
                    />
                  </button>
                </div>
              )}

              <p className="listing-detail__fine">
                <ShieldCheck size={13} strokeWidth={2} />
                请在校内公共区域当面验货交易，不要提前转账或提供不必要的个人信息。
              </p>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        size="md"
        className="publish-modal"
        title="发布一件校园闲置"
      >
        <p className="modal-intro">
          真实清晰的照片和具体描述，能让它更快遇到下一位主人。演示版本的数据只保存在本机。
        </p>
        <form className="stack-form" onSubmit={submitListing}>
          <label className="image-upload">
            <input
              type="file"
              accept="image/*"
              onChange={(event) => handleImage(event.target.files?.[0])}
            />
            {draftImage ? (
              <>
                <img src={draftImage} alt="商品预览" />
                <span className="image-upload__replace">
                  <Camera size={14} strokeWidth={2} /> 更换照片
                </span>
              </>
            ) : (
              <span className="image-upload__empty">
                <span>
                  <ImagePlus size={24} strokeWidth={1.6} />
                </span>
                <strong>添加一张商品照片</strong>
                <small>支持 JPG / PNG，建议使用真实、清晰的照片</small>
              </span>
            )}
          </label>

          <label className="field">
            <span>商品名称</span>
            <span className="field__control">
              <Tag size={16} strokeWidth={1.9} />
              <input
                value={draft.title}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, title: event.target.value }))
                }
                placeholder="例如：MacBook Air M1 · 8GB / 256GB"
              />
            </span>
          </label>

          <div className="field-row">
            <label className="field">
              <span>类别</span>
              <span className="field__control field__control--select">
                <Tag size={16} strokeWidth={1.9} />
                <select
                  value={draft.category}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      category: event.target.value as Exclude<MarketCategory, '全部'>,
                    }))
                  }
                >
                  {categories
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
              <span>价格（RM）</span>
              <span className="field__control">
                <span className="field__prefix">RM</span>
                <input
                  value={draft.price}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, price: event.target.value }))
                  }
                  inputMode="numeric"
                  placeholder="0"
                />
              </span>
            </label>
          </div>

          <div className="field-row">
            <label className="field">
              <span>成色</span>
              <span className="field__control field__control--select">
                <Sparkles size={16} strokeWidth={1.9} />
                <select
                  value={draft.condition}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, condition: event.target.value }))
                  }
                >
                  {conditions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </span>
            </label>
            <label className="field">
              <span>交收地点</span>
              <span className="field__control">
                <MapPin size={16} strokeWidth={1.9} />
                <input
                  value={draft.location}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, location: event.target.value }))
                  }
                  placeholder="例如：Pusanika 附近"
                />
              </span>
            </label>
          </div>

          <label className="field">
            <span>补充描述</span>
            <textarea
              rows={4}
              value={draft.description}
              onChange={(event) =>
                setDraft((current) => ({ ...current, description: event.target.value }))
              }
              placeholder="使用情况、瑕疵、配件、方便看货的时间…"
            />
          </label>

          {formError && <p className="form-error">{formError}</p>}

          <div className="modal-actions">
            <button type="button" className="button button--soft" onClick={() => setPublishOpen(false)}>
              取消
            </button>
            <button type="submit" className="button button--blue">
              发布商品 <ArrowRight size={15} strokeWidth={2} />
            </button>
          </div>
          <p className="form-note">
            以 {user ? user.name : '访客同学'} 的身份发布 · 普通发布免费
          </p>
        </form>
      </Modal>
    </main>
    </LocalizedPage>
  )
}
