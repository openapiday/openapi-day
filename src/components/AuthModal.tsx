import { useEffect, useState, type FormEvent } from 'react'
import { Check, Copy, KeyRound, LockKeyhole, LogOut, Mail, RefreshCw, ShieldCheck, User, X } from 'lucide-react'
import { useI18n } from '@/lib/i18n.tsx'

export type DemoUser = {
  email: string
  name: string
}

export function AuthModal({
  user,
  apiKey,
  copied,
  onClose,
  onAuthenticate,
  onCopy,
  onRegenerate,
  onLogout,
}: {
  user: DemoUser | null
  apiKey: string | null
  copied: boolean
  onClose: () => void
  onAuthenticate: (user: DemoUser) => void
  onCopy: () => void
  onRegenerate: () => void
  onLogout: () => void
}) {
  const { lang } = useI18n()
  const isZh = lang === 'zh'
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setError('')
    const cleanEmail = email.trim().toLowerCase()
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setError(isZh ? '请输入有效的邮箱地址' : 'Enter a valid email address')
      return
    }
    if (password.length < 6) {
      setError(isZh ? '密码至少需要 6 位' : 'Password must be at least 6 characters')
      return
    }
    setSubmitting(true)
    window.setTimeout(() => {
      const fallbackName = cleanEmail.split('@')[0].replace(/[._-]+/g, ' ')
      onAuthenticate({ email: cleanEmail, name: (tab === 'register' ? name.trim() : '') || fallbackName || 'Developer' })
      setPassword('')
      setSubmitting(false)
    }, 550)
  }

  return (
    <div
      className="auth-backdrop-enter fixed inset-0 z-[80] flex items-center justify-center bg-zinc-950/55 p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={user ? (isZh ? '开发者账户' : 'Developer account') : isZh ? '登录 openapi' : 'Sign in to openapi'}
        className="auth-dialog-enter relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white shadow-[0_32px_100px_-30px_rgba(0,0,0,0.55)] dark:border-white/10 dark:bg-zinc-900"
      >
        <div className="h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500" />
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-5 z-30 inline-flex size-8 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-white/10 dark:hover:text-white"
          aria-label={isZh ? '关闭' : 'Close'}
        >
          <X className="size-4" />
        </button>

        {user ? (
          <div className="auth-content-enter p-6 sm:p-7">
            <div className="flex items-center gap-3 pr-10">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-base font-bold text-white shadow-lg shadow-violet-500/20">
                {(user.name || user.email).slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h2 className="truncate font-display text-lg font-bold text-zinc-900 dark:text-white">{user.name}</h2>
                <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{user.email}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3.5 dark:border-white/10 dark:bg-white/5">
                <div className="text-[10px] font-semibold tracking-widest text-zinc-400">{isZh ? '当前套餐' : 'CURRENT PLAN'}</div>
                <div className="mt-1 font-display text-sm font-bold text-zinc-900 dark:text-white">Free Forever</div>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3.5 dark:border-white/10 dark:bg-white/5">
                <div className="text-[10px] font-semibold tracking-widest text-zinc-400">{isZh ? '本月用量' : 'THIS MONTH'}</div>
                <div className="mt-1 font-mono text-sm font-bold text-emerald-600">0 tokens</div>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  <KeyRound className="size-3.5 text-violet-500" /> {isZh ? '默认 API Key' : 'Default API Key'}
                </label>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-500" /> ACTIVE
                </span>
              </div>
              <div className="mt-2 rounded-2xl border border-zinc-200 bg-zinc-950 p-2 pl-3 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <code className="min-w-0 flex-1 truncate font-mono text-xs text-emerald-300">
                    {apiKey || 'sk-openapi-generating...'}
                  </code>
                  <button
                    type="button"
                    onClick={onCopy}
                    disabled={!apiKey}
                    className="inline-flex h-8 items-center gap-1.5 rounded-xl bg-white/10 px-3 text-xs font-semibold text-white transition hover:bg-white/15 disabled:opacity-40"
                  >
                    {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                    {copied ? (isZh ? '已复制' : 'Copied') : isZh ? '复制' : 'Copy'}
                  </button>
                </div>
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-[11px] text-zinc-400">
                <ShieldCheck className="size-3.5" />
                {isZh ? 'Key 仅在当前浏览器中保存' : 'Key is stored only in this browser'}
              </p>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={onRegenerate}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
              >
                <RefreshCw className="size-4" /> {isZh ? '重置 Key' : 'Rotate key'}
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-500/5"
              >
                <LogOut className="size-4" /> {isZh ? '退出' : 'Sign out'}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-7">
            <div className="pr-10">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                <span className="font-display text-lg font-extrabold">O</span>
              </div>
              <h2 className="font-display mt-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                {tab === 'login' ? (isZh ? '欢迎回来' : 'Welcome back') : isZh ? '创建开发者账户' : 'Create your developer account'}
              </h2>
              <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                {isZh ? '登录后立即获取免费 API Key' : 'Get your free API key immediately after signing in'}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 rounded-xl bg-zinc-100 p-1 dark:bg-white/5">
              {(['login', 'register'] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setTab(item)
                    setError('')
                  }}
                  className={`pressable rounded-lg py-2 text-xs font-semibold transition ${
                    tab === item
                      ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white'
                      : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  {item === 'login' ? (isZh ? '登录' : 'Sign in') : isZh ? '注册' : 'Create account'}
                </button>
              ))}
            </div>

            <form key={tab} className="auth-content-enter mt-5 space-y-3.5" onSubmit={submit}>
              {tab === 'register' && (
                <label className="block">
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{isZh ? '昵称' : 'Display name'}</span>
                  <div className="relative mt-1.5">
                    <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      autoComplete="name"
                      placeholder={isZh ? '你的昵称' : 'Your name'}
                      className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-white/10 dark:bg-white/5"
                    />
                  </div>
                </label>
              )}
              <label className="block">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{isZh ? '邮箱' : 'Email'}</span>
                <div className="relative mt-1.5">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-white/10 dark:bg-white/5"
                  />
                </div>
              </label>
              <label className="block">
                <span className="flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {isZh ? '密码' : 'Password'}
                  {tab === 'login' && <span className="font-normal text-violet-600">{isZh ? '忘记密码？' : 'Forgot password?'}</span>}
                </span>
                <div className="relative mt-1.5">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type="password"
                    autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                    placeholder="••••••••"
                    required
                    className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-white/10 dark:bg-white/5"
                  />
                </div>
              </label>

              {error && <div className="rounded-xl bg-red-500/10 px-3 py-2 text-xs text-red-600 dark:text-red-400">{error}</div>}

              <button
                type="submit"
                disabled={submitting}
                className="pressable mt-1 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 text-sm font-semibold text-white shadow-lg shadow-zinc-900/10 transition hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-xl disabled:cursor-wait disabled:opacity-70 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
              >
                {submitting ? (
                  <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                ) : (
                  <KeyRound className="size-4" />
                )}
                {submitting
                  ? isZh
                    ? '正在验证…'
                    : 'Verifying…'
                  : tab === 'login'
                    ? isZh
                      ? '登录并获取 API Key'
                      : 'Sign in & get API key'
                    : isZh
                      ? '创建账户并获取 Key'
                      : 'Create account & get key'}
              </button>
            </form>

            <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-[11px] text-zinc-400">
              <ShieldCheck className="size-3.5" />
              {isZh ? '密码不会保存或发送，仅用于本次演示验证' : 'Password is never stored or sent; it is used only for this demo'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
