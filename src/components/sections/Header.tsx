import { useEffect, useState } from 'react'
import { ArrowRight, BookOpen, Github, Globe, KeyRound } from 'lucide-react'
import { useI18n } from '@/lib/i18n.tsx'
import type { DemoUser } from '@/components/AuthModal.tsx'

export function Header({
  onGetKey,
  onShowChangelog,
  user,
  onSignIn,
  onAccount,
}: {
  onGetKey: () => void
  onShowChangelog: () => void
  user: DemoUser | null
  onSignIn: () => void
  onAccount: () => void
}) {
  const { t, lang, setLang } = useI18n()
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('openapi_theme') as 'light' | 'dark' | null
      if (saved) return saved
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } catch {
      return 'light'
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem('openapi_theme', theme)
    } catch {
      /* ignore */
    }
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:border-white/[0.06] dark:bg-zinc-950/60">
      <div className="mx-auto flex h-[56px] max-w-[1160px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <a href="#" className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
              <span className="font-display text-[15px] font-extrabold tracking-tight">O</span>
            </span>
            <span className="font-display text-[15px] font-bold tracking-tight">openapi</span>
            <span className="hidden rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400 sm:inline-flex">
              FREE
            </span>
          </a>
          <nav className="hidden items-center gap-1 text-sm lg:flex">
            <a
              href="#models"
              className="rounded-md px-3 py-1.5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
            >
              {t('nav.models')}
            </a>
            <a
              href="#pricing"
              className="rounded-md px-3 py-1.5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
            >
              {t('nav.pricing')}
            </a>
            <a
              href="#docs"
              className="rounded-md px-3 py-1.5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
            >
              {t('nav.docs')}
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                onShowChangelog()
              }}
              className="rounded-md px-3 py-1.5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
            >
              {t('nav.changelog')}
            </a>
            <span className="ml-2 hidden items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-400 xl:inline-flex">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" /> {t('nav.status')}
            </span>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-300"
            title={lang === 'zh' ? 'Switch to English' : '切换到中文'}
          >
            <Globe className="size-3.5" />
            {lang === 'zh' ? 'EN' : '中'}
          </button>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="inline-flex size-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-300"
            title="Toggle theme"
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
          <a
            href="https://github.com/openapiday/openapi-day"
            target="_blank"
            rel="noreferrer"
            className="hidden size-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-400 sm:flex"
          >
            <Github className="size-4" />
          </a>
          <a
            href="#docs"
            className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 sm:inline-flex"
          >
            <BookOpen className="size-4" /> {t('nav.docs')}
          </a>
          {user ? (
            <button
              type="button"
              onClick={onAccount}
              className="pressable inline-flex h-8 items-center gap-2 rounded-lg border border-zinc-200 bg-white pl-1.5 pr-2.5 text-xs font-semibold text-zinc-700 transition hover:-translate-y-0.5 hover:bg-zinc-50 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-200 dark:hover:bg-white/10"
              title={user.email}
            >
              <span className="flex size-5 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 text-[10px] font-bold text-white">
                {(user.name || user.email).slice(0, 1).toUpperCase()}
              </span>
              <span className="hidden max-w-24 truncate sm:inline">{user.name}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onSignIn}
              className="pressable hidden h-8 items-center rounded-lg px-2.5 text-sm font-medium text-zinc-600 transition hover:-translate-y-0.5 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-white sm:inline-flex"
            >
              {lang === 'zh' ? '登录' : 'Sign in'}
            </button>
          )}
          <button
            onClick={onGetKey}
            className="pressable inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-lg bg-zinc-900 px-2.5 text-xs font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-md dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 sm:gap-1.5 sm:px-3.5 sm:text-sm"
            title={user ? 'API Key' : t('nav.getKey')}
          >
            <KeyRound className="size-3.5 sm:hidden" />
            <span className="sm:hidden">{user ? 'Key' : lang === 'zh' ? 'Key' : 'Get Key'}</span>
            <span className="hidden sm:inline">{user ? 'API Key' : t('nav.getKey')}</span>
            <ArrowRight className="hidden size-3.5 sm:block" />
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex size-8 items-center justify-center rounded-lg border border-zinc-200 bg-white lg:hidden dark:border-white/10 dark:bg-white/5"
          >
            <span className="text-sm">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="border-t border-zinc-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-zinc-900 lg:hidden">
          <div className="space-y-1">
            <a
              href="#models"
              onClick={(e) => {
                e.preventDefault()
                setMenuOpen(false)
                document.getElementById('models')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="block rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
            >
              {t('nav.models')}
            </a>
            <a
              href="#pricing"
              onClick={(e) => {
                e.preventDefault()
                setMenuOpen(false)
                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="block rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
            >
              {t('nav.pricing')}
            </a>
            <a
              href="#docs"
              onClick={(e) => {
                e.preventDefault()
                setMenuOpen(false)
                document.getElementById('docs')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="block rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
            >
              {t('nav.docs')}
            </a>
            <button
              onClick={() => {
                setMenuOpen(false)
                onShowChangelog()
              }}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
            >
              {t('nav.changelog')}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
