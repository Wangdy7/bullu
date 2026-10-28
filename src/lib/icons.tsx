import {
  BedDouble,
  BookOpenCheck,
  Building2,
  BusFront,
  Compass,
  CreditCard,
  Dumbbell,
  HeartPulse,
  LibraryBig,
  Soup,
  UserRoundCheck,
  UsersRound,
  WalletCards,
  Waves,
  Wifi,
  ShieldCheck,
} from 'lucide-react'
import type { ResourceIcon, FreshmanStep, LocationIcon } from '../types'

export const locationIconMap = {
  library: LibraryBig,
  building: Building2,
  food: Soup,
  dorm: BedDouble,
  bus: BusFront,
  sport: Dumbbell,
  service: HeartPulse,
  lake: Waves,
} satisfies Record<LocationIcon, typeof Building2>

export const resourceIconMap = {
  bed: BedDouble,
  course: BookOpenCheck,
  services: Wifi,
  safety: ShieldCheck,
  wallet: WalletCards,
  food: Soup,
} satisfies Record<ResourceIcon, typeof BedDouble>

export const stepIconMap = {
  user: UserRoundCheck,
  card: CreditCard,
  users: UsersRound,
  compass: Compass,
} satisfies Record<FreshmanStep['icon'], typeof Compass>
