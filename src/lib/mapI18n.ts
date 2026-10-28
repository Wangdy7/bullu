import type { CampusLocation, LocationCategory } from '../types'

export type MapLanguage = 'zh' | 'en' | 'ms'

export const mapLanguages: Array<{ value: MapLanguage; label: string; short: string }> = [
  { value: 'zh', label: '中文', short: '中文' },
  { value: 'en', label: 'English', short: 'EN' },
  { value: 'ms', label: 'Bahasa Melayu', short: 'BM' },
]

const categories: Record<MapLanguage, Record<LocationCategory | '全部', string>> = {
  zh: {
    全部: '全部',
    图书馆: '图书馆',
    教学楼: '教学楼',
    食堂: '食堂',
    宿舍: '宿舍',
    巴士站: '巴士站',
    运动: '运动',
    校园服务: '校园服务',
  },
  en: {
    全部: 'All',
    图书馆: 'Library',
    教学楼: 'Academic',
    食堂: 'Food',
    宿舍: 'Residence',
    巴士站: 'Bus',
    运动: 'Sports',
    校园服务: 'Services',
  },
  ms: {
    全部: 'Semua',
    图书馆: 'Perpustakaan',
    教学楼: 'Akademik',
    食堂: 'Makanan',
    宿舍: 'Kediaman',
    巴士站: 'Bas',
    运动: 'Sukan',
    校园服务: 'Perkhidmatan',
  },
}

export function mapCategoryLabel(language: MapLanguage, category: LocationCategory | '全部') {
  return categories[language][category]
}

interface MapCopy {
  pageTitle: string
  heading: string
  intro: string
  status: string
  statLocations: string
  statRoutes: string
  statViews: string
  searchPlaceholder: string
  popular: string
  places: string
  walkingTime: string
  noResults: string
  emptyHint: string
  sidebarNote: string
  explore: string
  toolbarHint: string
  mapView: string
  threeDView: string
  openNow: string
  hours: string
  walk: string
  planRoute: string
  routeShown: string
  view3d: string
  viewMap: string
  routeInfo: (name: string) => string
  routeBannerTitle: string
  mainGate: string
  disclaimer: string
  mapboxBadge: string
  mapboxBadgeSub: string
  languageLabel: string
  routeNotAvailable?: string
}

const copy: Record<MapLanguage, MapCopy> = {
  zh: {
    pageTitle: '校园地图 · BullU',
    heading: '校园地图',
    intro: '真实 Mapbox 底图，支持滚轮、双指缩放与 3D 倾斜。校园地点坐标为 BullU 演示数据。',
    status: 'Mapbox 实时底图 · 可缩放',
    statLocations: '个地点',
    statRoutes: '条路线',
    statViews: '种视图',
    searchPlaceholder: '搜索地点、建筑或设施',
    popular: '热门目的地',
    places: '个地点',
    walkingTime: '步行时间',
    noResults: '没有找到地点',
    emptyHint: '换个关键词试试',
    sidebarNote: '地点位置为演示坐标；底图由 Mapbox / OpenStreetMap 提供，正式版本会做人工核对。',
    explore: '探索 UKM Bangi',
    toolbarHint: 'Mapbox · 滚轮缩放 · 拖动探索',
    mapView: '地图',
    threeDView: '3D',
    openNow: '开放中',
    hours: '开放时间',
    walk: '步行',
    planRoute: '规划路线',
    routeShown: '路线已显示',
    view3d: '3D 查看',
    viewMap: '地图查看',
    routeInfo: (name) => `从校园正门到 ${name} 为示意路线，实际步行时间请以现场标识为准。`,
    routeBannerTitle: '推荐步行路线',
    mainGate: '正门',
    disclaimer: '底图 © Mapbox © OpenStreetMap；校园地点与路线为 BullU 演示数据，不是导航数据。',
    mapboxBadge: 'UKM · MAPBOX',
    mapboxBadgeSub: '实时底图',
    languageLabel: '地图语言',
  },
  en: {
    pageTitle: 'Campus Map · BullU',
    heading: 'Campus Map',
    intro: 'A real Mapbox basemap with wheel, pinch and 3D tilt. Campus coordinates are BullU demo data.',
    status: 'Mapbox live basemap · Zoomable',
    statLocations: 'places',
    statRoutes: 'routes',
    statViews: 'views',
    searchPlaceholder: 'Search places, buildings or facilities',
    popular: 'Popular destinations',
    places: 'places',
    walkingTime: 'Walking time',
    noResults: 'No places found',
    emptyHint: 'Try another keyword',
    sidebarNote: 'Coordinates are demo data; basemap by Mapbox / OpenStreetMap. Locations will be verified before launch.',
    explore: 'Explore UKM Bangi',
    toolbarHint: 'Mapbox · scroll to zoom · drag to explore',
    mapView: 'Map',
    threeDView: '3D',
    openNow: 'Open now',
    hours: 'Opening hours',
    walk: 'Walk',
    planRoute: 'Plan route',
    routeShown: 'Route shown',
    view3d: '3D view',
    viewMap: 'Map view',
    routeInfo: (name) => `The route from the main gate to ${name} is indicative. Check on-site signage for the actual walking time.`,
    routeBannerTitle: 'Suggested walking route',
    mainGate: 'Main gate',
    disclaimer: 'Basemap © Mapbox © OpenStreetMap; campus points and routes are BullU demo data, not navigation data.',
    mapboxBadge: 'UKM · MAPBOX',
    mapboxBadgeSub: 'Live basemap',
    languageLabel: 'Map language',
  },
  ms: {
    pageTitle: 'Peta Kampus · BullU',
    heading: 'Peta Kampus',
    intro: 'Peta asas Mapbox sebenar dengan zum roda, cubit dan kecondongan 3D. Koordinat kampus ialah data demo BullU.',
    status: 'Peta langsung Mapbox · Boleh zum',
    statLocations: 'lokasi',
    statRoutes: 'laluan',
    statViews: 'paparan',
    searchPlaceholder: 'Cari lokasi, bangunan atau kemudahan',
    popular: 'Destinasi popular',
    places: 'lokasi',
    walkingTime: 'Masa berjalan',
    noResults: 'Tiada lokasi ditemui',
    emptyHint: 'Cuba kata kunci lain',
    sidebarNote: 'Koordinat ialah data demo; peta asas oleh Mapbox / OpenStreetMap. Lokasi akan disemak sebelum pelancaran.',
    explore: 'Jelajah UKM Bangi',
    toolbarHint: 'Mapbox · tatal untuk zum · seret untuk teroka',
    mapView: 'Peta',
    threeDView: '3D',
    openNow: 'Buka sekarang',
    hours: 'Waktu operasi',
    walk: 'Berjalan',
    planRoute: 'Rancang laluan',
    routeShown: 'Laluan dipaparkan',
    view3d: 'Paparan 3D',
    viewMap: 'Paparan peta',
    routeInfo: (name) => `Laluan dari pintu utama ke ${name} adalah indikatif. Semak papan tanda di lokasi untuk masa berjalan sebenar.`,
    routeBannerTitle: 'Laluan berjalan disyorkan',
    mainGate: 'Pintu utama',
    disclaimer: 'Peta asas © Mapbox © OpenStreetMap; lokasi dan laluan kampus ialah data demo BullU, bukan data navigasi.',
    mapboxBadge: 'UKM · MAPBOX',
    mapboxBadgeSub: 'Peta langsung',
    languageLabel: 'Bahasa peta',
  },
}

interface LocationTranslation {
  description: string
  walk: string
  walkShort: string
}

const englishLocations: Record<string, LocationTranslation> = {
  library: {
    description:
      "UKM's main library, with quiet study areas, discussion rooms and extensive digital resources. Book a discussion room early during midterms.",
    walk: '12 min walk from the main gate',
    walkShort: '12 min from gate',
  },
  pusanika: {
    description:
      'The busiest spot on campus: food court, convenience store, print shop, student services and club activities all in one place.',
    walk: '8 min walk from the main gate',
    walkShort: '8 min from gate',
  },
  fssk: {
    description:
      'Teaching blocks and faculty offices for Social Sciences and Humanities, close to the west bus stop. Find your faculty hall during orientation week.',
    walk: '5 min walk from Pusanika',
    walkShort: '5 min from Pusanika',
  },
  fep: {
    description:
      'Economics and Management teaching blocks, lecture halls and study areas. Most undergraduate classes are in Zone A; arrive 15 minutes early on the first day.',
    walk: '4 min walk from the library',
    walkShort: '4 min from library',
  },
  zaaba: {
    description:
      'Eastern residential college with nearby food, a minimarket and laundry. Campus security escorts can be arranged for late-night returns.',
    walk: '9 min walk from Pusanika',
    walkShort: '9 min from Pusanika',
  },
  kkm: {
    description:
      'Residential college near the southern green, about a 12-minute walk to Pusanika. Shared laundry and water dispensers are downstairs.',
    walk: '6 min walk from the bus terminal',
    walkShort: '6 min from bus terminal',
  },
  sports: {
    description:
      'Athletics track, badminton courts and swimming pool. Some facilities require booking or student-card registration.',
    walk: '6 min walk from FSSK',
    walkShort: '6 min from FSSK',
  },
  bus: {
    description:
      'Starting point for Zone A and Zone B campus shuttles and some external connections. First and last bus times may change each semester.',
    walk: 'Right by the main gate',
    walkShort: 'At main gate',
  },
  danau: {
    description:
      "UKM's favourite walking and running spot. One loop is about 2.5 km, especially pleasant with friends in the evening.",
    walk: "7 min walk from Za'ba",
    walkShort: "7 min from Za'ba",
  },
  health: {
    description:
      'Basic outpatient care, minor illness treatment and student insurance advice. Bring your student card and call ahead to confirm hours.',
    walk: '4 min walk from Pusanika',
    walkShort: '4 min from Pusanika',
  },
}

const malayLocations: Record<string, LocationTranslation> = {
  library: {
    description:
      'Perpustakaan utama UKM dengan ruang belajar tenang, bilik perbincangan dan sumber digital yang luas. Tempah bilik lebih awal semasa minggu pertengahan semester.',
    walk: '12 minit berjalan dari pintu utama',
    walkShort: '12 minit dari pintu utama',
  },
  pusanika: {
    description:
      'Tempat paling sibuk di kampus: medan selera, kedai serbaneka, kedai cetak, perkhidmatan pelajar dan aktiviti kelab di satu tempat.',
    walk: '8 minit berjalan dari pintu utama',
    walkShort: '8 minit dari pintu utama',
  },
  fssk: {
    description:
      'Blok pengajaran dan pejabat fakulti Sains Sosial dan Kemanusiaan, berhampiran perhentian bas barat. Cari dewan fakulti anda pada minggu orientasi.',
    walk: '5 minit berjalan dari Pusanika',
    walkShort: '5 minit dari Pusanika',
  },
  fep: {
    description:
      'Blok pengajaran Ekonomi dan Pengurusan, dewan kuliah dan ruang belajar. Kebanyakan kelas sarjana muda di Zon A; datang 15 minit awal pada hari pertama.',
    walk: '4 minit berjalan dari perpustakaan',
    walkShort: '4 minit dari perpustakaan',
  },
  zaaba: {
    description:
      'Kolej kediaman di timur dengan makanan, minimarket dan dobi berdekatan. Pengiring keselamatan kampus boleh diatur untuk pulang lewat malam.',
    walk: '9 minit berjalan dari Pusanika',
    walkShort: '9 minit dari Pusanika',
  },
  kkm: {
    description:
      'Kolej kediaman berhampiran kawasan hijau selatan, kira-kira 12 minit berjalan ke Pusanika. Dobi bersama dan dispenser air di tingkat bawah.',
    walk: '6 minit berjalan dari terminal bas',
    walkShort: '6 minit dari terminal bas',
  },
  sports: {
    description:
      'Trek olahraga, gelanggang badminton dan kolam renang. Sesetengah kemudahan memerlukan tempahan atau pendaftaran kad pelajar.',
    walk: '6 minit berjalan dari FSSK',
    walkShort: '6 minit dari FSSK',
  },
  bus: {
    description:
      'Titik permulaan bas kampus Zon A dan Zon B serta beberapa sambungan luar. Waktu bas pertama dan terakhir boleh berubah setiap semester.',
    walk: 'Betul-betul di pintu utama',
    walkShort: 'Di pintu utama',
  },
  danau: {
    description:
      'Tempat berjalan dan berlari kegemaran warga UKM. Satu pusingan kira-kira 2.5 km, lebih menyeronokkan bersama rakan pada waktu petang.',
    walk: "7 minit berjalan dari Za'ba",
    walkShort: "7 minit dari Za'ba",
  },
  health: {
    description:
      'Rawatan pesakit luar asas, rawatan penyakit ringan dan nasihat insurans pelajar. Bawa kad pelajar dan hubungi dahulu untuk mengesahkan waktu.',
    walk: '4 minit berjalan dari Pusanika',
    walkShort: '4 minit dari Pusanika',
  },
}

export interface LocalizedLocation extends CampusLocation {
  categoryLabel: string
  walkShort: string
  secondaryName: string
}

function localizeHours(language: MapLanguage, hours: string) {
  if (language === 'en') {
    if (hours === '24 小时开放') return 'Open 24 hours'
    if (hours === '全天开放') return 'Open all day'
  }
  if (language === 'ms') {
    if (hours === '24 小时开放') return 'Buka 24 jam'
    if (hours === '全天开放') return 'Buka sepanjang hari'
  }
  return hours
}

export function localizeLocation(
  language: MapLanguage,
  location: CampusLocation,
): LocalizedLocation {
  if (language === 'zh') {
    return {
      ...location,
      categoryLabel: mapCategoryLabel(language, location.category),
      walkShort: location.walk.replace('从', '').replace('步行 ', ''),
      secondaryName: location.en,
    }
  }

  const translations = language === 'en' ? englishLocations : malayLocations
  const translated = translations[location.id]
  return {
    ...location,
    name: location.en,
    description: translated?.description ?? location.description,
    hours: localizeHours(language, location.hours),
    walk: translated?.walk ?? location.walk,
    categoryLabel: mapCategoryLabel(language, location.category),
    walkShort: translated?.walkShort ?? location.walk,
    secondaryName: '',
  }
}

export function getMapCopy(language: MapLanguage) {
  return copy[language]
}
