export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export function initials(name: string) {
  const trimmed = name.trim()
  if (!trimmed) return 'BU'
  const parts = trimmed.split(/\s+/)
  if (parts.length > 1) return parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase()
  return trimmed.slice(0, 2).toUpperCase()
}

export function uid(prefix = 'item') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export function formatRM(price: number) {
  return `RM${price.toLocaleString('en-MY')}`
}

export function avatarTone(seed: string) {
  const tones = ['#1469ff', '#0e9f84', '#df8a51', '#7161e8', '#d95c76', '#4b7b9a']
  let hash = 0
  for (let index = 0; index < seed.length; index += 1) {
    hash = seed.charCodeAt(index) + ((hash << 5) - hash)
  }
  return tones[Math.abs(hash) % tones.length]
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
