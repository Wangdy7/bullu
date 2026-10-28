import { useEffect, useRef, useState } from 'react'
import {
  Bell,
  Check,
  ChevronDown,
  Languages,
  LogOut,
  Menu,
  MoreHorizontal,
  Search,
  Sparkles,
  X,
} from 'lucide-react'
import { useApp } from '../app-context'
import { moreItems, navItems } from '../data'
import { languages } from '../i18n'
import type { View } from '../types'
import { cn } from '../lib/utils'
import { Avatar } from './Avatar'
import { Logo } from './Logo'

export function Header() {
  const { view, navigate, user, logout, openAuth, toast, openSearch, language, setLanguage, t } = useApp()
  const [scrolled, setScrolled] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)
  const accountRef = useRef<HTMLDivElement>(null)
  const languageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMoreOpen(false)
    setAccountOpen(false)
    setMobileOpen(false)
    setLanguageOpen(false)
  }, [view])

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (moreRef.current && !moreRef.current.contains(target)) setMoreOpen(false)
      if (accountRef.current && !accountRef.current.contains(target)) setAccountOpen(false)
      if (languageRef.current && !languageRef.current.contains(target)) setLanguageOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [mobileOpen])

  const go = (next: View) => {
    navigate(next)
    setMobileOpen(false)
  }

  const handleSearch = () => {
    setMobileOpen(false)
    openSearch()
  }

  return (
    <>
      <header className={cn('app-header', scrolled && 'is-scrolled', mobileOpen && 'is-open')}>
        <div className="app-header__inner">
          <button className="brand-button" onClick={() => go('home')} aria-label={`BullU ${t('首页')}`}>
            <Logo />
          </button>

          <nav className="desktop-nav" aria-label={t('主导航')}>
            {navItems.map((item) => (
              <button
                key={item.view}
                className={cn('nav-link', view === item.view && 'is-active')}
                onClick={() => go(item.view)}
                aria-current={view === item.view ? 'page' : undefined}
              >
                {t(item.label)}
              </button>
            ))}
            <div className="nav-more" ref={moreRef}>
              <button
                className={cn(
                  'nav-link nav-link--more',
                  (moreItems.some((item) => item.view === view) || moreOpen) && 'is-active',
                )}
                onClick={() => setMoreOpen((open) => !open)}
                aria-expanded={moreOpen}
                aria-haspopup="menu"
              >
                {t('更多')}
                <ChevronDown size={13} strokeWidth={2} className={cn(moreOpen && 'rotate-180')} />
              </button>
              {moreOpen && (
                <div className="nav-popover" role="menu">
                  {moreItems.map((item) => (
                    <button
                      key={item.view}
                      role="menuitem"
                      className={cn(view === item.view && 'is-active')}
                      onClick={() => {
                        go(item.view)
                        setMoreOpen(false)
                      }}
                    >
                      <span>{t(item.label)}</span>
                      <small>{item.en}</small>
                    </button>
                  ))}
                  <div className="nav-popover__note">
                    <Sparkles size={13} strokeWidth={2} />
                    {t('为 UKM 学生而建')}
                  </div>
                </div>
              )}
            </div>
          </nav>

          <div className="header-actions">
            <div className="language-picker" ref={languageRef}>
              <button
                className="header-icon-button language-picker__trigger"
                onClick={() => setLanguageOpen((open) => !open)}
                aria-expanded={languageOpen}
                aria-haspopup="menu"
                aria-label={t('切换语言')}
              >
                <Languages size={17} strokeWidth={1.9} />
                <span>{languages.find((item) => item.value === language)?.short}</span>
                <ChevronDown size={12} strokeWidth={2} className={cn(languageOpen && 'rotate-180')} />
              </button>
              {languageOpen && (
                <div className="language-menu" role="menu">
                  {languages.map((item) => (
                    <button
                      key={item.value}
                      role="menuitemradio"
                      aria-checked={language === item.value}
                      className={cn(language === item.value && 'is-active')}
                      onClick={() => {
                        setLanguage(item.value)
                        setLanguageOpen(false)
                      }}
                    >
                      <span>
                        <strong>{item.label}</strong>
                      </span>
                      {language === item.value && <Check size={13} strokeWidth={2.2} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="header-icon-button header-search" onClick={handleSearch} aria-label={t('搜索')}>
              <Search size={18} strokeWidth={2} />
              <span>{t('搜索')}</span>
            </button>
            <button
              className="header-icon-button header-notification"
              onClick={() => toast(t('暂时没有新的校园通知。'))}
              aria-label={t('通知')}
            >
              <Bell size={18} strokeWidth={1.9} />
              <i />
            </button>

            {user ? (
              <div className="account" ref={accountRef}>
                <button
                  className="account-trigger"
                  onClick={() => setAccountOpen((open) => !open)}
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                >
                  <Avatar name={user.name} size="sm" />
                  <span>{user.name}</span>
                  <ChevronDown size={13} strokeWidth={2} className={cn(accountOpen && 'rotate-180')} />
                </button>
                {accountOpen && (
                  <div className="account-popover" role="menu">
                    <div className="account-popover__head">
                      <Avatar name={user.name} size="md" />
                      <span>
                        <strong>{user.name}</strong>
                        <small>{user.email}</small>
                      </span>
                    </div>
                    <div className="account-popover__badge">
                      <span>{t('UKM 学生')}</span>
                      {user.student ? t('已验证') : t('演示身份')}
                    </div>
                    <button
                      className="account-popover__logout"
                      onClick={() => {
                        logout()
                        setAccountOpen(false)
                        toast(t('已退出登录。'))
                      }}
                    >
                      <LogOut size={15} strokeWidth={2} />
                      {t('退出登录')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="header-join" onClick={openAuth}>
                {t('加入 BullU')}
              </button>
            )}

            <button
              className="mobile-menu-button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? t('关闭菜单') : t('打开菜单')}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={21} strokeWidth={2} /> : <Menu size={21} strokeWidth={2} />}
            </button>
          </div>
        </div>
      </header>

      <div
        className={cn('mobile-sheet', mobileOpen && 'is-open')}
        aria-hidden={!mobileOpen}
        inert={!mobileOpen}
      >
        <div className="mobile-sheet__inner">
          <div className="mobile-sheet__head">
            <span>{t('EXPLORE BULLU')}</span>
            <small>UKM · BANGI</small>
          </div>
          <nav className="mobile-nav" aria-label={t('移动端导航')}>
            {navItems.map((item, index) => (
              <button
                key={item.view}
                className={cn(view === item.view && 'is-active')}
                onClick={() => go(item.view)}
              >
                <span className="mobile-nav__index">0{index + 1}</span>
                <span>{t(item.label)}</span>
                <small>{item.en}</small>
              </button>
            ))}
            {moreItems.map((item, index) => (
              <button
                key={item.view}
                className={cn('mobile-nav__secondary', view === item.view && 'is-active')}
                onClick={() => go(item.view)}
              >
                <span className="mobile-nav__index">0{index + 6}</span>
                <span>{t(item.label)}</span>
                <small>{item.en}</small>
              </button>
            ))}
          </nav>
          <div className="mobile-language">
            <span><Languages size={14} strokeWidth={2} /> {t('语言')}</span>
            <div className="mobile-language__options">
              {languages.map((item) => (
                <button
                  key={item.value}
                  className={cn(language === item.value && 'is-active')}
                  onClick={() => setLanguage(item.value)}
                  aria-pressed={language === item.value}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mobile-sheet__actions">
            <button className="mobile-search" onClick={handleSearch}>
              <Search size={17} strokeWidth={2} />
              {t('搜索地点、商品或指南')}
              <MoreHorizontal size={16} />
            </button>
            {user ? (
              <button
                className="button button--blue button--full"
                onClick={() => {
                  toast(t('欢迎回来，{name}。', { name: user.name }))
                  setMobileOpen(false)
                }}
              >
                <Avatar name={user.name} size="xs" /> {user.name}
              </button>
            ) : (
              <button
                className="button button--blue button--full"
                onClick={() => {
                  setMobileOpen(false)
                  openAuth()
                }}
              >
                {t('加入 BullU')}
              </button>
            )}
            <p>{t('学生免费使用 · 独立学生项目 · 非 UKM 官方平台')}</p>
          </div>
        </div>
        <button className="mobile-sheet__dismiss" onClick={() => setMobileOpen(false)} aria-label={t('关闭菜单')} />
      </div>
    </>
  )
}
