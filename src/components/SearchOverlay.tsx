import { useEffect, useMemo, useState } from 'react'
import {
  ArrowUpRight,
  BookOpen,
  BusFront,
  Compass,
  MapPin,
  Search,
  ShoppingBag,
  Sparkles,
  UsersRound,
  X,
} from 'lucide-react'
import { useApp } from '../app-context'
import { getSearchEntries } from '../data'
import { Modal } from './Modal'

const groupIcons = {
  页面: Compass,
  校园地点: MapPin,
  新生指南: BookOpen,
  二手好物: ShoppingBag,
  学生优惠: Sparkles,
} as const

const quickSearches = ['图书馆', 'Pusanika', '二手教材', '校园巴士', '宿舍']

export function SearchOverlay() {
  const { searchOpen, closeSearch, navigate, language, t } = useApp()
  const [query, setQuery] = useState('')
  const entries = useMemo(() => getSearchEntries(), [])
  const normalized = query.trim().toLowerCase()
  const results = useMemo(() => {
    if (!normalized) return []
    return entries
      .filter((entry) =>
        `${entry.title} ${entry.meta} ${entry.group} ${t(entry.title)} ${t(entry.meta)} ${t(entry.group)}`
          .toLowerCase()
          .includes(normalized),
      )
      .slice(0, 16)
  }, [entries, normalized, language, t])

  const groups = useMemo(
    () =>
      results.reduce<Record<string, typeof results>>((acc, entry) => {
        acc[entry.group] = acc[entry.group] ? [...acc[entry.group], entry] : [entry]
        return acc
      }, {}),
    [results],
  )

  useEffect(() => {
    if (searchOpen) setQuery('')
  }, [searchOpen])

  const openEntry = (entry: (typeof entries)[number]) => {
    navigate(entry.view, { search: entry.search, targetId: entry.targetId })
    closeSearch()
  }

  return (
    <Modal
      open={searchOpen}
      onClose={closeSearch}
      size="lg"
      className="search-panel"
      ariaLabel={t('搜索 BullU')}
    >
      <div className="search-panel__head">
        <span className="search-panel__eyebrow">
          <Sparkles size={13} strokeWidth={2} /> BullU SEARCH
        </span>
        <h2>{t('今天想在校园里找点什么？')}</h2>
      </div>
      <div className="search-panel__field">
        <Search size={19} strokeWidth={2} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && results[0]) openEntry(results[0])
          }}
          placeholder={t('搜索建筑、指南、二手好物或同学讨论…')}
          aria-label={t('搜索 BullU')}
        />
        {query && (
          <button onClick={() => setQuery('')} aria-label={t('清除搜索')}>
            <X size={15} strokeWidth={2} />
          </button>
        )}
        <kbd>ESC</kbd>
      </div>

      {!normalized ? (
        <div className="search-panel__empty">
          <span className="search-panel__label">{t('大家最近在找')}</span>
          <div className="search-panel__quick">
            {quickSearches.map((term) => (
              <button key={term} onClick={() => setQuery(t(term))}>
                <Search size={13} strokeWidth={2} />
                {t(term)}
              </button>
            ))}
          </div>
          <div className="search-panel__suggestions">
            <button onClick={() => navigate('map')}>
              <span className="search-suggestion-icon">
                <MapPin size={18} strokeWidth={1.8} />
              </span>
              <span>
                <strong>{t('打开校园地图')}</strong>
                <small>{t('搜索建筑、查看开放时间与推荐路线')}</small>
              </span>
              <ArrowUpRight size={15} strokeWidth={2} />
            </button>
            <button onClick={() => navigate('freshman')}>
              <span className="search-suggestion-icon search-suggestion-icon--green">
                <BookOpen size={18} strokeWidth={1.8} />
              </span>
              <span>
                <strong>{t('第一次来 UKM？')}</strong>
                <small>{t('从新生清单与到达指南开始')}</small>
              </span>
              <ArrowUpRight size={15} strokeWidth={2} />
            </button>
            <button onClick={() => navigate('community')}>
              <span className="search-suggestion-icon search-suggestion-icon--violet">
                <UsersRound size={18} strokeWidth={1.8} />
              </span>
              <span>
                <strong>{t('看看同学在聊什么')}</strong>
                <small>{t('校园经验、学习搭子和日常分享')}</small>
              </span>
              <ArrowUpRight size={15} strokeWidth={2} />
            </button>
          </div>
        </div>
      ) : results.length === 0 ? (
        <div className="search-panel__no-results">
          <span>?</span>
          <strong>{t('暂时没有找到“{query}”', { query })}</strong>
          <p>{t('试试建筑英文名、食物或商品类别。')}</p>
          <button className="button button--blue button--sm" onClick={() => navigate('community')}>
            {t('去社区问问')}
          </button>
        </div>
      ) : (
        <div className="search-panel__results">
          {Object.entries(groups).map(([group, items]) => {
            const Icon = groupIcons[group as keyof typeof groupIcons] ?? Search
            return (
              <div className="search-group" key={group}>
                <div className="search-group__label">
                  <Icon size={13} strokeWidth={2} />
                  {t(group)}
                  <span>{items.length}</span>
                </div>
                {items.map((entry) => (
                  <button key={entry.id} className="search-result-row" onClick={() => openEntry(entry)}>
                    <span>
                      <strong>{t(entry.title)}</strong>
                      <small>{t(entry.meta)}</small>
                    </span>
                    <ArrowUpRight size={15} strokeWidth={2} />
                  </button>
                ))}
              </div>
            )
          })}
        </div>
      )}

      <div className="search-panel__foot">
        <span>
          <kbd>ESC</kbd> {t('关闭')}
        </span>
        <span>{t('搜索结果仅来自 BullU 演示内容')}</span>
      </div>
    </Modal>
  )
}
