import { useMemo, useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  BusFront,
  Clock3,
  MapPin,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { useApp } from '../app-context'
import { busRoutes } from '../data'
import { cn } from '../lib/utils'
import { Reveal } from '../components/Reveal'
import { LocalizedPage } from '../components/LocalizedPage'

export function BusPage() {
  const { toast, navigate } = useApp()
  const [selectedId, setSelectedId] = useState(busRoutes[0].id)
  const [query, setQuery] = useState('')
  const [day, setDay] = useState<'weekday' | 'weekend'>('weekday')

  const filteredRoutes = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return busRoutes
    return busRoutes.filter((route) =>
      `${route.name} ${route.en} ${route.stops.join(' ')}`.toLowerCase().includes(normalized),
    )
  }, [query])

  const selected = busRoutes.find((route) => route.id === selectedId) ?? busRoutes[0]

  return (
    <LocalizedPage>
      <main className="inner-page bus-page">
      <section className="page-width compact-page-head">
        <div>
          <span className="eyebrow">
            <span>CAMPUS BUS</span>
            <i />
            UKM · BANGI
          </span>
          <h1>校园巴士</h1>
          <p>路线、站点和下一班时间，出门前先看一眼。</p>
        </div>
        <span className="compact-page-head__status">
          <span className="live-dot" /> 路线信息为演示数据
        </span>
      </section>

      <div className="page-width bus-layout">
        <section className="bus-main">
          <Reveal>
            <div className="bus-hero">
              <img src="./images/campus-bus.jpg" alt="校园巴士" />
              <div className="bus-hero__shade" />
              <span className="bus-hero__eyebrow">
                <Sparkles size={13} strokeWidth={2} /> NEXT DEPARTURE
              </span>
              <div className="bus-hero__copy">
                <span className="bus-hero__route">
                  <span className="live-dot" /> {selected.name} 正在运行
                </span>
                <h2>下一班，{selected.next[0]}</h2>
                <p>{selected.stops[0]} → {selected.stops[selected.stops.length - 1]}</p>
              </div>
              <div className="bus-hero__times">
                {selected.next.map((time, index) => (
                  <span key={time} className={busTimeClass(index)}>
                    <small>{index === 0 ? '下一班' : `+${index * 1}`}</small>
                    {time}
                  </span>
                ))}
              </div>
              <button
                className="bus-hero__refresh"
                onClick={() => toast('已刷新。演示路线时刻不会实时变化。')}
              >
                <RefreshCw size={14} strokeWidth={2} /> 刷新
              </button>
            </div>
          </Reveal>

          <div className="bus-list-head">
            <div>
              <span className="eyebrow">
                <span>ALL ROUTES</span>
                <i />
                校园路线
              </span>
              <h2>今天坐哪一条？</h2>
            </div>
            <label className="bus-search">
              <Search size={15} strokeWidth={2} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索站点或路线"
                aria-label="搜索校园巴士路线"
              />
            </label>
          </div>

          <div className="bus-route-list">
            {filteredRoutes.map((route, index) => {
              const active = selected.id === route.id
              return (
                <Reveal key={route.id} delay={index * 60}>
                  <button
                    className={cn('bus-route-card', active && 'is-active')}
                    onClick={() => setSelectedId(route.id)}
                  >
                    <span className="bus-route-card__line" style={{ background: route.color }} />
                    <span className="bus-route-card__icon" style={{ color: route.color }}>
                      <BusFront size={19} strokeWidth={1.9} />
                    </span>
                    <span className="bus-route-card__copy">
                      <span>
                        <strong>{route.name}</strong>
                        <i>{route.status}</i>
                      </span>
                      <small>{route.en}</small>
                    </span>
                    <span className="bus-route-card__next">
                      <small>下一班</small>
                      <strong>{route.next[0]}</strong>
                    </span>
                    <ArrowUpRight size={16} strokeWidth={2} />
                  </button>
                </Reveal>
              )
            })}
            {filteredRoutes.length === 0 && (
              <div className="empty-state">
                <h3>没找到这条路线。</h3>
                <p>试试 Zone A、Zone B 或图书馆。</p>
              </div>
            )}
          </div>
        </section>

        <aside className="bus-aside">
          <div className="bus-detail-card">
            <div className="bus-detail-card__head">
              <span style={{ color: selected.color }}>
                <BusFront size={20} strokeWidth={1.9} />
              </span>
              <div>
                <small>{selected.en}</small>
                <h2>{selected.name}</h2>
              </div>
              <span className="bus-detail-card__live">
                <span className="live-dot" /> {selected.status}
              </span>
            </div>

            <div className="bus-day-toggle">
              <button
                className={cn(day === 'weekday' && 'is-active')}
                onClick={() => setDay('weekday')}
              >
                工作日
              </button>
              <button
                className={cn(day === 'weekend' && 'is-active')}
                onClick={() => setDay('weekend')}
              >
                周末
              </button>
            </div>

            <div className="bus-timetable">
              <span className="bus-timetable__label">
                <Clock3 size={13} strokeWidth={2} /> 接下来三班
              </span>
              <div>
                {selected.next.map((time) => (
                  <span key={time}>{day === 'weekday' ? time : shiftTime(time, 18)}</span>
                ))}
              </div>
              <small>{selected.interval} · 末班车时间可能随学期调整</small>
            </div>

            <div className="bus-stops">
              <span className="bus-timetable__label">
                <MapPin size={13} strokeWidth={2} /> 沿途站点
              </span>
              <ol>
                {selected.stops.map((stop, index) => (
                  <li key={stop}>
                    <span className="bus-stop__dot" style={{ borderColor: selected.color }} />
                    <span>
                      <strong>{stop}</strong>
                      <small>
                        {index === 0
                          ? '起点'
                          : index === selected.stops.length - 1
                            ? '终点'
                            : `${index * 4} 分钟`}
                      </small>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <button
              className="button button--soft button--full"
              onClick={() => navigate('map', { targetId: 'bus' })}
            >
              在校园地图中查看 <ArrowRight size={15} strokeWidth={2} />
            </button>
          </div>

          <div className="bus-note">
            <ShieldCheck size={16} strokeWidth={1.9} />
            <span>
              <strong>先确认，再出发。</strong>
              巴士时间与路线为演示数据。开学季和节假日可能调整，请以 UKM 官方通知为准。
            </span>
          </div>
        </aside>
      </div>
    </main>
    </LocalizedPage>
  )
}

function busTimeClass(index: number) {
  return index === 0 ? 'is-next' : ''
}

function shiftTime(value: string, minutes: number) {
  const [hour, minute] = value.split(':').map(Number)
  const total = hour * 60 + minute + minutes
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}
