export interface FreshmanProgressSnapshot {
  version: 1
  completedTaskIds: string[]
  /** task id -> checked checklist item ids */
  checklist: Record<string, string[]>
  updatedAt: string
}

export interface FreshmanProgressAdapter {
  load: () => FreshmanProgressSnapshot
  save: (snapshot: FreshmanProgressSnapshot) => void
}

export const FRESHMAN_PROGRESS_KEY = 'bullu-freshman-task-progress-v1'

export function emptyFreshmanProgress(): FreshmanProgressSnapshot {
  return {
    version: 1,
    completedTaskIds: [],
    checklist: {},
    updatedAt: new Date().toISOString(),
  }
}

function normalize(value: unknown): FreshmanProgressSnapshot {
  if (!value || typeof value !== 'object') return emptyFreshmanProgress()
  const source = value as Partial<FreshmanProgressSnapshot>
  const completedTaskIds = Array.isArray(source.completedTaskIds)
    ? source.completedTaskIds.filter((id): id is string => typeof id === 'string')
    : []
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
    completedTaskIds,
    checklist,
    updatedAt:
      typeof source.updatedAt === 'string' ? source.updatedAt : new Date().toISOString(),
  }
}

/**
 * Local adapter for phase 1.
 * A future Supabase adapter can implement the same interface without changing the UI.
 */
export function createLocalFreshmanProgressAdapter(
  storage: Storage | undefined = typeof window === 'undefined' ? undefined : window.localStorage,
): FreshmanProgressAdapter {
  return {
    load() {
      if (!storage) return emptyFreshmanProgress()
      try {
        const raw = storage.getItem(FRESHMAN_PROGRESS_KEY)
        return raw ? normalize(JSON.parse(raw)) : emptyFreshmanProgress()
      } catch {
        return emptyFreshmanProgress()
      }
    },
    save(snapshot) {
      if (!storage) return
      try {
        storage.setItem(FRESHMAN_PROGRESS_KEY, JSON.stringify(snapshot))
      } catch {
        // Storage can be blocked in private browsing; the UI still works for this session.
      }
    },
  }
}

export const freshmanProgressAdapter = createLocalFreshmanProgressAdapter()
