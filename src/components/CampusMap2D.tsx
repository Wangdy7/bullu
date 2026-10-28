import { useState, type CSSProperties } from 'react'
import { Minus, Plus, RotateCcw } from 'lucide-react'
import type { CampusLocation, LocationCategory } from '../types'
import { locationIconMap } from '../lib/icons'
import { cn, clamp } from '../lib/utils'

export const categoryColors: Record<LocationCategory, string> = {
  图书馆: '#1769ff',
  教学楼: '#5b6ee8',
  食堂: '#e9873d',
  宿舍: '#0e9f84',
  巴士站: '#1b9aba',
  运动: '#53a86d',
  校园服务: '#d15b86',
}

type MapVariant = 'schematic' | 'satellite'

interface CampusMap2DProps {
  locations: CampusLocation[]
  selected: CampusLocation
  routeActive: boolean
  variant: MapVariant
  onSelect: (location: CampusLocation) => void
}

function MapArt({
  selected,
  routeActive,
  variant,
}: {
  selected: CampusLocation
  routeActive: boolean
  variant: MapVariant
}) {
  const satellite = variant === 'satellite'
  const trees = [
    [90, 170, 1],
    [120, 225, 0.8],
    [160, 115, 1.2],
    [330, 90, 0.9],
    [640, 95, 1.1],
    [705, 130, 0.8],
    [740, 230, 1],
    [930, 410, 1.2],
    [910, 485, 0.9],
    [805, 520, 1.1],
    [360, 550, 0.9],
    [315, 580, 0.7],
    [120, 360, 1.2],
    [95, 455, 0.9],
    [355, 370, 0.7],
    [670, 270, 0.95],
    [875, 330, 0.8],
    [585, 195, 0.7],
    [430, 500, 0.7],
    [510, 260, 0.8],
    [690, 570, 1],
    [260, 230, 0.8],
    [548, 290, 0.65],
    [610, 365, 0.5],
    [864, 242, 0.8],
    [782, 522, 0.7],
    [250, 465, 0.7],
    [174, 505, 0.8],
    [886, 133, 0.7],
    [396, 580, 0.55],
  ]

  const targetX = selected.x * 10
  const targetY = selected.y * 6.2
  const routePath = `M 518 594 C 518 552 518 520 518 488 C 518 462 ${Math.min(
    720,
    Math.max(280, targetX),
  )} 454 ${Math.min(820, Math.max(300, targetX))} ${Math.max(390, targetY + 138)} S ${targetX} ${
    targetY + 74
  } ${targetX} ${targetY + 22}`

  return (
    <svg
      className={cn('campus-map-art', satellite && 'campus-map-art--satellite')}
      viewBox="0 0 1000 620"
      role="img"
      aria-label={satellite ? 'UKM 虚拟卫星校园地图' : 'UKM 校园示意地图'}
    >
      <defs>
        <linearGradient id="mapGround" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f2f7ef" />
          <stop offset="58%" stopColor="#ebf3ea" />
          <stop offset="100%" stopColor="#edf5f1" />
        </linearGradient>
        <linearGradient id="mapGroundSatellite" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a9ba9b" />
          <stop offset="55%" stopColor="#93a686" />
          <stop offset="100%" stopColor="#849878" />
        </linearGradient>
        <linearGradient id="lakeFillSatellite" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9ac5c1" />
          <stop offset="100%" stopColor="#79a5a5" />
        </linearGradient>
        <linearGradient id="fieldFillSatellite" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#94b281" />
          <stop offset="100%" stopColor="#809f70" />
        </linearGradient>
        <linearGradient id="lakeFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d9f0fb" />
          <stop offset="100%" stopColor="#bfe3f1" />
        </linearGradient>
        <linearGradient id="fieldFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d9eed8" />
          <stop offset="100%" stopColor="#c5e2c4" />
        </linearGradient>
        <filter id="mapShadow" x="-20%" y="-20%" width="150%" height="160%">
          <feDropShadow dx="0" dy="7" stdDeviation="7" floodColor="#335c47" floodOpacity="0.12" />
        </filter>
        <filter id="pinShadow" x="-50%" y="-50%" width="200%" height="220%">
          <feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#0c3a68" floodOpacity="0.25" />
        </filter>
        <pattern id="mapDots" width="26" height="26" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="#dbe9de" />
        </pattern>
        <pattern id="mapDotsSatellite" width="21" height="21" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.85" fill="#f0ead3" />
        </pattern>
        <radialGradient id="satelliteVignette" cx="50%" cy="46%" r="72%">
          <stop offset="66%" stopColor="#203825" stopOpacity="0" />
          <stop offset="100%" stopColor="#203825" stopOpacity="0.18" />
        </radialGradient>
        <pattern id="parkingLines" width="26" height="22" patternUnits="userSpaceOnUse">
          <path d="M 0 0 V 14" stroke="#cbd8cd" strokeWidth="1.4" />
        </pattern>
      </defs>

      <rect
        width="1000"
        height="620"
        fill={satellite ? 'url(#mapGroundSatellite)' : 'url(#mapGround)'}
      />
      <rect
        width="1000"
        height="620"
        fill={satellite ? 'url(#mapDotsSatellite)' : 'url(#mapDots)'}
        opacity={satellite ? '0.18' : '0.55'}
      />

      {/* Soft landscape shapes */}
      <path
        className="map-landscape map-landscape--south"
        d="M-30 440C110 395 192 440 255 507s196 105 307 54 182-154 285-162 177 23 191 80v177H-30Z"
        fill="#e3efdf"
        opacity="0.7"
      />
      <path
        className="map-landscape map-landscape--north"
        d="M-20 80C111 30 241 42 337 108s148 73 244 44 154-92 246-74 144 72 203 138v-206H-20Z"
        fill="#eef6ef"
        opacity="0.7"
      />

      {/* Roads */}
      <g className="map-roads">
        <path
          className="map-road map-road--base"
          d="M178 540C105 422 125 252 292 154c140-82 329-75 459 20 130 95 161 243 81 350-87 116-250 136-402 110-128-22-207-31-252-94Z"
        />
        <path
          className="map-road"
          d="M178 540C105 422 125 252 292 154c140-82 329-75 459 20 130 95 161 243 81 350-87 116-250 136-402 110-128-22-207-31-252-94Z"
        />
        <path className="map-road map-road--base" d="M518 600V176c0-44 26-70 68-83" />
        <path className="map-road" d="M518 600V176c0-44 26-70 68-83" />
        <path className="map-road map-road--base" d="M162 352h672" />
        <path className="map-road" d="M162 352h672" />
        <path className="map-road map-road--base map-road--minor" d="M287 547c34-66 66-96 122-126" />
        <path className="map-road map-road--minor" d="M287 547c34-66 66-96 122-126" />
        <path className="map-road map-road--base map-road--minor" d="M678 210c27 49 53 84 92 111" />
        <path className="map-road map-road--minor" d="M678 210c27 49 53 84 92 111" />
        <path className="map-road map-road--base map-road--minor" d="M760 368c46 26 77 53 91 92" />
        <path className="map-road map-road--minor" d="M760 368c46 26 77 53 91 92" />
        <path className="map-road__line" d="M518 580V197c0-28 12-48 35-62" />
        <path className="map-road__line" d="M185 352h628" />
      </g>

      {/* Campus gate */}
      <g className="map-gate" filter="url(#mapShadow)">
        <rect x="488" y="598" width="60" height="11" rx="5" />
        <rect x="492" y="575" width="8" height="30" rx="4" />
        <rect x="536" y="575" width="8" height="30" rx="4" />
        <path d="M499 579h37" />
        <text x="518" y="612" textAnchor="middle">
          MAIN GATE
        </text>
      </g>

      {/* Lake */}
      <g className="map-lake" filter="url(#mapShadow)">
        <path d="M777 181c48-31 105-24 140 11 33 34 24 82-15 107-37 23-91 29-125 5-38-27-43-92 0-123Z" />
        <path
          d="M804 201c22-16 55-12 72 7 17 20 8 46-14 56-24 11-55 7-70-11-12-17-8-39 12-52Z"
          className="map-lake__inner"
        />
        <path d="M770 280c26 12 49 15 81 9" className="map-lake__ripple" />
      </g>

      {/* Sports field */}
      <g className="map-field" filter="url(#mapShadow)">
        <rect x="108" y="405" width="214" height="136" rx="24" />
        <rect x="123" y="420" width="184" height="106" rx="17" />
        <path d="M215 420v106M123 473h184" />
        <circle cx="215" cy="473" r="20" />
      </g>

      {/* Parking */}
      <g className="map-parking">
        <rect x="710" y="486" width="134" height="76" rx="11" />
        <rect x="722" y="498" width="110" height="52" rx="3" fill="url(#parkingLines)" />
        <text x="777" y="576" textAnchor="middle">
          PARKING
        </text>
      </g>

      {/* Main buildings */}
      <g className="map-buildings">
        {/* Library */}
        <g className="map-building map-building--library" filter="url(#mapShadow)">
          <rect x="359" y="105" width="240" height="101" rx="12" />
          <rect x="379" y="88" width="200" height="27" rx="8" className="map-building__roof" />
          <rect x="382" y="132" width="194" height="52" rx="4" className="map-building__glass" />
          <path d="M398 132v52M424 132v52M450 132v52M476 132v52M502 132v52M528 132v52M554 132v52" />
          <rect x="490" y="185" width="34" height="21" rx="3" className="map-building__door" />
          <text x="478" y="225" textAnchor="middle" className="map-building__label">
            PTSL LIBRARY
          </text>
        </g>

        {/* Pusanika */}
        <g className="map-building map-building--pusanika" filter="url(#mapShadow)">
          <rect x="432" y="298" width="203" height="95" rx="14" />
          <rect x="452" y="314" width="163" height="53" rx="7" className="map-building__glass map-building__glass--warm" />
          <path d="M469 314v53M492 314v53M515 314v53M538 314v53M561 314v53M584 314v53" />
          <circle cx="533" cy="393" r="38" className="map-plaza" />
          <text x="533" y="415" textAnchor="middle" className="map-building__label">
            PUSANIKA
          </text>
        </g>

        {/* FEP */}
        <g className="map-building" filter="url(#mapShadow)">
          <rect x="170" y="139" width="142" height="78" rx="9" />
          <rect x="186" y="118" width="110" height="24" rx="6" className="map-building__roof" />
          <path d="M188 160h105M188 177h105M188 194h105" className="map-building__windows" />
          <text x="241" y="234" textAnchor="middle" className="map-building__label">
            FEP
          </text>
        </g>

        {/* FSSK */}
        <g className="map-building" filter="url(#mapShadow)">
          <rect x="177" y="274" width="172" height="94" rx="11" />
          <rect x="194" y="260" width="138" height="18" rx="5" className="map-building__roof" />
          <path d="M197 294h133M197 311h133M197 328h133M197 345h133" className="map-building__windows" />
          <text x="263" y="385" textAnchor="middle" className="map-building__label">
            FSSK
          </text>
        </g>

        {/* Kolej towers */}
        <g className="map-building map-building--dorm" filter="url(#mapShadow)">
          <rect x="690" y="283" width="48" height="150" rx="8" />
          <rect x="746" y="251" width="55" height="182" rx="8" />
          <rect x="809" y="301" width="43" height="132" rx="8" />
          <path d="M702 301h24M702 320h24M702 339h24M702 358h24M702 377h24M758 268h31M758 287h31M758 306h31M758 325h31M758 344h31M758 363h31M821 318h18M821 337h18M821 356h18" className="map-building__windows" />
          <text x="759" y="376" textAnchor="middle" className="map-building__label">
            KOLEJ ZA'BA
          </text>
        </g>

        {/* KKM */}
        <g className="map-building map-building--dorm" filter="url(#mapShadow)">
          <rect x="594" y="441" width="126" height="77" rx="9" />
          <rect x="611" y="427" width="91" height="17" rx="5" className="map-building__roof" />
          <path d="M609 460h95M609 478h95M609 496h95" className="map-building__windows" />
          <text x="657" y="531" textAnchor="middle" className="map-building__label">
            KOLEJ KERIS MAS
          </text>
        </g>

        {/* Health centre */}
        <g className="map-building" filter="url(#mapShadow)">
          <rect x="354" y="408" width="96" height="65" rx="9" />
          <rect x="371" y="396" width="63" height="16" rx="5" className="map-building__roof" />
          <path d="M374 425h56M374 440h56M374 455h56" className="map-building__windows" />
          <text x="402" y="487" textAnchor="middle" className="map-building__label">
            HEALTH
          </text>
        </g>

        {/* Bus terminal */}
        <g className="map-building map-building--bus" filter="url(#mapShadow)">
          <rect x="446" y="521" width="147" height="44" rx="10" />
          <path d="M457 536h124M457 548h124" className="map-building__windows" />
          <text x="519" y="557" textAnchor="middle" className="map-building__label">
            BUS TERMINAL
          </text>
        </g>

        {/* Small campus buildings */}
        <g className="map-building map-building--small" filter="url(#mapShadow)">
          <rect x="335" y="255" width="55" height="41" rx="6" />
          <path d="M344 270h36M344 282h36" className="map-building__windows" />
        </g>
        <g className="map-building map-building--small" filter="url(#mapShadow)">
          <rect x="659" y="155" width="63" height="42" rx="6" />
          <path d="M670 169h41M670 182h41" className="map-building__windows" />
        </g>
        <g className="map-building map-building--small" filter="url(#mapShadow)">
          <rect x="392" y="504" width="41" height="30" rx="5" />
        </g>
        <g className="map-building map-building--small" filter="url(#mapShadow)">
          <rect x="575" y="246" width="48" height="36" rx="6" />
          <path d="M585 258h28M585 269h28" className="map-building__windows" />
        </g>
      </g>

      {/* Trees */}
      <g className="map-trees">
        {trees.map(([x, y, scale], index) => (
          <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(${scale})`}>
            <circle cx="0" cy="5" r="10" className="map-tree__shadow" />
            <circle cx="0" cy="-2" r="13" className="map-tree__body" />
            <circle cx="-6" cy="-8" r="7" className="map-tree__light" />
            {index % 4 === 0 && <circle cx="22" cy="5" r="8" className="map-tree__body" />}
          </g>
        ))}
      </g>

      {/* Map labels and details */}
      <g className="map-labels">
        <text x="168" y="300" className="map-road-label">
          JALAN UKM
        </text>
        <text x="635" y="610" className="map-road-label">
          SOUTH GATE
        </text>
        <text x="790" y="157" className="map-lake-label">
          DANAU UKM
        </text>
      </g>

      {satellite && (
        <g className="map-campus-heading">
          <text x="500" y="44" textAnchor="middle">
            UNIVERSITI KEBANGSAAN MALAYSIA
          </text>
          <text x="500" y="60" textAnchor="middle" className="map-campus-heading__sub">
            BANGI CAMPUS · VIRTUAL SATELLITE · 930 HA
          </text>
        </g>
      )}

      {satellite && (
        <g className="map-zone-labels">
          <text x="212" y="566" textAnchor="middle">
            SPORTS COMPLEX
          </text>
          <text x="416" y="256" textAnchor="middle">
            ACADEMIC CORE
          </text>
          <text x="759" y="242" textAnchor="middle">
            RESIDENTIAL ZONE
          </text>
        </g>
      )}

      <g className="map-compass" transform="translate(930 58)">
        <circle cx="0" cy="0" r="23" />
        <path d="M0-13 6 6 0 2-6 6Z" />
        <text x="0" y="-29" textAnchor="middle">
          N
        </text>
      </g>

      <g className="map-scale" transform="translate(48 584)">
        <path d="M0 0h76M0-4v8M38-4v8M76-4v8" />
        <text x="0" y="22">
          200 m
        </text>
      </g>

      {satellite && (
        <rect
          width="1000"
          height="620"
          fill="url(#satelliteVignette)"
          pointerEvents="none"
        />
      )}

      {routeActive && (
        <g className="map-route" filter="url(#pinShadow)">
          <path d={routePath} className="map-route__halo" />
          <path d={routePath} className="map-route__line" />
          <circle cx="518" cy="594" r="5" className="map-route__start" />
          <circle cx={targetX} cy={targetY + 18} r="6" className="map-route__end" />
        </g>
      )}
    </svg>
  )
}

export function CampusMap2D({
  locations,
  selected,
  routeActive,
  variant,
  onSelect,
}: CampusMap2DProps) {
  const satellite = variant === 'satellite'
  const [zoom, setZoom] = useState(1)

  const changeZoom = (next: number) => setZoom(clamp(next, 1, 1.45))

  return (
    <div className={cn('map-stage', 'map-stage--2d', satellite && 'map-stage--satellite')}>
      <div
        className="map-canvas"
        style={{ transform: `scale(${zoom})`, transformOrigin: '50% 52%' }}
      >
        <MapArt selected={selected} routeActive={routeActive} variant={variant} />
        <div className="map-pins">
          {locations.map((location) => {
            const Icon = locationIconMap[location.icon]
            const isActive = location.id === selected.id
            return (
              <button
                key={location.id}
                className={cn('map-pin', isActive && 'is-active')}
                style={
                  {
                    left: `${location.x}%`,
                    top: `${location.y}%`,
                    '--pin-color': categoryColors[location.category],
                  } as CSSProperties
                }
                onClick={() => onSelect(location)}
                aria-label={`${location.name}，${location.category}`}
                aria-pressed={isActive}
              >
                <span className="map-pin__bubble">
                  <Icon size={15} strokeWidth={2.1} />
                </span>
                <span className="map-pin__label">
                  <strong>{location.name}</strong>
                  <small>{location.category}</small>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="map-zoom" aria-label="地图缩放">
        <button onClick={() => changeZoom(zoom + 0.1)} aria-label="放大地图">
          <Plus size={15} strokeWidth={2.2} />
        </button>
        <span>{Math.round(zoom * 100)}%</span>
        <button onClick={() => changeZoom(zoom - 0.1)} aria-label="缩小地图">
          <Minus size={15} strokeWidth={2.2} />
        </button>
        <button onClick={() => setZoom(1)} aria-label="重置缩放">
          <RotateCcw size={13} strokeWidth={2} />
        </button>
      </div>

      <span className="map-type-label">
        {satellite ? 'VIRTUAL SATELLITE · UKM CAMPUS' : '2D CAMPUS MAP · 示意'}
      </span>

      {satellite && (
        <div className="map-virtual-badge">
          <span>
            <i /> UKM VIRTUAL MAP
          </span>
          <small>本地渲染 · 无需外部 API</small>
        </div>
      )}
    </div>
  )
}
