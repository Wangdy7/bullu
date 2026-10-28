import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  ChevronRight,
  Clock3,
  Compass,
  Footprints,
  Languages,
  Layers3,
  Map as MapIcon,
  MapPin,
  Navigation,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { useApp } from '../app-context'
import { campusLocations, locationCategories } from '../data'
import type { CampusLocation, LocationCategory } from '../types'
import { locationIconMap } from '../lib/icons'
import { cn } from '../lib/utils'
import { categoryColors } from '../components/CampusMap2D'
import {
  getMapCopy,
  localizeLocation,
  mapCategoryLabel,
  mapLanguages,
} from '../lib/mapI18n'
import { MapboxCampusMap, type CampusMapMode } from '../components/MapboxCampusMap'
import { LocalizedPage } from '../components/LocalizedPage'

type MapMode = CampusMapMode

const popularIds = ['library', 'pusanika', 'bus']

export function MapPage() {
  const { initialSearch, targetId, language, setLanguage } = useApp()
  const [mode, setMode] = useState<MapMode>('2d')
  const [category, setCategory] = useState<(typeof locationCategories)[number]>('全部')
  const [query, setQuery] = useState(initialSearch ?? '')
  const [selectedId, setSelectedId] = useState('library')
  const [routeActive, setRouteActive] = useState(false)
  const copy = getMapCopy(language)

  useEffect(() => {
    if (initialSearch) setQuery(initialSearch)
  }, [initialSearch])

  useEffect(() => {
    if (!targetId) return
    const location = campusLocations.find((item) => item.id === targetId)
    if (location) {
      setSelectedId(location.id)
      setQuery('')
      setCategory('全部')
    }
  }, [targetId])

  const normalized = query.trim().toLowerCase()
  const filteredLocations = useMemo(() => {
    return campusLocations.filter((location) => {
      const inCategory = category === '全部' || location.category === category
      const translated = localizeLocation(language, location)
      const inQuery =
        !normalized ||
        `${location.name} ${location.en} ${translated.name} ${translated.categoryLabel} ${translated.description} ${(location.aliases ?? []).join(' ')}`
          .toLowerCase()
          .includes(normalized)
      return inCategory && inQuery
    })
  }, [category, normalized, language])

  const selected =
    campusLocations.find((location) => location.id === selectedId) ?? campusLocations[0]

  const localizedLocations = useMemo(
    () => filteredLocations.map((location) => localizeLocation(language, location)),
    [filteredLocations, language],
  )
  const selectedLocalized = localizeLocation(language, selected)

  useEffect(() => {
    if (filteredLocations.length === 0) return
    if (!filteredLocations.some((location) => location.id === selectedId)) {
      setSelectedId(filteredLocations[0].id)
      setRouteActive(false)
    }
  }, [filteredLocations, selectedId])

  const selectLocation = (location: CampusLocation) => {
    setSelectedId(location.id)
  }

  const toggleRoute = () => {
    setRouteActive((active) => !active)
  }

  const popular = campusLocations.filter((location) => popularIds.includes(location.id))
  const popularLabel = (location: CampusLocation) => {
    if (language === 'zh') {
      return location.name.replace('敦斯里拉南', '').replace(' 校园中心', '')
    }
    if (location.id === 'library') return language === 'ms' ? 'Perpustakaan' : 'Library'
    if (location.id === 'bus') return language === 'ms' ? 'Bas' : 'Bus terminal'
    return location.en
  }

  return (
    <LocalizedPage>
      <main className="inner-page map-page">
      <section className="map-page__head">
        <div className="page-width map-head">
          <div>
            <span className="eyebrow">
              <span>CAMPUS MAP</span>
              <i />
              UKM · BANGI
            </span>
            <h1>{copy.heading}</h1>
            <p>{copy.intro}</p>
          </div>
          <div className="map-head__aside">
            <div className="map-language-switcher" role="group" aria-label={copy.languageLabel}>
              <Languages size={13} strokeWidth={2} />
              {mapLanguages.map((item) => (
                <button
                  key={item.value}
                  className={cn(language === item.value && 'is-active')}
                  onClick={() => setLanguage(item.value)}
                  aria-pressed={language === item.value}
                  title={item.label}
                >
                  {item.short}
                </button>
              ))}
            </div>
            <span className="map-head__status">
              <span className="live-dot" /> {copy.status}
            </span>
            <div className="map-head__stats">
              <span>
                <strong>{campusLocations.length}</strong>
                {copy.statLocations}
              </span>
              <i />
              <span>
                <strong>8</strong>
                {copy.statRoutes}
              </span>
              <i />
              <span>
                <strong>2</strong>
                {copy.statViews}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="page-width map-page__body">
        <aside className="map-sidebar">
          <div className="map-sidebar__search">
            <label className="search-field">
              <Search size={17} strokeWidth={2} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={copy.searchPlaceholder}
                aria-label={copy.searchPlaceholder}
              />
              {query && (
                <button onClick={() => setQuery('')} aria-label="Clear search / Padam carian">
                  ×
                </button>
              )}
            </label>
            <div className="map-category-scroll">
              {locationCategories.map((item) => (
                <button
                  key={item}
                  className={cn('map-category-pill', category === item && 'is-active')}
                  onClick={() => setCategory(item)}
                >
                  {mapCategoryLabel(language, item)}
                </button>
              ))}
            </div>
          </div>

          <div className="map-sidebar__popular">
            <div className="map-sidebar__label">
              <span>{copy.popular}</span>
              <Compass size={14} strokeWidth={2} />
            </div>
            <div className="popular-row">
              {popular.map((location) => {
                const Icon = locationIconMap[location.icon]
                return (
                  <button
                    key={location.id}
                    className={cn('popular-pin', selected.id === location.id && 'is-active')}
                    onClick={() => selectLocation(location)}
                  >
                    <span style={{ background: categoryColors[location.category] }}>
                      <Icon size={14} strokeWidth={2} />
                    </span>
                    {popularLabel(location)}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="map-sidebar__list-head">
            <span>
              {filteredLocations.length > 0
                ? `${filteredLocations.length} ${copy.places}`
                : copy.noResults}
            </span>
            <span>{copy.walkingTime}</span>
          </div>

          <div className="map-location-list">
            {localizedLocations.map((location) => {
              const Icon = locationIconMap[location.icon]
              const active = location.id === selected.id
              return (
                <button
                  key={location.id}
                  className={cn('map-location-row', active && 'is-active')}
                  onClick={() => selectLocation(location)}
                >
                  <span
                    className="map-location-row__icon"
                    style={{
                      color: categoryColors[location.category],
                      background: `${categoryColors[location.category]}12`,
                    }}
                  >
                    <Icon size={17} strokeWidth={1.9} />
                  </span>
                  <span className="map-location-row__copy">
                    <strong>{location.name}</strong>
                    <small>
                      {location.categoryLabel}
                      <i />
                      {location.hours}
                    </small>
                  </span>
                  <ChevronRight size={15} strokeWidth={2} />
                </button>
              )
            })}
            {filteredLocations.length === 0 && (
              <div className="map-list-empty">
                <MapPin size={20} strokeWidth={1.7} />
                <span>{copy.emptyHint}</span>
              </div>
            )}
          </div>

          <div className="map-sidebar__note">
            <ShieldCheck size={15} strokeWidth={1.9} />
            <span>{copy.sidebarNote}</span>
          </div>
        </aside>

        <section className="map-main">
          <div className="map-toolbar">
            <div className="map-toolbar__left">
              <span className="map-toolbar__title">
                <Layers3 size={16} strokeWidth={2} />
                {copy.explore}
              </span>
              <span className="map-toolbar__hint">
                {copy.toolbarHint}
              </span>
            </div>
            <div className="view-toggle" role="group" aria-label={copy.mapView}>
              <button
                className={cn(mode === '2d' && 'is-active')}
                onClick={() => setMode('2d')}
                aria-pressed={mode === '2d'}
              >
                <MapIcon size={14} strokeWidth={2} /> {copy.mapView}
              </button>
              <button
                className={cn(mode === '3d' && 'is-active')}
                onClick={() => setMode('3d')}
                aria-pressed={mode === '3d'}
              >
                <Box size={14} strokeWidth={2} /> {copy.threeDView}
              </button>
            </div>
          </div>

          <div className="map-board map-board--mapbox">
            <div className="map-stage map-stage--mapbox">
              <MapboxCampusMap
                locations={localizedLocations}
                selected={selectedLocalized}
                mode={mode}
                routeActive={routeActive}
                onSelect={selectLocation}
                language={language}
              />
            </div>

            <aside className="map-info">
              <div className="map-info__head">
                <span
                  className="map-info__icon"
                  style={{
                    color: categoryColors[selected.category],
                    background: `${categoryColors[selected.category]}12`,
                  }}
                >
                  {(() => {
                    const Icon = locationIconMap[selected.icon]
                    return <Icon size={21} strokeWidth={1.8} />
                  })()}
                </span>
                <span className="map-info__category">{selectedLocalized.categoryLabel}</span>
                <span className="map-info__open">
                  <span className="live-dot" /> {copy.openNow}
                </span>
              </div>
              <h2>{selectedLocalized.name}</h2>
              {selectedLocalized.secondaryName && (
                <span className="map-info__en">{selectedLocalized.secondaryName}</span>
              )}
              <p>{selectedLocalized.description}</p>
              <div className="map-info__facts">
                <span>
                  <Clock3 size={14} strokeWidth={2} />
                  <small>{copy.hours}</small>
                  <strong>{selectedLocalized.hours}</strong>
                </span>
                <span>
                  <Footprints size={14} strokeWidth={2} />
                  <small>{copy.walk}</small>
                  <strong>{selectedLocalized.walkShort}</strong>
                </span>
              </div>
              <div className="map-info__actions">
                <button
                  className={cn('button button--blue button--sm', routeActive && 'is-active')}
                  onClick={toggleRoute}
                >
                  <Navigation size={14} strokeWidth={2} />
                  {routeActive ? copy.routeShown : copy.planRoute}
                </button>
                <button
                  className="button button--soft button--sm"
                  onClick={() => setMode(mode === '3d' ? '2d' : '3d')}
                >
                  {mode === '3d' ? <MapIcon size={14} strokeWidth={2} /> : <Box size={14} strokeWidth={2} />}
                  {mode === '3d' ? copy.viewMap : copy.view3d}
                </button>
              </div>
              {routeActive && (
                <div className="map-info__route">
                  <span className="map-info__route-icon">
                    <Navigation size={14} strokeWidth={2} />
                  </span>
                  <span>
                    {copy.routeInfo(selectedLocalized.name)}
                  </span>
                </div>
              )}
            </aside>

            {routeActive && (
              <div className="map-route-banner">
                <span className="map-route-banner__icon">
                  <Footprints size={17} strokeWidth={2} />
                </span>
                <span>
                  <small>{copy.routeBannerTitle}</small>
                  <strong>{copy.mainGate} → {selectedLocalized.name}</strong>
                </span>
                <span>{selectedLocalized.walk}</span>
              </div>
            )}
          </div>

          <div className="map-bottom">
            <div className="map-legend">
              {(['图书馆', '教学楼', '食堂', '宿舍', '巴士站'] as LocationCategory[]).map(
                (item) => (
                  <span key={item}>
                    <i style={{ background: categoryColors[item] }} />
                    {mapCategoryLabel(language, item)}
                  </span>
                ),
              )}
            </div>
            <span className="map-disclaimer">
              <Sparkles size={13} strokeWidth={2} />
              {copy.disclaimer}
            </span>
          </div>
        </section>
      </div>
    </main>
    </LocalizedPage>
  )
}
