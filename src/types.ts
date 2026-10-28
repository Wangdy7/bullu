export type View =
  | 'home'
  | 'map'
  | 'freshman'
  | 'market'
  | 'community'
  | 'bus'
  | 'deals'
  | 'merchant'

export type LocationCategory =
  | '图书馆'
  | '教学楼'
  | '食堂'
  | '宿舍'
  | '巴士站'
  | '运动'
  | '校园服务'

export type LocationIcon =
  | 'library'
  | 'building'
  | 'food'
  | 'dorm'
  | 'bus'
  | 'sport'
  | 'service'
  | 'lake'

export interface CampusLocation {
  id: string
  name: string
  en: string
  category: LocationCategory
  icon: LocationIcon
  x: number
  y: number
  z?: number
  description: string
  hours: string
  walk: string
  aliases?: string[]
}

export interface FreshmanStep {
  id: string
  title: string
  subtitle: string
  icon: 'user' | 'card' | 'users' | 'compass'
  detail: string
}

export type ResourceIcon =
  | 'bed'
  | 'course'
  | 'services'
  | 'safety'
  | 'wallet'
  | 'food'

export interface FreshmanResource {
  id: string
  title: string
  subtitle: string
  category: string
  readTime: string
  icon: ResourceIcon
  intro: string
  paragraphs: string[]
  tips: string[]
}

export type MarketCategory = '全部' | '电子设备' | '书籍教材' | '家具' | '运动出行' | '生活用品'

export interface MarketItem {
  id: string
  title: string
  price: number
  category: Exclude<MarketCategory, '全部'>
  condition: string
  seller: string
  faculty: string
  location: string
  time: string
  description: string
  image: string
  featured?: boolean
  mine?: boolean
  saved?: boolean
}

export interface CommunityPost {
  id: string
  author: string
  faculty: string
  time: string
  topic: string
  title: string
  body: string
  likes: number
  comments: number
  tone: string
}

export interface BusRoute {
  id: string
  name: string
  en: string
  color: string
  stops: string[]
  next: string[]
  interval: string
  status: string
}

export interface StudentDeal {
  id: string
  partner: string
  title: string
  description: string
  offer: string
  category: '餐饮' | '打印' | '文具' | '生活'
  image?: string
  sponsored: boolean
  color: string
  distance: string
}

export interface User {
  name: string
  email: string
  student: boolean
}

export interface SearchEntry {
  id: string
  group: string
  title: string
  meta: string
  view: View
  targetId?: string
  search?: string
}
