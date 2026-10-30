import type { AdmissionStatus, StudentAudience } from '../types'

export interface AdmissionProgressSnapshot {
  version: 1
  audience: StudentAudience
  statuses: Record<string, AdmissionStatus>
  checklist: Record<string, string[]>
  updatedAt: string
}

export interface AdmissionProgressAdapter {
  load: () => AdmissionProgressSnapshot
  save: (snapshot: AdmissionProgressSnapshot) => void
  /** Reserved for a future Supabase adapter. */
  sync?: (snapshot: AdmissionProgressSnapshot) => Promise<AdmissionProgressSnapshot>
}

export const ADMISSION_PROGRESS_KEY = 'bullu-admission-center-v1'

export function emptyAdmissionProgress(): AdmissionProgressSnapshot {
  return {
    version: 1,
    audience: 'international',
    statuses: {},
    checklist: {},
    updatedAt: new Date().toISOString(),
  }
}

function normalize(value: unknown): AdmissionProgressSnapshot {
  if (!value || typeof value !== 'object') return emptyAdmissionProgress()
  const source = value as Partial<AdmissionProgressSnapshot>
  const audience: StudentAudience =
    source.audience === 'local' || source.audience === 'international'
      ? source.audience
      : 'international'
  const statuses: Record<string, AdmissionStatus> = {}
  if (source.statuses && typeof source.statuses === 'object') {
    for (const [taskId, status] of Object.entries(source.statuses)) {
      if (status === 'not_started' || status === 'in_progress' || status === 'completed') {
        statuses[taskId] = status
      }
    }
  }
  const checklist: Record<string, string[]> = {}
  if (source.checklist && typeof source.checklist === 'object') {
    for (const [taskId, items] of Object.entries(source.checklist)) {
      if (Array.isArray(items)) {
        checklist[taskId] = items.filter((id): id is string => typeof id === 'string')
      }
    }
  }
  return {
    version: 1,
    audience,
    statuses,
    checklist,
    updatedAt:
      typeof source.updatedAt === 'string' ? source.updatedAt : new Date().toISOString(),
  }
}

export function createLocalAdmissionProgressAdapter(
  storage: Storage | undefined = typeof window === 'undefined' ? undefined : window.localStorage,
): AdmissionProgressAdapter {
  return {
    load() {
      if (!storage) return emptyAdmissionProgress()
      try {
        const raw = storage.getItem(ADMISSION_PROGRESS_KEY)
        return raw ? normalize(JSON.parse(raw)) : emptyAdmissionProgress()
      } catch {
        return emptyAdmissionProgress()
      }
    },
    save(snapshot) {
      if (!storage) return
      try {
        storage.setItem(ADMISSION_PROGRESS_KEY, JSON.stringify(snapshot))
      } catch {
        // Private browsing can block storage; the UI still works for this session.
      }
    },
  }
}

export const admissionProgressAdapter = createLocalAdmissionProgressAdapter()
