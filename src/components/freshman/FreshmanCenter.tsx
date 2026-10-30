import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Info } from 'lucide-react'
import { useApp } from '../../app-context'
import { admissionTasks, tasksForAudience } from '../../admission-tasks'
import type { AdmissionStatus, AdmissionTask, StudentAudience } from '../../types'
import {
  admissionProgressAdapter,
  type AdmissionProgressSnapshot,
} from '../../lib/admission-progress'
import { WelcomeHero } from './WelcomeHero'
import { AdmissionProgress } from './AdmissionProgress'
import { NextTaskCard } from './NextTaskCard'
import { AdmissionTaskList } from './AdmissionTaskList'
import { TaskDetailSheet } from './TaskDetailSheet'
import { CampusExploreCard } from './CampusExploreCard'

export function FreshmanCenter() {
  const { navigate, toast } = useApp()
  const [progress, setProgress] = useState<AdmissionProgressSnapshot>(() =>
    admissionProgressAdapter.load(),
  )
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  useEffect(() => {
    admissionProgressAdapter.save(progress)
  }, [progress])

  const applicableTasks = useMemo(
    () => tasksForAudience(progress.audience),
    [progress.audience],
  )

  const completedCount = applicableTasks.filter(
    (task) => progress.statuses[task.id] === 'completed',
  ).length
  const percent = applicableTasks.length
    ? Math.round((completedCount / applicableTasks.length) * 100)
    : 0

  const nextTask =
    applicableTasks.find((task) => progress.statuses[task.id] === 'in_progress') ??
    applicableTasks.find((task) => progress.statuses[task.id] !== 'completed') ??
    null

  const statusFor = (taskId: string): AdmissionStatus =>
    progress.statuses[taskId] ?? 'not_started'

  const checklistFor = (taskId: string) => progress.checklist[taskId] ?? []

  const selectedTask =
    admissionTasks.find((task) => task.id === selectedTaskId) ?? null

  const setAudience = (audience: StudentAudience) => {
    setProgress((current) => ({
      ...current,
      audience,
      updatedAt: new Date().toISOString(),
    }))
    if (
      selectedTask &&
      selectedTask.audience !== 'all' &&
      selectedTask.audience !== audience
    ) {
      setSelectedTaskId(null)
    }
  }

  const setStatus = (taskId: string, status: AdmissionStatus) => {
    setProgress((current) => ({
      ...current,
      statuses: { ...current.statuses, [taskId]: status },
      updatedAt: new Date().toISOString(),
    }))
    if (status === 'completed') {
      const task = admissionTasks.find((item) => item.id === taskId)
      toast(`「${task?.title ?? '任务'}」已标记完成。`)
    }
  }

  const toggleCheck = (taskId: string, itemId: string) => {
    setProgress((current) => {
      const currentItems = current.checklist[taskId] ?? []
      const nextItems = currentItems.includes(itemId)
        ? currentItems.filter((id) => id !== itemId)
        : [...currentItems, itemId]
      return {
        ...current,
        checklist: { ...current.checklist, [taskId]: nextItems },
        updatedAt: new Date().toISOString(),
      }
    })
  }

  const openTask = (task: AdmissionTask) => setSelectedTaskId(task.id)

  const scrollToChecklist = () => {
    document.getElementById('fc-checklist')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  const goMap = (task: AdmissionTask) => {
    if (task.location?.targetId) {
      navigate('map', { targetId: task.location.targetId })
    } else {
      navigate('map')
    }
  }

  return (
    <div className="fc-page">
      <div className="fc-shell">
        <WelcomeHero
          audience={progress.audience}
          onAudienceChange={setAudience}
          onStart={scrollToChecklist}
        />

        <div className="fc-overview">
          <AdmissionProgress
            percent={percent}
            completedCount={completedCount}
            totalCount={applicableTasks.length}
            audience={progress.audience}
          />
          {nextTask ? (
            <NextTaskCard
              task={nextTask}
              status={statusFor(nextTask.id)}
              onOpen={() => openTask(nextTask)}
            />
          ) : (
            <section className="fc-all-done">
              <CheckCircle2 size={24} strokeWidth={1.7} />
              <div>
                <span className="fc-eyebrow">ALL SET</span>
                <h2>这一阶段的准备都完成了。</h2>
                <p>到校后仍请以学院、注册处和学校邮件的最新通知为准。</p>
              </div>
            </section>
          )}
        </div>

        {progress.audience === 'local' && (
          <p className="fc-audience-note">
            <Info size={14} strokeWidth={2} />
            已切换为本地学生流程。体检和签证仅在国际学生流程中显示，具体安排仍以学校通知为准。
          </p>
        )}

        <AdmissionTaskList
          tasks={applicableTasks}
          statuses={progress.statuses}
          onOpen={openTask}
        />

        <CampusExploreCard />

        <p className="fc-disclaimer">
          <Info size={14} strokeWidth={2} />
          完成状态由你手动标记，仅用于个人进度记录，不代表学校审核通过。官方步骤、费用、截止日期和审核状态请以
          UKM、join.ukm.my、EMGS 和学校邮件的最新通知为准。
        </p>
      </div>

      <TaskDetailSheet
        task={selectedTask}
        status={selectedTask ? statusFor(selectedTask.id) : 'not_started'}
        checklist={selectedTask ? checklistFor(selectedTask.id) : []}
        audience={progress.audience}
        onClose={() => setSelectedTaskId(null)}
        onStatusChange={(status) => {
          if (selectedTask) setStatus(selectedTask.id, status)
        }}
        onToggleCheck={(itemId) => {
          if (selectedTask) toggleCheck(selectedTask.id, itemId)
        }}
        onGoMap={goMap}
      />
    </div>
  )
}
