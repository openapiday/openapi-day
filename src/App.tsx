import { useEffect, useRef, useState } from 'react'
import { cn, generateApiKey, copyToClipboard } from '@/lib/utils'
import { useI18n } from '@/lib/i18n.tsx'
import {
  ArrowRight,
  BookOpen,
  Check,
  Copy,
  ShieldCheck,
  Zap,
  Globe,
  Code2,
  Gauge,
  Layers,
  Sparkles,
  Terminal,
  Cpu,
  Clock3,
  Users,
  ArrowUpRight,
  Github,
  ExternalLink,
  AlertTriangle,
  X,
} from 'lucide-react'
import LiveChat from '@/components/LiveChat.tsx'
import PranksterConsole from '@/components/PranksterConsole.tsx'
import DriftBottle from '@/components/DriftBottle.tsx'
import { Header } from '@/components/sections/Header.tsx'
import { AuthModal, type DemoUser } from '@/components/AuthModal.tsx'
import { ApiKeySection } from '@/components/ApiKeySection.tsx'
import { RAW_MODELS, ACCENT, type RawModel } from '@/lib/models'
function useCountdown(targetHour = 0) {
  const [s, setS] = useState('00:00:00')
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const tgt = new Date(now)
      tgt.setHours(24, 0, 0, 0)
      if (targetHour !== 0) tgt.setHours(targetHour, 0, 0, 0)
      if (tgt <= now) tgt.setDate(tgt.getDate() + 1)
      const diff = Math.max(0, +tgt - +now)
      const h = String(Math.floor(diff / 3600000)).padStart(2, '0')
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0')
      const sec = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0')
      setS(`${h}:${m}:${sec}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetHour])
  return s
}

function Hero({
  apiKey,
  onGenerate,
  copied,
  onCopy,
}: {
  apiKey: string | null
  onGenerate: () => void
  copied: boolean
  onCopy: () => void
}) {
  const { t } = useI18n()
  const countdown = useCountdown(0)
  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-10 sm:px-6 sm:pt-16 lg:pt-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] dark:opacity-[0.12]"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 20% 10%, oklch(0.72 0.18 250 / 0.55) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 85% 12%, oklch(0.65 0.16 200 / 0.45) 0%, transparent 60%), radial-gradient(ellipse 40% 35% at 50% 85%, oklch(0.70 0.12 280 / 0.35) 0%, transparent 70%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_10%,black_30%,transparent_75%)] bg-[size:4rem_4rem] opacity-[0.06]"
      />
      <div className="mx-auto grid max-w-[1160px] grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-6">
        <div className="flex flex-col items-start text-left lg:col-span-6">
          <div
            className="landing-animate-fade-up inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium shadow-sm dark:border-white/10 dark:bg-white/[0.06]"
            style={{ animationDelay: '0ms' }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold tracking-widest text-white">
              {t('hero.badgeNew')}
            </span>
            <span className="text-zinc-600 dark:text-zinc-300">
              {t('hero.dailyFree')}{' '}
              <span className="font-semibold text-zinc-900 dark:text-white">{t('model.thinker.name')} v2.0</span> ·{' '}
              {t('hero.resetsIn')} <span className="font-mono font-semibold tabular-nums">{countdown}</span>
            </span>
            <ArrowUpRight className="size-3 text-zinc-400" />
          </div>
          <h1
            className="landing-animate-fade-up font-display mt-5 text-[clamp(2.1rem,5vw,3.4rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-zinc-900 opacity-0 dark:text-white"
            style={{ animationDelay: '60ms' }}
          >
            {t('hero.title1')}
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent dark:from-blue-400 dark:via-violet-400 dark:to-fuchsia-400">
              {t('hero.title2')}
            </span>
            <br />
            <span className="font-display text-zinc-900 dark:text-white">{t('hero.title3')}</span>
          </h1>
          <p
            className="landing-animate-fade-up mt-4 max-w-[520px] text-[15px] leading-relaxed text-zinc-600 opacity-0 dark:text-zinc-400"
            style={{ animationDelay: '120ms' }}
          >
            {t('hero.desc')}{' '}
            <span className="font-medium text-zinc-900 dark:text-white">{t('hero.openaiCompatible')}</span> ·{' '}
            {t('hero.desc2')}{' '}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-white/10">openai</code> SDK ·{' '}
            <span className="font-medium text-emerald-600 dark:text-emerald-400">{t('hero.price')}</span>{' '}
            {t('hero.desc3')}
          </p>
          <div
            className="landing-animate-fade-up mt-7 flex flex-wrap items-center gap-3 opacity-0"
            style={{ animationDelay: '180ms' }}
          >
            <a
              href="#live"
              className="group inline-flex h-11 items-center gap-2 rounded-xl bg-zinc-900 px-6 text-sm font-semibold text-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.4)] hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              <Sparkles className="size-4" /> {t('hero.tryOnline')}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#docs"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 text-sm font-medium hover:bg-zinc-50 dark:border-white/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.08]"
            >
              <Terminal className="size-4" /> {t('hero.viewDocs')}
            </a>
            <span className="hidden items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 sm:inline-flex">
              <ShieldCheck className="size-3.5 text-emerald-500" /> {t('hero.noCard')}
            </span>
          </div>
          {apiKey ? (
            <div
              className="landing-animate-fade-up mt-5 flex w-full max-w-[560px] items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-2 pl-3 opacity-0 dark:border-emerald-500/20 dark:bg-emerald-500/5"
              style={{ animationDelay: '220ms' }}
            >
              <code className="flex-1 truncate font-mono text-xs font-medium text-emerald-700 dark:text-emerald-300">
                {apiKey}
              </code>
              <button
                onClick={onCopy}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-white px-3 text-xs font-semibold shadow-sm ring-1 ring-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-white dark:ring-white/10"
              >
                {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}{' '}
                {copied ? t('docs.copied') : t('docs.copy')}
              </button>
            </div>
          ) : (
            <div
              className="landing-animate-fade-up mt-5 flex items-center gap-2 text-xs text-zinc-500 opacity-0 dark:text-zinc-400"
              style={{ animationDelay: '220ms' }}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300">
                ● No API Key needed
              </span>
              <span>{t('hero.noCard')}</span>
            </div>
          )}
          <div
            className="landing-animate-fade-up mt-7 flex w-full max-w-[560px] items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 opacity-0 dark:border-white/10 dark:bg-white/[0.04]"
            style={{ animationDelay: '260ms' }}
          >
            <span className="text-[10px] font-bold tracking-widest text-zinc-400">{t('hero.compatible')}</span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium dark:border-white/10 dark:bg-white/[0.06]">
                <img src="https://cdn.simpleicons.org/openai/black" className="size-3.5 dark:invert" alt="" />
                {t('hero.sdk')}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium dark:border-white/10 dark:bg-white/[0.06]">
                Vercel AI
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium dark:border-white/10 dark:bg-white/[0.06]">
                LangChain
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500">
                {t('hero.more')} <ArrowUpRight className="size-3" />
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500" /> {t('hero.online')}
            </span>
            <span className="hidden h-3 w-px bg-zinc-200 dark:bg-white/10 sm:block" />
            <span className="hidden sm:inline-flex">{t('hero.trusted')}</span>
          </div>
        </div>
        <div
          className="landing-animate-fade-up flex w-full justify-center opacity-0 lg:col-span-6 lg:justify-end"
          style={{ animationDelay: '320ms' }}
        >
          <HeroTerminal onGenerate={onGenerate} apiKey={apiKey} />
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-[1160px] rounded-2xl border border-zinc-200 bg-white px-6 py-4 dark:border-white/10 dark:bg-white/[0.04] sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
            <span className="hidden sm:inline">{t('hero.asSeen')}</span>
            <span className="flex items-center gap-3 font-display text-sm font-bold tracking-tight text-zinc-900 dark:text-white">
              <a
                href="https://news.ycombinator.com"
                target="_blank"
                rel="noreferrer"
                className="opacity-60 hover:opacity-100 hover:underline"
              >
                {t('hero.hackerNews')}
              </a>
              <span className="text-zinc-300 dark:text-white/20">·</span>
              <a
                href="https://www.producthunt.com"
                target="_blank"
                rel="noreferrer"
                className="opacity-60 hover:opacity-100 hover:underline"
              >
                {t('hero.productHunt')}
              </a>
              <span className="text-zinc-300 dark:text-white/20">·</span>
              <a
                href="https://github.com/trending"
                target="_blank"
                rel="noreferrer"
                className="opacity-60 hover:opacity-100 hover:underline"
              >
                {t('hero.githubTrending')}
              </a>
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-2.5 py-1 font-medium text-white dark:bg-white dark:text-zinc-900">
              <span className="size-1.5 rounded-full bg-emerald-400" /> {t('hero.rating')}
            </span>
            <span className="hidden text-zinc-500 sm:inline">{t('hero.edge')}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
function HeroTerminal({ onGenerate, apiKey }: { onGenerate: () => void; apiKey: string | null }) {
  const { t } = useI18n()
  const [tab, setTab] = useState(0)
  const tabs = ['Chat', 'Responses', 'Messages', 'Generate'] as const
  const endpoints = ['/v1/chat/completions', '/v1/responses', '/v1/messages', '/v1beta/models/:generateContent']
  const methods = ['POST', 'POST', 'POST', 'POST'] as const
  const demoKey = apiKey ?? 'sk-openapi-••••••••••••••••'
  useEffect(() => {
    const id = setInterval(() => setTab((t) => (t + 1) % tabs.length), 4200)
    return () => clearInterval(id)
  }, [tabs.length])
  return (
    <div className="w-full max-w-[560px]">
      <div className="overflow-hidden rounded-[16px] border border-zinc-200 bg-white shadow-[0_20px_60px_-24px_rgba(0,0,0,0.25)] dark:border-white/10 dark:bg-zinc-900 dark:shadow-[0_20px_60px_-24px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-1 border-b border-zinc-200 px-3 dark:border-white/5">
          <div className="flex gap-1.5 py-3">
            <span className="size-3 rounded-full bg-red-400" />
            <span className="size-3 rounded-full bg-amber-400" />
            <span className="size-3 rounded-full bg-emerald-400" />
          </div>
          <div className="ml-2 flex gap-1">
            {tabs.map((t, i) => (
              <button
                key={t}
                onClick={() => setTab(i)}
                className={cn(
                  'rounded-md px-2.5 py-1.5 text-xs font-medium',
                  i === tab
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                    : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-white/5',
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <span className="ml-auto hidden items-center gap-1.5 pr-1 text-[10px] font-medium tracking-widest text-emerald-600 dark:text-emerald-400 sm:inline-flex">
            <span className="size-1.5 rounded-full bg-emerald-500" /> {t('term.200')}
          </span>
        </div>
        <div className="flex items-center gap-2 border-b border-zinc-100 bg-zinc-50/60 px-4 py-2.5 dark:border-white/[0.04] dark:bg-white/[0.02]">
          <span className="rounded-md bg-emerald-500 px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wider text-white">
            {methods[tab]}
          </span>
          <code className="truncate font-mono text-xs text-zinc-600 dark:text-zinc-300">{endpoints[tab]}</code>
          <span className="ml-auto hidden rounded-full bg-white px-2 py-1 font-mono text-[10px] leading-none text-zinc-500 ring-1 ring-zinc-200 dark:bg-white/10 dark:text-zinc-400 dark:ring-white/10 sm:inline-flex">
            https://api.openapi{endpoints[tab]}
          </span>
        </div>
        <div className="grid gap-0 font-mono text-[12px] leading-5">
          <div className="px-4 py-3">
            <div className="mb-2 text-[11px] font-semibold tracking-widest text-zinc-400">{t('term.request')}</div>
            <div className="space-y-0.5 text-zinc-700 dark:text-zinc-300">
              <div>
                <span className="text-zinc-400">$</span> curl https://api.openapi.day{endpoints[tab]} \
              </div>
              <div className="pl-4">
                <span className="text-zinc-400">-H</span>{' '}
                <span className="text-emerald-600 dark:text-emerald-300">
                  "Authorization: Bearer {demoKey.slice(0, 18)}…"
                </span>{' '}
                \
              </div>
              {tab === 0 && (
                <>
                  <div className="pl-4">
                    <span className="text-zinc-400">-d</span>{' '}
                    <span className="text-sky-600 dark:text-sky-300">&#39;{'{'}</span>
                  </div>
                  <div className="pl-8">
                    <span className="text-violet-600 dark:text-violet-300">"model"</span>:{' '}
                    <span className="text-amber-600 dark:text-amber-300">"{t('model.omni.name')}"</span>,
                  </div>
                  <div className="pl-8">
                    <span className="text-violet-600 dark:text-violet-300">"messages"</span>: [{'{'}{' '}
                    <span className="text-violet-600 dark:text-violet-300">"role"</span>:{' '}
                    <span className="text-amber-600 dark:text-amber-300">"user"</span>,{' '}
                    <span className="text-violet-600 dark:text-violet-300">"content"</span>:{' '}
                    <span className="text-emerald-600 dark:text-emerald-300">"Hello!"</span> {'}'}],
                  </div>
                  <div className="pl-8">
                    <span className="text-violet-600 dark:text-violet-300">"stream"</span>:{' '}
                    <span className="text-sky-600 dark:text-sky-300">true</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-sky-600 dark:text-sky-300">{'}'}&#39;</span>
                  </div>
                </>
              )}
              {tab === 1 && (
                <>
                  <div className="pl-4">
                    <span className="text-zinc-400">-d</span>{' '}
                    <span className="text-sky-600 dark:text-sky-300">&#39;{'{'}</span>
                  </div>
                  <div className="pl-8">
                    <span className="text-violet-600 dark:text-violet-300">"model"</span>:{' '}
                    <span className="text-amber-600 dark:text-amber-300">"{t('model.omni.name')}"</span>,{' '}
                    <span className="text-violet-600 dark:text-violet-300">"input"</span>:{' '}
                    <span className="text-emerald-600 dark:text-emerald-300">"Explain quantum computing"</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-sky-600 dark:text-sky-300">{'}'}&#39;</span>
                  </div>
                </>
              )}
              {tab === 2 && (
                <>
                  <div className="pl-4">
                    <span className="text-zinc-400">-H</span>{' '}
                    <span className="text-emerald-600 dark:text-emerald-300">"x-api-key: {demoKey.slice(0, 18)}…"</span>{' '}
                    \
                  </div>
                  <div className="pl-4">
                    <span className="text-zinc-400">-d</span>{' '}
                    <span className="text-sky-600 dark:text-sky-300">&#39;{'{'}</span>{' '}
                    <span className="text-violet-600 dark:text-violet-300">"model"</span>:{' '}
                    <span className="text-amber-600 dark:text-amber-300">"{t('model.thinker.name')}"</span>{' '}
                    <span className="text-sky-600 dark:text-sky-300">{'}'}&#39;</span>
                  </div>
                </>
              )}
              {tab === 3 && (
                <>
                  <div className="pl-4">
                    <span className="text-zinc-400">-H</span>{' '}
                    <span className="text-emerald-600 dark:text-emerald-300">
                      "x-goog-api-key: {demoKey.slice(0, 12)}…"
                    </span>{' '}
                    \
                  </div>
                  <div className="pl-4">
                    <span className="text-zinc-400">-d</span>{' '}
                    <span className="text-sky-600 dark:text-sky-300">&#39;{'{'}</span>{' '}
                    <span className="text-violet-600 dark:text-violet-300">"contents"</span>: [{'{'}
                    <span className="text-violet-600 dark:text-violet-300">"parts"</span>:{'{'}
                    <span className="text-violet-600 dark:text-violet-300">"text"</span>:{' '}
                    <span className="text-emerald-600 dark:text-emerald-300">"Hi"</span>
                    {'}'}
                    {'}'}] <span className="text-sky-600 dark:text-sky-300">{'}'}&#39;</span>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="border-t border-zinc-100 bg-zinc-50/80 px-4 py-3 dark:border-white/5 dark:bg-white/[0.03]">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-widest text-zinc-400">{t('term.response')}</span>
              <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
                {t('term.streaming')}
              </span>
            </div>
            <div className="space-y-0.5 text-zinc-700 dark:text-zinc-300">
              <div>
                <span className="text-zinc-400">data:</span> {'{'}
                <span className="text-violet-600 dark:text-violet-300">"choices"</span>:[{'{'}
                <span className="text-violet-600 dark:text-violet-300">"delta"</span>:{'{'}
                <span className="text-violet-600 dark:text-violet-300">"content"</span>:{' '}
                <span className="text-emerald-600 dark:text-emerald-300">"Hello"</span>
                {'}'}
                {'}'}]
              </div>
              <div>
                <span className="text-zinc-400">data:</span> {'{'}
                <span className="text-violet-600 dark:text-violet-300">"choices"</span>:[{'{'}
                <span className="text-violet-600 dark:text-violet-300">"delta"</span>:{'{'}
                <span className="text-violet-600 dark:text-violet-300">"content"</span>:{' '}
                <span className="text-emerald-600 dark:text-emerald-300">" there! 👋"</span>
                {'}'}
                {'}'}]
              </div>
              <div className="text-zinc-400">data: [DONE]</div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-zinc-500">
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 ring-1 ring-zinc-200 dark:bg-white/10 dark:ring-white/10">
                <Clock3 className="size-3" /> {t('term.speed')}
              </span>
              <span className="inline-flex items-center gap-1">
                <Cpu className="size-3" /> 27 tokens
              </span>
              <span className="inline-flex items-center gap-1">$0.00</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-4 py-2.5 text-xs dark:border-white/5 dark:bg-white/[0.02]">
          <span className="text-zinc-500">
            {t('term.noChange')}{' '}
            <code className="rounded bg-white px-1 font-mono ring-1 ring-zinc-200 dark:bg-zinc-800 dark:ring-white/10">
              baseURL
            </code>
          </span>
          <button
            onClick={onGenerate}
            className="hidden rounded-full bg-zinc-900 px-3 py-1.5 font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 sm:inline-flex"
          >
            {t('term.try')}
          </button>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-zinc-500 dark:text-zinc-400">
        {t('term.dropin')} <span className="font-medium text-zinc-700 dark:text-zinc-300">OpenAI SDK</span>, Vercel AI
        SDK, LangChain & more
      </p>
    </div>
  )
}
function Stats() {
  const { t } = useI18n()
  return (
    <div className="border-y border-zinc-200 bg-zinc-50/60 dark:border-white/5 dark:bg-white/[0.02]">
      <div className="mx-auto grid max-w-[1160px] grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4 md:gap-8 md:py-10">
        <div className="text-center">
          <div className="font-display text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white md:text-3xl">
            2M
          </div>
          <div className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">max context</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">1M effective · RULER verified</div>
        </div>
        <div className="text-center">
          <div className="font-display text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white md:text-3xl">
            {t('stats.price1')}
          </div>
          <div className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">{t('stats.price2')}</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">{t('stats.price3')}</div>
        </div>
        <div className="text-center">
          <div className="font-display text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white md:text-3xl">
            {t('stats.uptime1')}
          </div>
          <div className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">{t('stats.uptime2')}</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">{t('stats.uptime3')}</div>
        </div>
        <div className="text-center">
          <div className="font-display text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white md:text-3xl">
            {t('stats.devs1')}
          </div>
          <div className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">{t('stats.devs2')}</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">{t('stats.devs3')}</div>
        </div>
      </div>
    </div>
  )
}
function Models() {
  const { t } = useI18n()
  const [selected, setSelected] = useState<RawModel | null>(null)
  return (
    <section id="models" className="mx-auto max-w-[1160px] px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-3 py-1 text-xs font-medium text-violet-600 dark:text-violet-300">
          <Layers className="size-3.5" /> {t('models.badge')}
        </div>
        <h2 className="font-display mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          {t('models.title')}
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
          {t('models.desc')}{' '}
          <span className="font-medium text-emerald-600 dark:text-emerald-400">{t('models.desc2')}</span> — really.
        </p>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {RAW_MODELS.map((m) => (
          <div
            key={m.id}
            onClick={() => setSelected(m)}
            className={cn(
              'group relative cursor-pointer overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md dark:bg-zinc-900',
              ACCENT[m.accent].split(' ')[2],
            )}
            style={{ borderColor: 'hsl(var(--border))' }}
          >
            {m.badge && (
              <span className="absolute right-3 top-3 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">
                {t('models.todayFree')}
              </span>
            )}
            <div
              className={cn(
                'inline-flex rounded-lg border bg-gradient-to-br px-2.5 py-1 text-[11px] font-bold tracking-wide',
                ACCENT[m.accent],
              )}
            >
              {t('provider.openapi')}
            </div>
            <div className="mt-3 flex items-baseline gap-1.5 font-display text-[15px] font-bold tracking-tight text-zinc-900 dark:text-white">
              {t(`model.${m.key}.name`)}
              <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] font-medium text-zinc-500 dark:bg-white/10 dark:text-zinc-400">
                {m.version}
              </span>
            </div>
            <div className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              {t(`model.${m.key}.desc`)}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-white/5">
              <div>
                <div className="text-[11px] font-medium tracking-widest text-zinc-400">{t('models.price')}</div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{m.price}</span>
                  <span className="text-xs text-zinc-400 line-through">{m.officialPrice}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-medium tracking-widest text-zinc-400">{t('models.context')}</div>
                <div className="font-mono text-sm font-medium text-zinc-700 dark:text-zinc-300">{m.context}</div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <span className="size-1.5 rounded-full bg-emerald-500" /> {t('models.available')}
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-zinc-900 px-2 py-1 text-[11px] font-medium text-white opacity-0 transition group-hover:opacity-100 dark:bg-white dark:text-zinc-900">
                {t('models.try')} <ArrowUpRight className="size-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 dark:border-white/10 dark:bg-white/5">
          <Sparkles className="size-3.5 text-violet-500" /> {t('models.more')}
        </span>
        <a
          href="#docs"
          className="inline-flex items-center gap-1 font-medium text-zinc-900 hover:underline dark:text-white"
        >
          {t('models.viewAll')} <ArrowUpRight className="size-3" />
        </a>
      </div>
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-white/10 dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute right-3 top-3 rounded-full bg-zinc-100 p-1.5 hover:bg-zinc-200 dark:bg-white/10"
            >
              <X className="size-4" />
            </button>
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div
                    className={cn(
                      'inline-flex rounded-lg border bg-gradient-to-br px-2.5 py-1 text-[11px] font-bold tracking-wide',
                      ACCENT[selected.accent],
                    )}
                  >
                    {t('provider.openapi')}
                  </div>
                  <h3 className="mt-3 flex items-baseline gap-2 font-display text-xl font-bold">
                    {t(`model.${selected.key}.name`)}
                    <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs font-medium text-zinc-500 dark:bg-white/10">
                      {selected.version}
                    </span>
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{t(`model.${selected.key}.desc`)}</p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-zinc-50 p-3 text-center dark:bg-white/5">
                  <div className="text-[11px] tracking-widest text-zinc-500">CONTEXT</div>
                  <div className="font-mono text-sm font-bold">{selected.context}</div>
                </div>
                <div className="rounded-xl bg-zinc-50 p-3 text-center dark:bg-white/5">
                  <div className="text-[11px] tracking-widest text-zinc-500">PRICE</div>
                  <div className="text-sm font-bold text-emerald-600">{selected.price} / 1M</div>
                </div>
                <div className="rounded-xl bg-zinc-50 p-3 text-center dark:bg-white/5">
                  <div className="text-[11px] tracking-widest text-zinc-500">PARAMS</div>
                  <div className="font-mono text-xs font-bold">
                    {selected.key === 'max'
                      ? '3.2T MoE'
                      : selected.key === 'omni'
                        ? '718B MoE'
                      : selected.key === 'vision'
                        ? '120B'
                        : selected.key === 'flash'
                          ? '32B'
                          : selected.key === 'thinker'
                            ? '405B'
                            : selected.key === 'audio'
                              ? '85B'
                              : selected.key === 'lite'
                                ? '8B'
                                : selected.key === 'coder'
                                  ? '92B'
                                  : '70B'}
                  </div>
                </div>
              </div>
              <div className="mt-6 rounded-xl bg-zinc-950 p-4 font-mono text-xs leading-relaxed text-zinc-200">
                <div className="mb-2 text-[11px] font-semibold tracking-widest text-zinc-400">API EXAMPLE</div>curl
                https://api.openapi.day/v1/chat/completions \<br />
                -H "Authorization: Bearer sk-openapi-..." \<br />
                -d {'{'}&quot;model&quot;: &quot;{t(`model.${selected.key}.name`)}&quot;, &quot;messages&quot;: [{'{'}
                &quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;Hello!&quot;{'}'}]{'}'}&#39;
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    setSelected(null)
                    document.getElementById('live')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="flex-1 rounded-xl bg-zinc-900 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
                >
                  Try in Live Chat
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/5"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}{' '}
    </section>
  )
}
function Benchmarks() {
  const { lang } = useI18n()
  return (
    <section className="border-y border-zinc-200 bg-white px-4 py-16 dark:border-white/5 dark:bg-zinc-950 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-[1160px]">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-300">
            <Gauge className="size-3.5" /> Benchmarks · 2026
          </div>
          <h2 className="font-display mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            {lang === 'zh' ? '自研模型，硬核数据' : 'Proven performance, open numbers'}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {lang === 'zh'
              ? '基于公开评测集，温度 0，5-shot MMLU / 0-shot HumanEval / 3-shot GSM8K。有效上下文经 RULER/MRCR 验证，非标题党。'
              : 'On public eval sets, temp 0. 5-shot MMLU / 0-shot HumanEval / 3-shot GSM8K. Effective context validated via RULER/MRCR, not headline numbers.'}
          </p>
        </div>
        <div className="mt-10 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs font-semibold tracking-widest text-zinc-500 dark:bg-white/[0.04] dark:text-zinc-400">
                <tr>
                  <th className="px-4 py-3">Model</th>
                  <th className="px-4 py-3">MMLU</th>
                  <th className="px-4 py-3">HumanEval</th>
                  <th className="px-4 py-3">MATH</th>
                  <th className="px-4 py-3">GPQA-D</th>
                  <th className="px-4 py-3">SWE-bench</th>
                  <th className="px-4 py-3">Context</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-white/5">
                <tr className="cursor-pointer bg-violet-500/[0.03] hover:bg-violet-500/5">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-violet-600 dark:text-violet-300">
                    openapi-omni
                  </td>
                  <td className="px-4 py-3 font-medium">92.1%</td>
                  <td className="px-4 py-3">91.5%</td>
                  <td className="px-4 py-3">84.7%</td>
                  <td className="px-4 py-3">85.0%</td>
                  <td className="px-4 py-3">82.0%</td>
                  <td className="px-4 py-3 font-mono text-xs">1M → 2M</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-xs font-bold">openapi-thinker</td>
                  <td className="px-4 py-3">90.8%</td>
                  <td className="px-4 py-3">89.2%</td>
                  <td className="px-4 py-3">
                    91.3%
                    <span className="ml-1 rounded bg-amber-500/10 px-1 py-0.5 text-[10px] text-amber-600">AIME</span>
                  </td>
                  <td className="px-4 py-3">84.0%</td>
                  <td className="px-4 py-3">78%</td>
                  <td className="px-4 py-3 font-mono text-xs">256K</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-xs font-bold">openapi-coder</td>
                  <td className="px-4 py-3">88.4%</td>
                  <td className="px-4 py-3 font-bold text-emerald-600">93.2%</td>
                  <td className="px-4 py-3">78%</td>
                  <td className="px-4 py-3">80%</td>
                  <td className="px-4 py-3 font-bold text-emerald-600">82.4%</td>
                  <td className="px-4 py-3 font-mono text-xs">200K</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-xs font-bold">openapi-vision</td>
                  <td className="px-4 py-3">89.5%</td>
                  <td className="px-4 py-3">86%</td>
                  <td className="px-4 py-3">
                    78%
                    <span className="ml-1 rounded bg-blue-500/10 px-1 py-0.5 text-[10px] text-blue-600">MathVista</span>
                  </td>
                  <td className="px-4 py-3">
                    86.2%<span className="ml-1 rounded bg-blue-500/10 px-1 py-0.5 text-[10px] text-blue-600">MMMU</span>
                  </td>
                  <td className="px-4 py-3">76%</td>
                  <td className="px-4 py-3 font-mono text-xs">256K</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 bg-zinc-50 px-4 py-3 text-xs text-zinc-500 dark:border-white/5 dark:bg-white/[0.02] dark:text-zinc-400">
            <span>
              {lang === 'zh'
                ? '评测温度 0，可复现。完整报告与复现脚本见 Docs。'
                : 'Temp 0, reproducible. Full report & scripts in Docs.'}
            </span>
            <span className="hidden sm:inline">
              vs industry avg: <span className="font-mono font-medium text-emerald-600">+12% MMLU</span> ·{' '}
              <span className="font-mono font-medium text-emerald-600">$0</span>
            </span>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              <Cpu className="size-3.5 text-violet-500" /> MoE Efficiency
            </div>
            <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              {lang === 'zh'
                ? '718B 总参，48B 激活。推理成本仅为稠密 1/8，RTX 4090 可跑 32B 1M 上下文。'
                : '718B total, 48B active. 1/8 cost of dense. 32B runs 1M context on RTX 4090.'}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              <Globe className="size-3.5 text-emerald-500" /> Long Context, Real
            </div>
            <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              {lang === 'zh'
                ? '1M 标题，200-400K 有效（RULER）。Needle-in-Haystack 96% @1M，多针 MRCR 84.9% @128K。'
                : '1M headline, 200-400K effective (RULER). NIAH 96% @1M, MRCR 84.9% @128K.'}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              <Layers className="size-3.5 text-blue-500" /> Native Multimodal
            </div>
            <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              {lang === 'zh'
                ? '文本+图像+视频+音频原生多模态，256K 交错输入，视频秒级定位。'
                : 'Text+image+video+audio native. 256K interleaved, second-level video grounding.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
function Pricing({ onShowMethodology }: { onShowMethodology: () => void }) {
  const { t } = useI18n()
  return (
    <section
      id="pricing"
      className="border-y border-zinc-200 bg-zinc-50/60 px-4 py-16 dark:border-white/5 dark:bg-white/[0.02] sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-[1160px]">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold tracking-widest text-white">
              {t('pricing.badge')}
            </div>
            <h2 className="font-display mt-4 text-3xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              {t('pricing.title1')}
              <br />
              {t('pricing.title2')} <span className="text-emerald-600 dark:text-emerald-400">$0.</span>
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">{t('pricing.desc')}</p>
            <div className="mt-6 space-y-3">
              {[t('pricing.li1'), t('pricing.li2'), t('pricing.li3'), t('pricing.li4')].map((tt) => (
                <div key={tt} className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <Check className="size-4 text-emerald-500" /> {tt}
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs leading-relaxed text-amber-800 dark:text-amber-200">
              <span className="font-semibold">{t('pricing.psst')}</span> {t('pricing.psstText')}{' '}
              <span className="font-bold">{t('pricing.forever')}</span>
              {t('pricing.psstText2')}
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
              <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-white/5 dark:bg-white/[0.03]">
                <span className="text-sm font-semibold">{t('pricing.vs')}</span>
                <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white">
                  {t('pricing.save')}
                </span>
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-white/5">
                {[
                  [t('pricing.omni'), '$6.00', '$0.00'],
                  [t('pricing.vision'), '$4.00', '$0.00'],
                  [t('pricing.flash'), '$1.20', '$0.00'],
                  [t('pricing.thinker'), '$5.00', '$0.00'],
                  [t('pricing.coder'), '$4.50', '$0.00'],
                ].map(([name, official, ours]) => (
                  <div
                    key={name}
                    onClick={() => document.getElementById('live')?.scrollIntoView({ behavior: 'smooth' })}
                    className="grid cursor-pointer grid-cols-3 items-center px-5 py-3 text-sm hover:bg-zinc-50 dark:hover:bg-white/5"
                  >
                    <span className="font-medium text-zinc-900 dark:text-white">{name}</span>
                    <span className="text-center font-mono text-zinc-400 line-through">{official} / 1M</span>
                    <span className="text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {ours} / 1M
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between bg-zinc-900 px-5 py-3 text-sm text-white dark:bg-white dark:text-zinc-900">
                <span className="font-medium">{t('pricing.total')}</span>
                <span>
                  <span className="text-zinc-400 line-through dark:text-zinc-500">$208.00</span>{' '}
                  <span className="ml-2 font-bold">$0.00</span>
                </span>
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-zinc-500 dark:text-zinc-400">
              {t('pricing.compare')}{' '}
              <button onClick={onShowMethodology} className="underline hover:text-zinc-900 dark:hover:text-white">
                {t('pricing.method')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
function HowItWorks() {
  const { t } = useI18n()
  return (
    <section className="mx-auto max-w-[1160px] px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold tracking-widest text-zinc-400">{t('how.badge')}</p>
        <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          {t('how.title')}
        </h2>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          { n: '01', title: t('how.s1Title'), desc: t('how.s1Desc'), icon: <Sparkles className="size-5" /> },
          { n: '02', title: t('how.s2Title'), desc: t('how.s2Desc'), icon: <Code2 className="size-5" /> },
          { n: '03', title: t('how.s3Title'), desc: t('how.s3Desc'), icon: <Zap className="size-5" /> },
        ].map((s) => (
          <div
            key={s.n}
            className="relative rounded-2xl border border-zinc-200 bg-white p-6 dark:border-white/10 dark:bg-zinc-900"
          >
            <div className="flex size-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-white">
              {s.icon}
            </div>
            <div className="absolute right-6 top-6 font-display text-sm font-bold tracking-widest text-zinc-300 dark:text-white/20">
              {s.n}
            </div>
            <h3 className="mt-4 font-semibold text-zinc-900 dark:text-white">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
function Docs({ apiKey, onGenerate }: { apiKey: string | null; onGenerate: () => void }) {
  const { t } = useI18n()
  const [lang, setLang] = useState<'curl' | 'python' | 'javascript'>('python')
  const key = apiKey ?? 'sk-openapi-XXXX'
  const snippets = {
    curl: `curl https://api.openapi.day/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${key}" \\
  -d '{
    "model": "openapi-omni",
    "messages": [{"role": "user", "content": "Hello!"}],
    "stream": true
  }'`,
    python: `from openai import OpenAI

client = OpenAI(
  api_key="${key}",
  base_url="https://api.openapi.day/v1",
)

stream = client.chat.completions.create(
  model="openapi-omni",
  messages=[{"role": "user", "content": "Hello!"}],
  stream=True,
)

for chunk in stream:
  print(chunk.choices[0].delta.content, end="", flush=True)`,
    javascript: `import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "${key}",
  baseURL: "https://api.openapi.day/v1",
  dangerouslyAllowBrowser: true,
});

const stream = await client.chat.completions.create({
  model: "openapi-omni",
  messages: [{ role: "user", content: "Hello!" }],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content ?? "");
}`,
  }
  const [copied, setCopied] = useState(false)
  const doCopy = async () => {
    await copyToClipboard(snippets[lang])
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <section
      id="docs"
      className="border-y border-zinc-200 bg-zinc-950 px-4 py-16 text-white dark:border-white/5 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-[1160px] grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300">
            <BookOpen className="size-3.5" /> {t('docs.badge')}
          </div>
          <h2 className="font-display mt-4 text-3xl font-bold tracking-tight">{t('docs.title')}</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            {t('docs.desc')} <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-xs">openai</code>{' '}
            {t('docs.desc2')} <code className="rounded bg-white/10 px-1 font-mono text-xs">baseURL</code>
            {t('docs.desc3')}
          </p>
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex gap-3">
              <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-emerald-400" />
              <span className="text-zinc-300">
                <span className="font-semibold text-white">{t('docs.streamTitle')}</span> {t('docs.streamDesc')}{' '}
                <code className="font-mono text-xs">stream: true</code> {t('docs.streamDesc2')}
              </span>
            </div>
            <div className="flex gap-3">
              <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-blue-400" />
              <span className="text-zinc-300">
                <span className="font-semibold text-white">{t('docs.allModels')}</span> {t('docs.allModelsDesc')}{' '}
                <code className="font-mono text-xs">model</code>
              </span>
            </div>
            <div className="flex gap-3">
              <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-violet-400" />
              <span className="text-zinc-300">
                <span className="font-semibold text-white">{t('docs.works')}</span> {t('docs.worksDesc')}
              </span>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <a
              href="#"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-white px-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-100"
            >
              {t('docs.readDocs')} <ArrowUpRight className="size-3.5" />
            </a>
            <a
              href="#"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-medium hover:bg-white/10"
            >
              {t('docs.playground')} <ExternalLink className="size-3.5" />
            </a>
          </div>
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
            <AlertTriangle className="size-3.5" /> {t('docs.localOnly')}{' '}
            <span className="font-semibold">{t('docs.localOnly2')}</span> {t('docs.localOnly3')}
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
            <div className="flex items-center gap-1 border-b border-white/5 px-2 py-2">
              {(['curl', 'python', 'javascript'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-xs font-medium capitalize',
                    lang === l ? 'bg-white text-zinc-900' : 'text-zinc-400 hover:bg-white/5 hover:text-white',
                  )}
                >
                  {l}
                </button>
              ))}
              <button
                onClick={doCopy}
                className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/10"
              >
                {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}{' '}
                {copied ? t('docs.copied') : t('docs.copy')}
              </button>
            </div>
            <div className="relative">
              <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-6 text-zinc-200">
                <code>{snippets[lang]}</code>
              </pre>
              <button
                onClick={onGenerate}
                className="absolute bottom-3 right-3 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg hover:bg-emerald-600"
              >
                {t('docs.generate')}
              </button>
            </div>
            <div className="flex items-center gap-2 border-t border-white/5 bg-white/[0.03] px-4 py-2.5 text-xs text-zinc-400">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-1 font-medium text-emerald-300 ring-1 ring-emerald-500/20">
                <Gauge className="size-3" /> 142ms p50
              </span>
              <span>·</span>
              <span>OpenAI SDK compatible</span>
              <span className="ml-auto hidden sm:inline">
                {t('docs.baseUrl')} <code className="font-mono text-white">https://api.openapi.day/v1</code>
              </span>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="font-medium text-white">{t('docs.endpoints')}</div>
              <div className="mt-1 font-mono text-zinc-400">
                /v1/chat/completions
                <br />
                /v1/models · /v1/responses
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="font-medium text-white">{t('docs.auth')}</div>
              <div className="mt-1 font-mono text-zinc-400">
                Authorization: Bearer
                <br />
                sk-openapi-...
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="font-medium text-white">{t('docs.models')}</div>
              <div className="mt-1 text-zinc-400">
                {t('docs.see')}{' '}
                <a href="#models" className="underline">
                  {t('docs.modelWall')}
                </a>
                <br />
                {t('docs.decorative')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
function CTA() {
  const { t } = useI18n()
  return (
    <section className="mx-auto max-w-[1160px] px-4 py-12 sm:px-6">
      <div className="relative overflow-hidden rounded-[24px] border border-zinc-200 bg-zinc-900 px-6 py-10 text-white dark:border-white/10 sm:px-10 sm:py-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(600px 300px at 20% 20%, oklch(0.65 0.20 250 / 0.35), transparent 60%), radial-gradient(500px 300px at 85% 30%, oklch(0.70 0.15 280 / 0.30), transparent 60%)',
          }}
        />
        <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{t('cta.title')}</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
              {t('cta.desc')} <span className="font-semibold text-white">{t('cta.role')}</span>
              {t('cta.desc2')}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#live"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-zinc-900 hover:bg-zinc-100"
              >
                {t('cta.getKey')} <ArrowRight className="size-4" />
              </a>
              <a
                href="#docs"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 text-sm font-medium hover:bg-white/10"
              >
                {t('cta.become')}
              </a>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-300">
                <Users className="size-4" /> {t('cta.live')}
              </div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                  <span className="text-zinc-400">{t('cta.queue')}</span>
                  <span className="font-mono font-medium text-white">{t('cta.queueVal')}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                  <span className="text-zinc-400">{t('cta.today')}</span>
                  <span className="font-mono font-medium text-emerald-300">{t('cta.todayVal')}</span>
                </div>
                <div className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs leading-relaxed text-emerald-200 ring-1 ring-emerald-500/20">
                  💡 {t('cta.tip')} <code className="rounded bg-white/10 px-1 font-mono">stream=false</code>{' '}
                  {t('cta.tip2')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
function Footer({ onToast }: { onToast: (msg: string) => void }) {
  const { t } = useI18n()
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-white/5 dark:bg-zinc-950">
      <div className="mx-auto max-w-[1160px] px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex size-7 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                <span className="font-display text-[15px] font-extrabold tracking-tight">O</span>
              </span>
              <span className="font-display text-[15px] font-bold tracking-tight">openapi</span>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-white/10 dark:text-zinc-400">
                © 2026
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{t('footer.desc')}</p>
            <div className="mt-4 flex gap-2">
              <a
                href="#prankster"
                onClick={(e) => {
                  e.preventDefault()
                  onToast('Coming soon')
                }}
                className="inline-flex size-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400"
              >
                <Github className="size-4" />
              </a>
              <a
                href="#prankster"
                onClick={(e) => {
                  e.preventDefault()
                  onToast('Coming soon')
                }}
                className="inline-flex size-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400"
              >
                <Globe className="size-4" />
              </a>
              <a
                href="#prankster"
                onClick={(e) => {
                  e.preventDefault()
                  onToast('Coming soon')
                }}
                className="inline-flex size-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400"
              >
                <span className="text-xs font-bold">𝕏</span>
              </a>
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-zinc-900 dark:text-white">{t('footer.product')}</div>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <a href="#models" className="hover:text-zinc-900 dark:hover:text-white">
                  {t('nav.models')}
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-zinc-900 dark:hover:text-white">
                  {t('nav.pricing')}
                </a>
              </li>
              <li>
                <a href="#docs" className="hover:text-zinc-900 dark:hover:text-white">
                  {t('nav.docs')}
                </a>
              </li>
              <li>
                <a
                  href="#prankster"
                  onClick={(e) => {
                    e.preventDefault()
                    onToast('Coming soon')
                  }}
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  {t('footer.playground')}
                </a>
              </li>
              <li>
                <a
                  href="#prankster"
                  onClick={(e) => {
                    e.preventDefault()
                    onToast('Coming soon')
                  }}
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  {t('footer.status')}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-zinc-900 dark:text-white">{t('footer.developers')}</div>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <a
                  href="#prankster"
                  onClick={(e) => {
                    e.preventDefault()
                    onToast('Coming soon')
                  }}
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  {t('footer.quickstart')}
                </a>
              </li>
              <li>
                <a
                  href="#prankster"
                  onClick={(e) => {
                    e.preventDefault()
                    onToast('Coming soon')
                  }}
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  {t('footer.apiRef')}
                </a>
              </li>
              <li>
                <a
                  href="#prankster"
                  onClick={(e) => {
                    e.preventDefault()
                    onToast('Coming soon')
                  }}
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  {t('footer.sdks')}
                </a>
              </li>
              <li>
                <a
                  href="#prankster"
                  onClick={(e) => {
                    e.preventDefault()
                    onToast('Coming soon')
                  }}
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  {t('nav.changelog')}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    onToast('Coming soon')
                  }}
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  Console
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-zinc-900 dark:text-white">{t('footer.legal')}</div>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <a
                  href="#prankster"
                  onClick={(e) => {
                    e.preventDefault()
                    onToast('Coming soon')
                  }}
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  {t('footer.terms')}
                </a>
              </li>
              <li>
                <a
                  href="#prankster"
                  onClick={(e) => {
                    e.preventDefault()
                    onToast('Coming soon')
                  }}
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  {t('footer.privacy')}
                </a>
              </li>
              <li>
                <a
                  href="#prankster"
                  onClick={(e) => {
                    e.preventDefault()
                    onToast('Coming soon')
                  }}
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  {t('footer.acceptable')}
                </a>
              </li>
              <li>
                <a
                  href="#prankster"
                  onClick={(e) => {
                    e.preventDefault()
                    onToast('Coming soon')
                  }}
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  {t('footer.contact')}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-zinc-200 pt-6 dark:border-white/5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              {t('footer.notAffiliated')}
              <br className="hidden sm:block" />
              <span className="inline-flex items-center gap-1.5 font-medium text-zinc-600 dark:text-zinc-300">
                <span className="size-1.5 rounded-full bg-amber-500" /> {t('footer.entertainment')}
              </span>
            </p>
            <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 py-1 dark:border-white/10 dark:bg-white/5">
                <span className="size-1.5 rounded-full bg-emerald-500" /> {t('footer.api')}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Cpu className="size-3" /> {t('footer.edge')}
              </span>
            </div>
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-500">
            {t('footer.openSource')}{' '}
            <code className="rounded bg-zinc-100 px-1 font-mono text-[11px] dark:bg-white/10">sk-openapi-*</code>
          </p>
        </div>
      </div>
    </footer>
  )
}
export default function App() {
  const { t } = useI18n()
  const [user, setUser] = useState<DemoUser | null>(() => {
    try {
      const saved = localStorage.getItem('openapi_demo_user')
      return saved ? (JSON.parse(saved) as DemoUser) : null
    } catch {
      return null
    }
  })
  const [authOpen, setAuthOpen] = useState(false)
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const toastRef = useRef<number | null>(null)
  const [showChangelog, setShowChangelog] = useState(false)
  const [showMethodology, setShowMethodology] = useState(false)
  useEffect(() => {
    const saved = localStorage.getItem('openapi_key')
    if (saved) setApiKey(saved)
  }, [])
  const showToast = (msg: string) => {
    setToast(msg)
    if (toastRef.current) window.clearTimeout(toastRef.current)
    toastRef.current = window.setTimeout(() => setToast(null), 2400)
  }
  const handleGenerate = () => {
    if (!user) {
      setAuthOpen(true)
      return
    }
    if (!apiKey) {
      const key = generateApiKey()
      setApiKey(key)
      localStorage.setItem('openapi_key', key)
    }
    window.setTimeout(() => document.getElementById('api-keys')?.scrollIntoView({ behavior: 'smooth' }), 0)
  }
  const handleAuthenticate = (nextUser: DemoUser) => {
    setUser(nextUser)
    localStorage.setItem('openapi_demo_user', JSON.stringify(nextUser))
    if (!apiKey) {
      const key = generateApiKey()
      setApiKey(key)
      localStorage.setItem('openapi_key', key)
    }
    showToast(t('docs.generate'))
  }
  const handleRegenerate = () => {
    const key = generateApiKey()
    setApiKey(key)
    localStorage.setItem('openapi_key', key)
    showToast(t('docs.generate'))
  }
  const handleLogout = () => {
    setUser(null)
    setApiKey(null)
    setAuthOpen(false)
    localStorage.removeItem('openapi_demo_user')
    localStorage.removeItem('openapi_key')
    showToast('Signed out')
  }
  const handleCopy = async () => {
    if (!apiKey) return
    await copyToClipboard(apiKey)
    setCopied(true)
    showToast(t('docs.copied'))
    setTimeout(() => setCopied(false), 1500)
  }
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        handleGenerate()
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [apiKey, user])
  const [hash, setHash] = useState(() => (typeof window !== 'undefined' ? window.location.hash : ''))
  useEffect(() => {
    const onHash = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const isPrankster = hash === '#prankster'
  const isDrift = hash === '#drift'
  const authModal = authOpen ? (
    <AuthModal
      user={user}
      apiKey={apiKey}
      copied={copied}
      onClose={() => setAuthOpen(false)}
      onAuthenticate={handleAuthenticate}
      onCopy={() => void handleCopy()}
      onRegenerate={handleRegenerate}
      onLogout={handleLogout}
    />
  ) : null
  if (isPrankster) {
    return (
      <div className="min-h-screen bg-white text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50">
        <Header
          onGetKey={handleGenerate}
          onShowChangelog={() => setShowChangelog(true)}
          user={user}
          onSignIn={() => setAuthOpen(true)}
          onAccount={() => setAuthOpen(true)}
        />
        <PranksterConsole />
        <Footer onToast={showToast} />
        <div className="pointer-events-none fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
          {toast && (
            <div className="toast-pop rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-lg dark:bg-white dark:text-zinc-900">
              {toast}
            </div>
          )}
        </div>
        {authModal}
      </div>
    )
  }
  if (isDrift) {
    return (
      <div className="min-h-screen bg-white text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50">
        <Header
          onGetKey={handleGenerate}
          onShowChangelog={() => setShowChangelog(true)}
          user={user}
          onSignIn={() => setAuthOpen(true)}
          onAccount={() => setAuthOpen(true)}
        />
        <DriftBottle />
        <Footer onToast={showToast} />
        <div className="pointer-events-none fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
          {toast && (
            <div className="toast-pop rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-lg dark:bg-white dark:text-zinc-900">
              {toast}
            </div>
          )}
        </div>
        {authModal}
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-white text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50">
      <div className="sticky top-0 z-40 flex h-7 items-center justify-center gap-2 bg-zinc-900 px-4 text-xs font-medium text-white dark:bg-white dark:text-zinc-900">
        <span className="hidden sm:inline">🎉 {t('top.en')}</span>
        <span className="sm:hidden">{t('top.zh')}</span>
        <a
          href="#pricing"
          className="ml-2 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-zinc-900 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-white"
        >
          {t('top.claim')}
        </a>
      </div>
      <Header
        onGetKey={handleGenerate}
        onShowChangelog={() => setShowChangelog(true)}
        user={user}
        onSignIn={() => setAuthOpen(true)}
        onAccount={() => setAuthOpen(true)}
      />
      <main>
        <Hero apiKey={apiKey} onGenerate={handleGenerate} copied={copied} onCopy={handleCopy} />
        <Stats />
        <LiveChat onToast={showToast} />
        {user && (
          <ApiKeySection
            user={user}
            apiKey={apiKey}
            copied={copied}
            onCopy={() => void handleCopy()}
            onRegenerate={handleRegenerate}
            onToast={showToast}
          />
        )}
        <Models />
        <Benchmarks />
        <Pricing onShowMethodology={() => setShowMethodology(true)} />
        <HowItWorks />
        <Docs apiKey={apiKey} onGenerate={handleGenerate} />
        <CTA />
      </main>
      <Footer onToast={showToast} />
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-4 right-4 z-40 rounded-full bg-zinc-900 p-2.5 text-white shadow-lg hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
      >
        ↑
      </button>
      <div className="pointer-events-none fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
        {toast && (
          <div className="toast-pop rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-lg dark:bg-white dark:text-zinc-900">
            {toast}
          </div>
        )}
      </div>
      {showChangelog && (
        <div
          className="auth-backdrop-enter fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setShowChangelog(false)}
        >
          <div
            className="auth-dialog-enter max-h-[80vh] w-full max-w-lg overflow-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">{t('changelog.title')}</h3>
              <button
                onClick={() => setShowChangelog(false)}
                className="rounded-full bg-zinc-100 p-1.5 dark:bg-white/10"
              >
                ✕
              </button>
            </div>
            <p className="mt-1 text-sm text-zinc-500">{t('changelog.desc')}</p>
            <div className="mt-4 space-y-3 text-sm">
              <div className="rounded-xl border border-zinc-200 p-3 dark:border-white/10">
                <div className="font-semibold">v2.1 — 2026-08-24</div>
                <div className="text-zinc-600 dark:text-zinc-400">openapi-omni 1M→2M context, LiveChat P2P, O logo</div>
              </div>
              <div className="rounded-xl border border-zinc-200 p-3 dark:border-white/10">
                <div className="font-semibold">v2.0 — 2026-08-23</div>
                <div className="text-zinc-600 dark:text-zinc-400">Self-developed models, bilingual, Benchmarks</div>
              </div>
              <div className="rounded-xl border border-zinc-200 p-3 dark:border-white/10">
                <div className="font-semibold">v1.0 — 2026-08-22</div>
                <div className="text-zinc-600 dark:text-zinc-400">Initial landing, Cloudflare deploy</div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showMethodology && (
        <div
          className="auth-backdrop-enter fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setShowMethodology(false)}
        >
          <div
            className="auth-dialog-enter max-h-[80vh] w-full max-w-lg overflow-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Methodology</h3>
              <button
                onClick={() => setShowMethodology(false)}
                className="rounded-full bg-zinc-100 p-1.5 dark:bg-white/10"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 space-y-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              <p>
                Pricing compared 2026-08-24 vs industry average (GPT-4o $5, Claude $3, Gemini $0.10 etc). Our $0 is
                entertainment pricing.
              </p>
              <p>Benchmarks: MMLU 5-shot, HumanEval 0-shot, temp 0, RULER/MRCR for effective context.</p>
              <p className="text-xs text-zinc-400">For entertainment purposes only.</p>
            </div>
          </div>
        </div>
      )}
      {authModal}
    </div>
  )
}
