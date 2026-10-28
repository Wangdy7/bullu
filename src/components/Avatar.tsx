import { avatarTone, cn, initials } from '../lib/utils'

interface AvatarProps {
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  tone?: string
  className?: string
}

export function Avatar({ name, size = 'md', tone, className }: AvatarProps) {
  return (
    <span
      className={cn('avatar', `avatar--${size}`, className)}
      style={{ background: tone ?? avatarTone(name) }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  )
}
