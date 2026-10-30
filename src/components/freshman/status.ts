import type { AdmissionStatus } from '../../types'

export const statusLabels: Record<AdmissionStatus, string> = {
  not_started: '未开始',
  in_progress: '进行中',
  completed: '已完成',
}

export function statusLabel(status: AdmissionStatus) {
  return statusLabels[status]
}

export const statusOptions: { value: AdmissionStatus; label: string }[] = [
  { value: 'not_started', label: '未开始' },
  { value: 'in_progress', label: '进行中' },
  { value: 'completed', label: '已完成' },
]
