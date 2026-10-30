import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  ExternalLink,
  FileText,
  GraduationCap,
  Info,
  ListChecks,
  MapPin,
  MessageCircle,
  MonitorSmartphone,
  RotateCcw,
  Sparkles,
  Stamp,
  Stethoscope,
} from 'lucide-react'
import { useApp } from '../app-context'
import { freshmanTasks } from '../freshman-tasks'
import type { FreshmanTask, FreshmanTaskIcon } from '../types'
import {
  freshmanProgressAdapter,
  type FreshmanProgressSnapshot,
} from '../lib/freshman-progress'
import { cn } from '../lib/utils'

const taskIconMap: Record<FreshmanTaskIcon, typeof FileText> = {
  materials: FileText,
  medical: Stethoscope,
  online: MonitorSmartphone,
  onsite: Building2,
  visa: Stamp,
  systems: GraduationCap,
}

function firstIncompleteTaskId(snapshot: FreshmanProgressSnapshot) {
  const next = freshmanTasks.find((task) => !snapshot.completedTaskIds.includes(task.id))
  return next?.id ?? freshmanTasks[0]?.id ?? null
}

export function FreshmanTaskCenter() {
  const { navigate, toast } = useApp()
  const [progress, setProgress] = useState<FreshmanProgressSnapshot>(() =>
    freshmanProgressAdapter.load(),
  )
  const [openTaskId, setOpenTaskId] = useState<string | null>(() =>
    firstIncompleteTaskId(freshmanProgressAdapter.load()),
  )

  useEffect(() => {
    freshmanProgressAdapter.save(progress)
  }, [progress])

  const completedCount = useMemo(
    () =>
      freshmanTasks.filter((task) => progress.completedTaskIds.includes(task.id)).length,
    [progress.completedTaskIds],
  )
  const percent = Math.round((completedCount / freshmanTasks.length) * 100)
  const nextTask = freshmanTasks.find((task) => !progress.completedTaskIds.includes(task.id))
  const allDone = completedCount === freshmanTasks.length

  const toggleTask = (task: FreshmanTask) => {
    const done = progress.completedTaskIds.includes(task.id)
    const completedTaskIds = done
      ? progress.completedTaskIds.filter((id) => id !== task.id)
      : [...progress.completedTaskIds, task.id]
    setProgress({
      ...progress,
      completedTaskIds,
      updatedAt: new Date().toISOString(),
    })
    toast(done ? `已撤销「${task.title}」的完成标记。` : `「${task.title}」已标记完成。`)
  }

  const toggleChecklist = (task: FreshmanTask, itemId: string) => {
    const current = progress.checklist[task.id] ?? []
    const nextItems = current.includes(itemId)
      ? current.filter((id) => id !== itemId)
      : [...current, itemId]
    const nextProgress = {
      ...progress,
      checklist: { ...progress.checklist, [task.id]: nextItems },
      updatedAt: new Date().toISOString(),
    }
    setProgress(nextProgress)

    const allChecked = task.checklist.every((item) => nextItems.includes(item.id))
    if (allChecked && !current.includes(itemId)) {
      toast(`「${task.title}」清单已全部完成。可以继续下一步了。`)
    }
  }

  const openChecklist = (task: FreshmanTask) => {
    setOpenTaskId(task.id)
    window.setTimeout(() => {
      document.getElementById(`task-checklist-${task.id}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }, 60)
  }

  const goMap = (task: FreshmanTask) => {
    navigate('map', task.locationId ? { targetId: task.locationId } : undefined)
  }

  const askForHelp = (task: FreshmanTask) => {
    toast(`${task.helpPrompt} 去校园社区问问同学。`)
    navigate('community')
  }

  const resetProgress = () => {
    if (!window.confirm('确定要清除这台设备上的全部入学任务进度吗？')) return
    setProgress({
      version: 1,
      completedTaskIds: [],
      checklist: {},
      updatedAt: new Date().toISOString(),
    })
    setOpenTaskId(freshmanTasks[0]?.id ?? null)
    toast('入学任务进度已重置。')
  }

  return (
    <section className="page-width freshman-task-center" id="freshman-checklist">
      <div className="freshman-task-center__intro">
        <span className="eyebrow">
          <span>YOUR ENROLLMENT</span>
          <i />
          入学任务
        </span>
        <h2>把入学这件事，拆成六步。</h2>
        <p>
          从材料准备到选课，每一步都可以展开、查看清单并手动标记完成。
          进度只保存在你的设备上，不会自动同步到学校系统。
        </p>
      </div>

      <div className="task-progress-card">
        <div className="task-progress-card__main">
          <div className="task-progress-card__label">
            <span className="task-progress-card__dot" />
            入学进度
          </div>
          <div className="task-progress-card__value" aria-live="polite">
            {percent}
            <span>%</span>
          </div>
          <div className="task-progress-card__meta">
            <span>
              <strong>{completedCount}</strong> / {freshmanTasks.length} 个任务已完成
            </span>
            <span>手动记录</span>
          </div>
          <div
            className="task-progress-card__bar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            aria-label="入学任务完成进度"
          >
            <i style={{ width: `${percent}%` }} />
          </div>
        </div>

        <div className="task-progress-card__next">
          <span className="task-progress-card__next-label">
            {allDone ? '全部完成' : '下一步'}
          </span>
          {allDone ? (
            <strong>六步都已完成，准备好开始校园生活了。</strong>
          ) : (
            <>
              <strong>{nextTask?.title}</strong>
              <p>{nextTask?.subtitle}</p>
              <button
                className="task-progress-card__next-link"
                onClick={() => nextTask && setOpenTaskId(nextTask.id)}
              >
                打开下一步 <ArrowRight size={15} strokeWidth={2} />
              </button>
            </>
          )}
        </div>

        {completedCount > 0 && (
          <button className="task-progress-card__reset" onClick={resetProgress}>
            <RotateCcw size={13} strokeWidth={2} /> 重置进度
          </button>
        )}
      </div>

      <div className="task-list">
        {freshmanTasks.map((task) => {
          const Icon = taskIconMap[task.icon]
          const done = progress.completedTaskIds.includes(task.id)
          const checked = progress.checklist[task.id] ?? []
          const checkedCount = task.checklist.filter((item) => checked.includes(item.id)).length
          const checklistDone = checkedCount === task.checklist.length
          const open = openTaskId === task.id
          const firstLink = task.links[0]

          return (
            <article
              key={task.id}
              className={cn('task-card', open && 'is-open', done && 'is-done')}
            >
              <button
                className="task-card__summary"
                onClick={() => setOpenTaskId(open ? null : task.id)}
                aria-expanded={open}
                aria-controls={`task-body-${task.id}`}
              >
                <span className="task-card__number">{task.number}</span>
                <span className="task-card__icon">
                  <Icon size={21} strokeWidth={1.7} />
                </span>
                <span className="task-card__heading">
                  <span className="task-card__title-row">
                    <strong>{task.title}</strong>
                    <span className={cn('task-card__status', done && 'is-done')}>
                      {done ? '已完成' : '待完成'}
                    </span>
                  </span>
                  <small>{task.subtitle}</small>
                </span>
                <span className="task-card__aside">
                  <span className={cn('task-card__count', checklistDone && 'is-complete')}>
                    <ListChecks size={13} strokeWidth={2} />
                    {checkedCount}/{task.checklist.length}
                  </span>
                  <ChevronDown
                    className="task-card__chevron"
                    size={18}
                    strokeWidth={2}
                  />
                </span>
              </button>

              <div className="task-card__expand" id={`task-body-${task.id}`}>
                <div>
                  <div className="task-card__body">
                    <div className="task-card__body-top">
                      <p className="task-card__summary-text">{task.summary}</p>
                      {done && (
                        <span className="task-card__done-note">
                          <CheckCircle2 size={14} strokeWidth={2} />
                          由你手动标记完成
                        </span>
                      )}
                    </div>

                    <div className="task-card__section">
                      <div className="task-card__section-head">
                        <span>
                          <ListChecks size={15} strokeWidth={2} /> 任务步骤
                        </span>
                        <small>按顺序完成</small>
                      </div>
                      <ol className="task-steps">
                        {task.steps.map((step, index) => (
                          <li key={step.title}>
                            <span className="task-steps__index">{String(index + 1).padStart(2, '0')}</span>
                            <div>
                              <strong>{step.title}</strong>
                              <p>{step.detail}</p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="task-card__section" id={`task-checklist-${task.id}`}>
                      <div className="task-card__section-head">
                        <span>
                          <CheckCircle2 size={15} strokeWidth={2} /> 材料清单
                        </span>
                        <small>
                          {checkedCount}/{task.checklist.length} 已勾选
                        </small>
                      </div>
                      <div className="task-checklist">
                        {task.checklist.map((item) => {
                          const checkedItem = checked.includes(item.id)
                          return (
                            <label
                              key={item.id}
                              className={cn('task-check', checkedItem && 'is-checked')}
                            >
                              <input
                                type="checkbox"
                                checked={checkedItem}
                                onChange={() => toggleChecklist(task, item.id)}
                              />
                              <span className="task-check__box">
                                {checkedItem && <Check size={13} strokeWidth={3} />}
                              </span>
                              <span>{item.label}</span>
                            </label>
                          )
                        })}
                      </div>
                      {checklistDone && (
                        <div className="task-checklist__done">
                          <CheckCircle2 size={15} strokeWidth={2} />
                          清单已全部完成。准备好后，点「我已完成」记录这一刻。
                        </div>
                      )}
                    </div>

                    <div className="task-card__resources">
                      <div>
                        <span className="task-card__resources-label">官方入口</span>
                        <div className="task-card__links">
                          {task.links.map((link) => (
                            <a
                              key={link.url}
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {link.label}
                              <ArrowUpRight size={13} strokeWidth={2} />
                            </a>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="task-card__resources-label">相关地点</span>
                        <button className="task-card__place" onClick={() => goMap(task)}>
                          <MapPin size={14} strokeWidth={2} />
                          {task.locationLabel ?? '在校园地图中查看'}
                        </button>
                      </div>
                    </div>

                    <div className="task-card__actions">
                      <button
                        className="task-action task-action--soft"
                        onClick={() => openChecklist(task)}
                      >
                        <ListChecks size={15} strokeWidth={2} />
                        查看清单
                      </button>
                      {firstLink && (
                        <a
                          className="task-action task-action--soft"
                          href={firstLink.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <ExternalLink size={15} strokeWidth={2} />
                          前往官网
                        </a>
                      )}
                      <button
                        className="task-action task-action--soft"
                        onClick={() => goMap(task)}
                      >
                        <MapPin size={15} strokeWidth={2} />
                        地图导航
                      </button>
                      <button
                        className={cn('task-action', done ? 'task-action--undo' : 'task-action--green')}
                        onClick={() => toggleTask(task)}
                      >
                        {done ? (
                          <>
                            <RotateCcw size={15} strokeWidth={2} />
                            撤销完成
                          </>
                        ) : (
                          <>
                            <Check size={15} strokeWidth={2.6} />
                            我已完成
                          </>
                        )}
                      </button>
                      <button
                        className="task-action task-action--ghost"
                        onClick={() => askForHelp(task)}
                      >
                        <CircleHelp size={15} strokeWidth={2} />
                        遇到问题
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <div className="task-center__after">
        <div className="task-center__after-copy">
          <span>安顿之后</span>
          <strong>还有两件小事，可以慢慢来。</strong>
          <p>
            拿到校园卡后，去图书馆、食堂和巴士站走一遍。社团招新通常集中在新生周，
            先选一个真正感兴趣的，再决定要不要加第二个。
          </p>
        </div>
        <div className="task-center__after-actions">
          <button onClick={() => navigate('map')}>
            <MapPin size={14} strokeWidth={2} /> 熟悉校园设施
          </button>
          <button onClick={() => navigate('community')}>
            <MessageCircle size={14} strokeWidth={2} /> 看看社团招新
          </button>
        </div>
      </div>

      <div className="task-center__note">
        <Info size={15} strokeWidth={2} />
        <span>
          完成状态由你手动标记，仅用于个人进度记录，不代表学校审核通过。
          官方要求、费用、截止日期与审核状态请以 UKM、join.ukm.my、EMGS 和学校邮件的最新通知为准。
        </span>
      </div>

      <div className="task-center__foot">
        <span>
          <Sparkles size={14} strokeWidth={2} />
          进度自动保存在当前浏览器
        </span>
        <button onClick={() => navigate('community')}>
          <MessageCircle size={14} strokeWidth={2} />
          去社区问问
        </button>
      </div>
    </section>
  )
}
