import { useEffect, useRef, useState } from 'react'
import { useI18n } from '@/lib/i18n.tsx'
import {
  Send,
  Sparkles,
  Cpu,
  Globe,
  Zap,
  ChevronDown,
  Copy,
  Trash2,
  Download,
  RotateCcw,
  Search,
  Check,
  Share2,
  MessageSquare,
} from 'lucide-react'

type Msg = { id: string; role: 'user' | 'assistant'; text: string; model?: string }

const MODELS = [
  { id: 'openapi-omni', version: 'v2.1', label: 'openapi-omni v2.1', desc: 'Flagship · 1M' },
  { id: 'openapi-thinker', version: 'v2.0', label: 'openapi-thinker v2.0', desc: 'Reasoning' },
  { id: 'openapi-vision', version: 'v1.8', label: 'openapi-vision v1.8', desc: 'Vision' },
  { id: 'openapi-coder', version: 'v1.7', label: 'openapi-coder v1.7', desc: 'Code' },
]

const CANNED: Record<string, string[]> = {
  'openapi-omni': [
    "Hello! I'm openapi-omni v2.1 — your flagship omni-modal model. 1M context, 718B MoE. How can I help today?",
    'Great question. Based on my training on 20T tokens, here is a concise take: keep the interface simple while the model handles complexity.',
    'I handle text, image, video and audio natively. Try pasting an image or asking for a long-document summary — my 1M effective context is ready.',
  ],
  'openapi-thinker': [
    'Thinking step by step — as openapi-thinker v2.0, I excel at AIME 91.3% and GPQA 85%. Let me break this down logically...',
    'Consider the problem from first principles: what are constraints, invariants, and what can be eliminated?',
  ],
  'openapi-vision': [
    "As openapi-vision v1.8, I see the world in 256K multimodal tokens. Describe an image or upload one — I'll ground objects to the pixel.",
  ],
  'openapi-coder': [
    'openapi-coder v1.7 here — SWE-bench 82.4%, LiveCodeBench 90%. Share your repo or snippet and I will think through the code.',
  ],
}

function genId() {
  return Math.random().toString(36).slice(2, 9)
}

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
  return 'https://openapi-api.joydove-ale160.workers.dev'
}

async function streamFromApi(
  model: string,
  messages: { role: string; content: string }[],
  onDelta: (t: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const base = getApiBase()
  const res = await fetch(`${base}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, stream: true }),
    signal,
  })
  if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`)
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let full = ''
  let buf = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buf += decoder.decode(value, { stream: true })
    const lines = buf.split('\n')
    buf = lines.pop() || ''
    for (const line of lines) {
      const t = line.trim()
      if (!t.startsWith('data:')) continue
      const payload = t.slice(5).trim()
      if (payload === '[DONE]') return full
      try {
        const j = JSON.parse(payload)
        const delta = j.choices?.[0]?.delta?.content ?? ''
        if (delta) {
          full += delta
          onDelta(delta)
        }
      } catch {
        /* ignore */
      }
    }
  }
  return full
}

export default function LiveChat({ onToast }: { onToast?: (m: string) => void }) {
  const { lang, t } = useI18n()
  const isZh = lang === 'zh'
  const [model, setModel] = useState(MODELS[0].id)
  const [modelSearch, setModelSearch] = useState('')
  const [msgs, setMsgs] = useState<Msg[]>(() => {
    const m = MODELS[0].id
    return [{ id: genId(), role: 'assistant', text: CANNED[m][0], model: m }]
  })
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [typed, setTyped] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [useRealApi, setUseRealApi] = useState(true)
  const listRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const filteredModels = MODELS.filter((m) => m.label.toLowerCase().includes(modelSearch.toLowerCase()))

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [msgs, typed, streaming])

  useEffect(() => {
    if (msgs.length === 1 && msgs[0].role === 'assistant') {
      const cand = CANNED[model]
      if (cand) setMsgs([{ id: genId(), role: 'assistant', text: cand[0], model }])
    }
  }, [model])

  const copyMsg = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 1500)
      onToast?.(t('docs.copied'))
    } catch {
      /* ignore */
    }
  }

  const clearChat = () => {
    abortRef.current?.abort()
    setStreaming(false)
    setTyped('')
    setMsgs([{ id: genId(), role: 'assistant', text: CANNED[model][0], model }])
    onToast?.(isZh ? '已清空' : 'Cleared')
  }

  const exportChat = () => {
    const data = JSON.stringify(msgs, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const shareChat = async () => {
    const url = `${window.location.origin}${window.location.pathname}#live`
    try {
      await navigator.clipboard.writeText(url)
      onToast?.(t('common.copyLink'))
    } catch {
      /* ignore */
    }
  }

  const mockStream = (text: string, targetModel: string) => {
    return new Promise<void>((resolve) => {
      let i = 0
      const iv = setInterval(() => {
        i += 1
        setTyped(text.slice(0, i))
        if (i >= text.length) {
          clearInterval(iv)
          setMsgs((m) => [...m, { id: genId(), role: 'assistant', text, model: targetModel }])
          setStreaming(false)
          setTyped('')
          resolve()
        }
      }, 22)
    })
  }

  const regenerate = async () => {
    if (msgs.length === 0 || streaming) return
    const lastUser = [...msgs].reverse().find((m) => m.role === 'user')
    if (!lastUser) return
    // remove last assistant
    setMsgs((m) => {
      let idx = -1
      for (let i = m.length - 1; i >= 0; i--)
        if (m[i].role === 'assistant') {
          idx = i
          break
        }
      if (idx === -1) return m
      return m.filter((_, i) => i !== idx)
    })
    // Re-send
    let lastAssistantId: string | undefined
    for (let i = msgs.length - 1; i >= 0; i--)
      if (msgs[i].role === 'assistant') {
        lastAssistantId = msgs[i].id
        break
      }
    const history = msgs.filter((m) => m.role !== 'assistant' || m.id !== lastAssistantId)
    await doSend(lastUser.text, history, true)
  }

  const doSend = async (userText: string, historyOverride?: Msg[], isRegen = false) => {
    const baseHistory = historyOverride ?? msgs
    const apiMessages = [...baseHistory, { id: 'tmp', role: 'user' as const, text: userText, model }]
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role, content: m.text }))

    setStreaming(true)
    setTyped('')

    // Try real API if enabled
    if (useRealApi) {
      const ac = new AbortController()
      abortRef.current = ac
      let acc = ''
      try {
        const full = await streamFromApi(
          model,
          apiMessages,
          (delta) => {
            acc += delta
            setTyped(acc)
          },
          ac.signal,
        )
        setMsgs((m) => [...m, { id: genId(), role: 'assistant', text: full || acc, model }])
        setStreaming(false)
        setTyped('')
        return
      } catch (e) {
        // Fallback to mock on any error
        if ((e as Error).name === 'AbortError') {
          setStreaming(false)
          setTyped('')
          return
        }
        // fall through to mock
        onToast?.(isZh ? 'API 暂不可用，已回退本地演示' : 'API unavailable, fallback to demo')
      }
    }

    // Mock fallback
    const candidates = CANNED[model] || CANNED['openapi-omni']
    const reply = candidates[Math.floor(Math.random() * candidates.length)]
    const final = isRegen
      ? reply
      : userText.length < 20
        ? reply
        : `${isZh ? '收到：' : 'Got it: '}"${userText.slice(0, 60)}" — ${reply}`
    await mockStream(final, model)
  }

  const send = async () => {
    const v = input.trim()
    if (!v || streaming) return
    const userMsg: Msg = { id: genId(), role: 'user', text: v }
    setMsgs((m) => [...m, userMsg])
    setInput('')
    await doSend(v)
  }

  const currentModel = MODELS.find((m) => m.id === model)!

  return (
    <section
      id="live"
      className="scroll-mt-20 border-y border-zinc-200 bg-zinc-50/60 px-4 py-16 dark:border-white/5 dark:bg-white/[0.02] sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-[1160px]">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-3 py-1 text-xs font-medium text-violet-600 dark:text-violet-300">
            <Sparkles className="size-3.5" /> {isZh ? '在线体验 · 无需 Key' : 'Live Demo · No Key Needed'}
          </div>
          <h2 className="font-display mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            {isZh ? '直接开聊，像用本地模型一样' : 'Chat instantly — like a local model'}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {isZh
              ? '选择模型，输入即得。无需注册，无需 API Key，打开即用。'
              : 'Pick a model and start typing. No signup, no API key — just chat.'}
          </p>
          <label className="mt-4 inline-flex cursor-pointer items-center gap-2 text-xs text-zinc-500">
            <input
              type="checkbox"
              checked={useRealApi}
              onChange={(e) => setUseRealApi(e.target.checked)}
              className="rounded"
            />
            {isZh ? '优先使用线上 API（失败回退本地）' : 'Prefer live API (fallback to demo)'}
          </label>
        </div>

        <div className="mx-auto mt-8 grid max-w-[960px] gap-6 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900">
              <label className="flex items-center justify-between text-xs font-semibold tracking-widest text-zinc-500">
                {isZh ? '模型' : 'Model'}
                <button
                  onClick={() => onToast?.(t('common.comingSoon'))}
                  className="rounded px-1.5 py-0.5 text-[10px] font-medium text-violet-600 hover:bg-violet-50 dark:hover:bg-white/5"
                >
                  {filteredModels.length}/{MODELS.length}
                </button>
              </label>
              <div className="relative mt-2">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-zinc-400" />
                <input
                  value={modelSearch}
                  onChange={(e) => setModelSearch(e.target.value)}
                  placeholder={t('common.search')}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-1.5 pl-8 pr-3 text-xs outline-none placeholder:text-zinc-400 focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/20 dark:border-white/10 dark:bg-white/5 dark:focus:bg-zinc-800"
                />
              </div>
              <div className="relative mt-2">
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-zinc-200 bg-white px-3 py-2.5 pr-8 text-sm font-medium outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-white/10 dark:bg-zinc-800"
                >
                  {filteredModels.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label} · {m.desc}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                <button
                  onClick={() => onToast?.(isZh ? '上下文：1M 有效长度' : 'Context: 1M effective')}
                  className="rounded-lg bg-zinc-50 px-2.5 py-2 text-center transition hover:bg-zinc-100 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  <div className="font-mono font-bold text-zinc-900 dark:text-white">
                    {currentModel.id === 'openapi-omni'
                      ? '1M'
                      : currentModel.id === 'openapi-thinker'
                        ? '256K'
                        : '200K'}
                  </div>
                  <div className="text-zinc-500">context</div>
                </button>
                <button
                  onClick={() => onToast?.(isZh ? '速度：约 86 tokens/秒' : 'Speed: ~86 tok/s')}
                  className="rounded-lg bg-zinc-50 px-2.5 py-2 text-center transition hover:bg-zinc-100 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  <div className="font-mono font-bold text-zinc-900 dark:text-white">~86</div>
                  <div className="text-zinc-500">tok/s</div>
                </button>
                <button
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                  className="rounded-lg bg-zinc-50 px-2.5 py-2 text-center transition hover:bg-zinc-100 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  <div className="font-mono font-bold text-violet-600"> $0</div>
                  <div className="text-zinc-500">/1M</div>
                </button>
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-500/5 px-2.5 py-2 text-xs text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />{' '}
                {isZh ? '在线 · 全球加速' : 'Online · Global edge'}
                {useRealApi && (
                  <span className="ml-auto text-[10px] opacity-60">
                    {getApiBase()
                      .replace(/^https?:\/\//, '')
                      .slice(0, 18)}
                    …
                  </span>
                )}
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={clearChat}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white py-1.5 text-xs font-medium hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5"
                >
                  <Trash2 className="size-3.5" /> {t('common.clear')}
                </button>
                <button
                  onClick={exportChat}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white py-1.5 text-xs font-medium hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5"
                >
                  <Download className="size-3.5" /> {t('common.export')}
                </button>
                <button
                  onClick={shareChat}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5"
                >
                  <Share2 className="size-3.5" />
                </button>
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Cpu className="size-4 text-violet-500" /> {isZh ? '自研多模态' : 'Self-developed multimodal'}
              </div>
              <div className="mt-2 space-y-1.5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                <button
                  onClick={() => onToast?.(t('common.comingSoon'))}
                  className="flex w-full gap-2 text-left hover:text-zinc-900 dark:hover:text-white"
                >
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-violet-500" />
                  {isZh
                    ? '文本+图像+视频+音频原生理解，256K 交错输入'
                    : 'Text+image+video+audio native, 256K interleaved'}
                </button>
                <button
                  onClick={() => onToast?.(t('common.comingSoon'))}
                  className="flex w-full gap-2 text-left hover:text-zinc-900 dark:hover:text-white"
                >
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                  {isZh ? '718B MoE，48B 激活，推理成本仅稠密 1/8' : '718B MoE, 48B active, 1/8 cost of dense'}
                </button>
                <button
                  onClick={() => onToast?.(t('common.comingSoon'))}
                  className="flex w-full gap-2 text-left hover:text-zinc-900 dark:hover:text-white"
                >
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-blue-500" />
                  {isZh ? '长上下文 1M（有效 200-400K，RULER 验证）' : 'Long context 1M (200-400K effective, RULER)'}
                </button>
              </div>
            </div>
          </div>

          <div className="flex min-h-[460px] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900 lg:col-span-8">
            <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-white/5 dark:bg-white/[0.03]">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <Globe className="size-4 text-zinc-400" /> {currentModel.label}{' '}
                <span className="rounded bg-white px-1.5 py-0.5 font-mono text-[11px] font-medium ring-1 ring-zinc-200 dark:bg-white/10 dark:ring-white/10">
                  {isZh ? '在线' : 'Live'}
                </span>
              </span>
              <div className="flex items-center gap-1.5">
                <span className="hidden items-center gap-1.5 text-xs text-zinc-500 sm:inline-flex">
                  <Zap className="size-3.5 text-amber-500" /> {isZh ? '流式输出' : 'Streaming'}
                </span>
                <span className="flex items-center gap-1 text-xs text-zinc-400">
                  <MessageSquare className="size-3" /> {msgs.length}
                </span>
              </div>
            </div>
            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {msgs.map((m) => (
                <div key={m.id} className={`group flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${m.role === 'user' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'bg-zinc-100 text-zinc-800 dark:bg-white/10 dark:text-zinc-200'}`}
                  >
                    {m.role === 'assistant' && (
                      <div className="mb-1 flex items-center justify-between text-[11px] font-medium tracking-wide opacity-60">
                        <span>
                          {m.model} · {isZh ? '自研' : 'openapi'}
                        </span>
                        <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
                          <button
                            onClick={() => copyMsg(m.id, m.text)}
                            className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10"
                          >
                            {copiedId === m.id ? (
                              <Check className="size-3 text-emerald-500" />
                            ) : (
                              <Copy className="size-3" />
                            )}
                          </button>
                          <button
                            onClick={() => void regenerate()}
                            className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10"
                          >
                            <RotateCcw className="size-3" />
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap break-words">{m.text}</div>
                  </div>
                </div>
              ))}
              {streaming && (
                <div className="flex justify-start">
                  <div className="max-w-[78%] rounded-2xl bg-zinc-100 px-3.5 py-2.5 text-sm leading-relaxed text-zinc-800 dark:bg-white/10 dark:text-zinc-200">
                    <div className="mb-1 text-[11px] font-medium tracking-wide opacity-60">
                      {model} · {isZh ? '正在输入…' : 'typing…'}
                    </div>
                    <div className="whitespace-pre-wrap break-words">
                      {typed}
                      <span className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-zinc-400" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="border-t border-zinc-100 bg-white p-3 dark:border-white/5 dark:bg-zinc-900">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      void send()
                    }
                  }}
                  placeholder={isZh ? '输入消息…（回车发送）' : 'Type a message… (Enter to send)'}
                  className="flex-1 rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-white/10 dark:bg-zinc-800"
                />
                <button
                  onClick={() => void send()}
                  disabled={streaming}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900"
                >
                  <Send className="size-4" /> {isZh ? '发送' : 'Send'}
                </button>
              </div>
              <p className="mt-2 flex items-center justify-center gap-3 text-center text-[11px] text-zinc-400">
                <button onClick={clearChat} className="hover:text-zinc-600 dark:hover:text-zinc-300">
                  {isZh ? '清空对话' : 'Clear chat'}
                </button>
                <span>·</span>
                <span>{isZh ? '无需 API Key · 打开即聊' : 'No API key needed · Just chat'}</span>
                <span>·</span>
                <button
                  onClick={() => document.getElementById('models')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-zinc-600 dark:hover:text-zinc-300"
                >
                  {isZh ? '查看模型' : 'View models'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
