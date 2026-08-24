import { useEffect, useState } from 'react'
import { useI18n } from '@/lib/i18n.tsx'

function getApiBase(): string {
  try {
    const env = (import.meta as unknown as { env?: Record<string, string> }).env
    if (env?.VITE_API_URL) return env.VITE_API_URL.replace(/\/$/, '')
  } catch {
    /* ignore */
  }
  if (typeof window !== 'undefined') {
    const h = window.location.hostname
    if (h === 'localhost' || h === '127.0.0.1') return 'http://127.0.0.1:8787'
  }
  return 'https://api.openapi.day'
}

export default function DriftBottle() {
  const { lang } = useI18n()
  const isZh = lang === 'zh'
  const [content, setContent] = useState('')
  const [pick, setPick] = useState<{ id: string; content: string } | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const apiBase = getApiBase()

  const throwBottle = async () => {
    const c = content.trim()
    if (!c) return
    setLoading(true)
    setMsg(null)
    try {
      const res = await fetch(`${apiBase}/v1/bottles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: c }),
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(j.error?.message || `HTTP ${res.status}`)
      setMsg(isZh ? `已扔出 #${j.id}` : `Thrown #${j.id}`)
      setContent('')
    } catch (e) {
      const err = e as Error
      setMsg(err.message)
    } finally {
      setLoading(false)
    }
  }

  const pickRandom = async () => {
    setLoading(true)
    setMsg(null)
    try {
      const res = await fetch(`${apiBase}/v1/bottles/random`)
      if (res.status === 204) {
        setPick(null)
        setMsg(isZh ? '海面平静，暂无漂流瓶' : 'Calm sea, no bottles yet')
        return
      }
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error?.message || `HTTP ${res.status}`)
      }
      const j = await res.json()
      setPick({ id: j.id, content: j.content })
    } catch (e) {
      const err = e as Error
      setMsg(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Auto pick on mount if hash is #drift
  useEffect(() => {
    if (window.location.hash === '#drift') pickRandom()
  }, [])

  return (
    <section id="drift" className="mx-auto max-w-[640px] px-4 py-16 sm:px-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <h2 className="font-display text-xl font-bold">🌊 {isZh ? '漂流瓶' : 'Drift Bottle'}</h2>
        <p className="mt-1 text-xs text-zinc-500">
          {isZh ? '扔一个瓶子，或捞一个陌生人的心事。匿名，$0。' : 'Throw one, pick one. Anonymous, $0.'}
        </p>
        <div className="mt-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={isZh ? '写下 1..500 字…' : 'Write 1..500 chars…'}
            rows={3}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-white/10 dark:bg-zinc-800"
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={throwBottle}
              disabled={loading || !content.trim()}
              className="flex-1 rounded-xl bg-zinc-900 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900"
            >
              {isZh ? '扔出去' : 'Throw'}
            </button>
            <button
              onClick={pickRandom}
              disabled={loading}
              className="flex-1 rounded-xl border border-zinc-200 bg-white py-2.5 text-sm font-semibold hover:bg-zinc-50 disabled:opacity-50 dark:border-white/10 dark:bg-white/5"
            >
              {isZh ? '捞一个' : 'Pick random'}
            </button>
          </div>
          {msg && <div className="mt-2 text-xs text-zinc-500">{msg}</div>}
          {pick && (
            <div className="mt-4 rounded-xl bg-zinc-50 p-4 dark:bg-white/5">
              <div className="text-xs font-mono text-zinc-500">#{pick.id}</div>
              <div className="mt-1 whitespace-pre-wrap text-sm">{pick.content}</div>
            </div>
          )}
        </div>
        <p className="mt-4 text-center text-[11px] text-zinc-400">
          {isZh ? '与假 API 共存：/v1/bottles 独立命名空间' : 'Coexists with fake API: /v1/bottles namespace'}
        </p>
      </div>
    </section>
  )
}
