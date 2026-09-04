import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Check,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  RefreshCw,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Terminal,
} from 'lucide-react'
import type { DemoUser } from '@/components/AuthModal.tsx'
import { useI18n } from '@/lib/i18n.tsx'

type KeySettings = {
  name: string
  environment: 'live' | 'test'
  expires: 'never' | '30d' | '90d'
  scopes: string[]
}

const DEFAULT_SETTINGS: KeySettings = {
  name: 'Default project key',
  environment: 'live',
  expires: 'never',
  scopes: ['chat', 'models', 'stream'],
}

const SCOPES = [
  { id: 'chat', label: 'Chat Completions', path: '/v1/chat/completions' },
  { id: 'models', label: 'List Models', path: '/v1/models' },
  { id: 'stream', label: 'Streaming', path: 'SSE responses' },
]

export function ApiKeySection({
  user,
  apiKey,
  copied,
  onCopy,
  onRegenerate,
  onToast,
}: {
  user: DemoUser
  apiKey: string | null
  copied: boolean
  onCopy: () => void
  onRegenerate: () => void
  onToast: (message: string) => void
}) {
  const { lang } = useI18n()
  const isZh = lang === 'zh'
  const [revealed, setRevealed] = useState(false)
  const [settings, setSettings] = useState<KeySettings>(DEFAULT_SETTINGS)
  const [saved, setSaved] = useState(false)
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const storageKey = useMemo(() => `openapi_key_settings:${user.email}`, [user.email])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      setSettings(stored ? ({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) } as KeySettings) : DEFAULT_SETTINGS)
    } catch {
      setSettings(DEFAULT_SETTINGS)
    }
  }, [storageKey])

  useEffect(() => {
    const element = sectionRef.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.16 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const displayKey = !apiKey
    ? 'sk-openapi-generating...'
    : revealed
      ? apiKey
      : `${apiKey.slice(0, 14)}${'•'.repeat(18)}${apiKey.slice(-4)}`

  const updateSetting = <K extends keyof KeySettings>(key: K, value: KeySettings[K]) => {
    setSettings((current) => ({ ...current, [key]: value }))
    setSaved(false)
  }

  const toggleScope = (scope: string) => {
    const next = settings.scopes.includes(scope)
      ? settings.scopes.filter((item) => item !== scope)
      : [...settings.scopes, scope]
    updateSetting('scopes', next)
  }

  const save = () => {
    localStorage.setItem(storageKey, JSON.stringify(settings))
    setSaved(true)
    onToast(isZh ? 'API Key 配置已保存' : 'API key configuration saved')
    window.setTimeout(() => setSaved(false), 1800)
  }

  return (
    <section
      ref={sectionRef}
      id="api-keys"
      className={`console-reveal-root relative scroll-mt-20 overflow-hidden border-y border-zinc-200 bg-zinc-950 px-4 py-16 text-white dark:border-white/5 sm:px-6 sm:py-20 ${
        visible ? 'is-visible' : ''
      }`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(circle at 12% 20%, rgba(124,58,237,0.22), transparent 34%), radial-gradient(circle at 88% 82%, rgba(37,99,235,0.18), transparent 32%)',
        }}
      />
      <div className="relative mx-auto max-w-[1160px]">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-semibold text-violet-200">
              <Terminal className="size-3.5" /> Developer Console
            </div>
            <h2 className="font-display mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {isZh ? '你的 API Key，随时可用。' : 'Your API key, ready to ship.'}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">
              {isZh
                ? '管理默认密钥、访问范围和运行环境。所有设置仅保存在当前浏览器。'
                : 'Manage your default credential, access scopes, and environment. Settings stay in this browser.'}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="active-key-dot size-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            {isZh ? `已登录为 ${user.name}` : `Signed in as ${user.name}`}
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="console-card-left h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] shadow-2xl shadow-black/20 backdrop-blur">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/20">
                    <KeyRound className="size-4" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold">{settings.name || (isZh ? '未命名密钥' : 'Untitled key')}</div>
                    <div className="text-[11px] text-zinc-400">Created today · Never used</div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold tracking-wider text-emerald-300">
                  <span className="size-1.5 rounded-full bg-emerald-400" /> ACTIVE
                </span>
              </div>

              <div className="p-5 sm:p-6">
                <label className="text-[11px] font-semibold tracking-widest text-zinc-400">SECRET KEY</label>
                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-black/30 p-2 pl-4">
                  <code className="min-w-0 flex-1 truncate font-mono text-xs text-emerald-300 sm:text-sm">{displayKey}</code>
                  <button
                    type="button"
                    onClick={() => setRevealed((value) => !value)}
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-white/10 hover:text-white"
                    title={revealed ? (isZh ? '隐藏' : 'Hide') : isZh ? '显示' : 'Reveal'}
                  >
                    {revealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={onCopy}
                    disabled={!apiKey}
                    className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-white px-3.5 text-xs font-bold text-zinc-900 transition hover:bg-zinc-100 disabled:opacity-40"
                  >
                    {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                    {copied ? (isZh ? '已复制' : 'Copied') : isZh ? '复制' : 'Copy'}
                  </button>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
                    <div className="text-[10px] font-semibold tracking-widest text-zinc-500">ENVIRONMENT</div>
                    <div className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold">
                      <span className={`size-2 rounded-full ${settings.environment === 'live' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      {settings.environment === 'live' ? 'Live' : 'Test'}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
                    <div className="text-[10px] font-semibold tracking-widest text-zinc-500">EXPIRES</div>
                    <div className="mt-1.5 text-sm font-semibold">
                      {settings.expires === 'never' ? 'Never' : settings.expires === '30d' ? 'In 30 days' : 'In 90 days'}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
                    <div className="text-[10px] font-semibold tracking-widest text-zinc-500">REQUESTS</div>
                    <div className="mt-1.5 text-sm font-semibold">0 / unlimited</div>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-blue-400/15 bg-blue-400/[0.06] p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-blue-300" />
                    <div>
                      <div className="text-xs font-semibold text-blue-100">{isZh ? '保护你的密钥' : 'Keep your key private'}</div>
                      <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">
                        {isZh
                          ? '不要在浏览器代码或公开仓库中暴露 API Key。请通过服务端环境变量使用。'
                          : 'Never expose API keys in browser code or public repositories. Use server-side environment variables.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="console-card-right rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur sm:p-6">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-violet-300" />
                <h3 className="font-display text-base font-bold">{isZh ? '密钥配置' : 'Key configuration'}</h3>
              </div>

              <label className="mt-5 block">
                <span className="text-[11px] font-semibold tracking-widest text-zinc-400">{isZh ? '密钥名称' : 'KEY NAME'}</span>
                <input
                  value={settings.name}
                  onChange={(event) => updateSetting('name', event.target.value.slice(0, 48))}
                  className="mt-2 h-10 w-full rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/20"
                />
              </label>

              <div className="mt-4">
                <div className="text-[11px] font-semibold tracking-widest text-zinc-400">ENVIRONMENT</div>
                <div className="mt-2 grid grid-cols-2 rounded-xl bg-black/20 p-1">
                  {(['live', 'test'] as const).map((environment) => (
                    <button
                      key={environment}
                      type="button"
                      onClick={() => updateSetting('environment', environment)}
                      className={`pressable rounded-lg py-2 text-xs font-semibold transition ${
                        settings.environment === environment ? 'bg-white text-zinc-900 shadow' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {environment === 'live' ? 'Live' : 'Test'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <div className="text-[11px] font-semibold tracking-widest text-zinc-400">{isZh ? '有效期' : 'EXPIRATION'}</div>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(['never', '30d', '90d'] as const).map((expires) => (
                    <button
                      key={expires}
                      type="button"
                      onClick={() => updateSetting('expires', expires)}
                      className={`pressable rounded-xl border px-2 py-2 text-xs font-semibold transition ${
                        settings.expires === expires
                          ? 'border-violet-400/50 bg-violet-400/15 text-violet-200'
                          : 'border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {expires === 'never' ? (isZh ? '永不过期' : 'Never') : expires === '30d' ? '30 days' : '90 days'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <div className="text-[11px] font-semibold tracking-widest text-zinc-400">{isZh ? '访问权限' : 'SCOPES'}</div>
                <div className="mt-2 space-y-2">
                  {SCOPES.map((scope) => {
                    const enabled = settings.scopes.includes(scope.id)
                    return (
                      <button
                        key={scope.id}
                        type="button"
                        onClick={() => toggleScope(scope.id)}
                        className="pressable flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-left transition hover:border-white/20"
                      >
                        <span
                          className={`flex size-5 shrink-0 items-center justify-center rounded-md transition ${
                            enabled ? 'bg-violet-500 text-white' : 'bg-white/10 text-transparent'
                          }`}
                        >
                          <Check className="size-3.5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-xs font-semibold text-zinc-200">{scope.label}</span>
                          <span className="block truncate font-mono text-[10px] text-zinc-500">{scope.path}</span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={save}
                  className="pressable inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-white text-xs font-bold text-zinc-900 transition hover:-translate-y-0.5 hover:bg-zinc-100"
                >
                  {saved ? <CheckCircle2 className="size-4 text-emerald-600" /> : <Save className="size-4" />}
                  {saved ? (isZh ? '已保存' : 'Saved') : isZh ? '保存配置' : 'Save changes'}
                </button>
                <button
                  type="button"
                  onClick={onRegenerate}
                  className="inline-flex size-10 items-center justify-center rounded-xl border border-white/10 text-zinc-400 transition hover:bg-white/10 hover:text-white"
                  title={isZh ? '重置 Key' : 'Rotate key'}
                >
                  <RefreshCw className="size-4" />
                </button>
              </div>

              <div className="mt-4 flex items-center gap-2 text-[10px] text-zinc-500">
                <LockKeyhole className="size-3" /> AES-256 encrypted at rest · SOC 2 Type II
                <Sparkles className="ml-auto size-3 text-violet-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
