import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { AppContext, type AppContextValue, type NavigateOptions } from './app-context'
import type { User, View } from './types'
import { useLocalStorage } from './lib/useLocalStorage'
import { translate, type Language } from './i18n'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { MobileTabBar } from './components/MobileTabBar'
import { SearchOverlay } from './components/SearchOverlay'
import { AuthModal } from './components/AuthModal'
import { Toast } from './components/Toast'
import { BullIntro } from './components/BullIntro'
const HomePage = lazy(() =>
  import('./pages/HomePage').then((module) => ({ default: module.HomePage })),
)
const FreshmanPage = lazy(() =>
  import('./pages/FreshmanPage').then((module) => ({ default: module.FreshmanPage })),
)
const MapPage = lazy(() =>
  import('./pages/MapPage').then((module) => ({ default: module.MapPage })),
)
const MarketPage = lazy(() =>
  import('./pages/MarketPage').then((module) => ({ default: module.MarketPage })),
)
const CommunityPage = lazy(() =>
  import('./pages/CommunityPage').then((module) => ({ default: module.CommunityPage })),
)
const BusPage = lazy(() =>
  import('./pages/BusPage').then((module) => ({ default: module.BusPage })),
)
const DealsPage = lazy(() =>
  import('./pages/DealsPage').then((module) => ({ default: module.DealsPage })),
)
const MerchantPage = lazy(() =>
  import('./pages/MerchantPage').then((module) => ({ default: module.MerchantPage })),
)
const ProfilePage = lazy(() =>
  import('./pages/ProfilePage').then((module) => ({ default: module.ProfilePage })),
)

const VALID_VIEWS: View[] = [
  'home',
  'map',
  'freshman',
  'market',
  'community',
  'bus',
  'deals',
  'merchant',
  'profile',
]

const PAGE_TITLES: Record<View, string> = {
  home: 'BullU · 你的校园，你的生活，我们的社区',
  map: '校园地图 · BullU',
  freshman: '新生中心 · BullU',
  market: '二手市场 · BullU',
  community: '校园社区 · BullU',
  bus: '校园巴士 · BullU',
  deals: '学生优惠 · BullU',
  merchant: '商家合作 · BullU',
  profile: '个人中心 · BullU',
}

function readViewFromHash(): View {
  const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0]
  return VALID_VIEWS.includes(hash as View) ? (hash as View) : 'home'
}

export default function App() {
  const [view, setView] = useState<View>(readViewFromHash)
  const [user, setUser] = useLocalStorage<User | null>('bullu-user', null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [initialSearch, setInitialSearch] = useState('')
  const [targetId, setTargetId] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [language, setLanguage] = useLocalStorage<Language>('bullu-language', 'zh')
  const t = useCallback(
    (source: string, vars?: Record<string, string | number>) =>
      translate(language, source, vars),
    [language],
  )

  useEffect(() => {
    const syncView = () => {
      setView(readViewFromHash())
      setInitialSearch('')
      setTargetId(null)
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
    window.addEventListener('popstate', syncView)
    window.addEventListener('hashchange', syncView)
    return () => {
      window.removeEventListener('popstate', syncView)
      window.removeEventListener('hashchange', syncView)
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang =
      language === 'zh' ? 'zh-CN' : language === 'ms' ? 'ms' : 'en'
  }, [language])

  useEffect(() => {
    document.title = t(PAGE_TITLES[view])
  }, [view, language, t])

  useEffect(() => {
    if (!toastMessage) return
    const timer = window.setTimeout(() => setToastMessage(null), 3200)
    return () => window.clearTimeout(timer)
  }, [toastMessage])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setAuthOpen(false)
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const toast = useCallback((message: string) => setToastMessage(message), [])

  const navigate = useCallback((nextView: View, options?: NavigateOptions) => {
    setView(nextView)
    setInitialSearch(options?.search ?? '')
    setTargetId(options?.targetId ?? null)
    const nextHash = nextView === 'home' ? '#/' : `#/${nextView}`
    if (window.location.hash !== nextHash) window.history.pushState(null, '', nextHash)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  const openAuth = useCallback(() => {
    setSearchOpen(false)
    setAuthOpen(true)
  }, [])

  const openSearch = useCallback(() => {
    setAuthOpen(false)
    setSearchOpen(true)
  }, [])

  const login = useCallback(
    (nextUser: User) => {
      setUser(nextUser)
      setAuthOpen(false)
    },
    [setUser],
  )

  const logout = useCallback(() => setUser(null), [setUser])

  const contextValue = useMemo<AppContextValue>(
    () => ({
      view,
      navigate,
      user,
      login,
      logout,
      openAuth,
      toast,
      searchOpen,
      openSearch,
      closeSearch: () => setSearchOpen(false),
      initialSearch,
      targetId,
      clearTarget: () => setTargetId(null),
      language,
      setLanguage,
      t,
    }),
    [
      view,
      navigate,
      user,
      login,
      logout,
      openAuth,
      toast,
      searchOpen,
      openSearch,
      initialSearch,
      targetId,
      language,
      setLanguage,
      t,
    ],
  )

  let page = <HomePage />
  if (view === 'map') page = <MapPage />
  if (view === 'freshman') page = <FreshmanPage />
  if (view === 'market') page = <MarketPage />
  if (view === 'community') page = <CommunityPage />
  if (view === 'bus') page = <BusPage />
  if (view === 'deals') page = <DealsPage />
  if (view === 'merchant') page = <MerchantPage />
  if (view === 'profile') page = <ProfilePage />

  return (
    <AppContext.Provider value={contextValue}>
      <BullIntro />
      <a className="skip-link" href="#main">
        {t('跳到主要内容')}
      </a>
      <Header />
      <div id="main" key={view} className="page-frame">
        <Suspense
          fallback={
            <div className="page-loading" aria-hidden="true">
              <span />
            </div>
          }
        >
          {page}
        </Suspense>
      </div>
      <Footer />
      <MobileTabBar />
      <SearchOverlay />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <Toast message={toastMessage} />
    </AppContext.Provider>
  )
}
