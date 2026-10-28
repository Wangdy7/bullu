import { useState, type FormEvent } from 'react'
import { ArrowRight, Check, GraduationCap, LockKeyhole, Mail, Sparkles } from 'lucide-react'
import { useApp } from '../app-context'
import { Modal } from './Modal'

interface AuthModalProps {
  open: boolean
  onClose: () => void
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const { login, toast, t } = useApp()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const finish = (nextName: string, nextEmail: string, student = false) => {
    login({ name: nextName, email: nextEmail, student })
    toast(t('欢迎来到 BullU，{name}。', { name: nextName }))
    onClose()
    setName('')
    setEmail('')
    setError('')
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) {
      setError(t('先告诉我们怎么称呼你。'))
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(t('请输入一个有效的邮箱地址。'))
      return
    }
    finish(name.trim(), email.trim())
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      className="auth-modal"
      ariaLabel={t('加入 BullU')}
    >
      <div className="auth-modal__grid">
        <div className="auth-modal__visual">
          <img src="./images/students-collab.jpg" alt={t('学生在一起学习')} />
          <div className="auth-modal__overlay" />
          <div className="auth-modal__quote">
            <span className="auth-modal__pill">
              <Sparkles size={12} strokeWidth={2} /> ONE CAMPUS, ONE PLACE
            </span>
            <h2>{t('你的 UKM 生活，')}<br />{t('从这里开始。')}</h2>
            <p>{t('找到教室、认识同学、把闲置传给下一位同学。')}</p>
          </div>
        </div>
        <div className="auth-modal__form">
          <span className="eyebrow">
            <span>JOIN BULLU</span>
            <i />
            {t('学生免费使用')}
          </span>
          <h3>{t('欢迎来到 BullU')}</h3>
          <p className="auth-modal__intro">
            {t('用普通邮箱即可开始探索。完成 UKM 学生认证后，会获得可信学生标识。')}
          </p>
          <form onSubmit={submit} className="auth-form">
            <label className="field">
              <span>{t('怎么称呼你')}</span>
              <span className="field__control">
                <GraduationCap size={17} strokeWidth={1.9} />
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={t('例如：林知夏')}
                  autoComplete="name"
                />
              </span>
            </label>
            <label className="field">
              <span>{t('邮箱')}</span>
              <span className="field__control">
                <Mail size={17} strokeWidth={1.9} />
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  type="email"
                  autoComplete="email"
                />
              </span>
            </label>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="button button--blue button--full">
              {t('进入 BullU')} <ArrowRight size={16} strokeWidth={2} />
            </button>
          </form>
          <button
            className="auth-modal__demo"
            onClick={() => finish(t('林知夏'), 'a198765@siswa.ukm.edu.my', true)}
          >
            <span>
              <Sparkles size={14} strokeWidth={2} /> {t('使用演示学生身份')}
            </span>
            <span>
              {t('林知夏')} <Check size={13} strokeWidth={2.5} />
            </span>
          </button>
          <p className="auth-modal__fine">
            <LockKeyhole size={12} strokeWidth={2} />
            {t('演示版本，信息只保存在本机浏览器中。')}
          </p>
        </div>
      </div>
    </Modal>
  )
}
