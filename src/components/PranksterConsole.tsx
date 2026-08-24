import { useEffect, useRef, useState } from 'react'
import { useI18n } from '@/lib/i18n.tsx'

type Assigned = {
  victimId: string
  prompt: string
  history: unknown[]
  model: string
}

export default function PranksterConsole() {
  const { lang } = useI18n()
  const isZh = lang === 'zh'
  const [nick, setNick] = useState(() => {
    try {
      return localStorage.getItem('openapi_prank_nick') || ''
    } catch {
      return ''
    }
  })
  const [connected, setConnected] = useState(false)
  const [assigned, setAssigned] = useState<Assigned | null>(null)
  const [input, setInput] = useState('')
  const [log, setLog] = useState<string[]>([])
  const wsRef = useRef<WebSocket | null>(null)
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    if (nick)
      try {
        localStorage.setItem('openapi_prank_nick', nick)
      } catch {
        /* ignore */
      }
  }, [nick])

  const connect = () => {
    if (!nick.trim()) {
      alert(isZh ? '请先填写昵称' : 'Please enter nickname')
      return
    }
    // For dev, use ws://localhost:8787
    const wsUrl =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? `ws://127.0.0.1:8787/ws/prankster?nickname=${encodeURIComponent(nick)}`
        : `wss://api.openapi.day/ws/prankster?nickname=${encodeURIComponent(nick)}`

    setStatus('connecting')
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      setConnected(true)
      setStatus('waiting')
      setLog((l) => [...l, isZh ? `[系统] 已连接，等待受害者…` : `[System] Connected, waiting for victim…`])
    }
    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data)
        if (data.type === 'victim:assigned') {
          setAssigned({ victimId: data.victimId, prompt: data.prompt, history: data.history || [], model: data.model })
          setLog((l) => [
            ...l,
            isZh ? `[系统] 新受害者: ${data.prompt.slice(0, 40)}` : `[System] New victim: ${data.prompt.slice(0, 40)}`,
          ])
          setStatus('assigned')
        } else if (data.type === 'prankster:connected') {
          setLog((l) => [...l, isZh ? `[系统] 欢迎 ${data.nickname}` : `[System] Welcome ${data.nickname}`])
        }
      } catch {
        /* ignore */
      }
    }
    ws.onclose = () => {
      setConnected(false)
      setAssigned(null)
      setStatus('idle')
      setLog((l) => [...l, isZh ? `[系统] 已断开` : `[System] Disconnected`])
    }
    ws.onerror = () => {
      setStatus('error')
      setLog((l) => [
        ...l,
        isZh ? `[错误] 连接失败，请确认 API 已启动 (8787)` : `[Error] Connect failed, check API (8787)`,
      ])
    }
  }

  const disconnect = () => {
    wsRef.current?.close()
    wsRef.current = null
    setConnected(false)
    setAssigned(null)
    setStatus('idle')
  }

  const sendToken = (done = false) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return
    if (!assigned) return
    const content = input
    if (!content.trim() && !done) return
    if (done) {
      wsRef.current.send(JSON.stringify({ type: 'prank:done', content }))
      setLog((l) => [...l, `${nick}: ${content} [DONE]`])
      setAssigned(null)
      setStatus('waiting')
      setInput('')
    } else {
      // For demo, send each char as token with small delay to simulate 1 tok/s
      // But for manual, we send the whole input as one token
      wsRef.current.send(JSON.stringify({ type: 'prank:token', content }))
      setLog((l) => [...l, `${nick}: ${content}`])
      // Also send typing
      wsRef.current.send(JSON.stringify({ type: 'prank:typing' }))
    }
  }

  const sendCharByChar = async () => {
    if (!wsRef.current || !assigned) return
    const text = input
    if (!text.trim()) return
    setInput('')
    for (const ch of text) {
      wsRef.current.send(JSON.stringify({ type: 'prank:token', content: ch }))
      setLog((l) => [...l.slice(-50), `${nick}: ${ch}`])
      await new Promise((r) => setTimeout(r, 900)) // 1 token/s
    }
    // Don't auto done, let user click Done
  }

  return (
    <section className="mx-auto max-w-[960px] px-4 py-8 sm:px-6">
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 dark:border-amber-500/20">
        <h2 className="font-display text-lg font-bold">
          😈 Prankster Console{' '}
          <span className="rounded bg-amber-500 px-1.5 py-0.5 text-xs font-bold text-white">HIDDEN</span>
        </h2>
        <p className="mt-1 text-xs text-amber-800 dark:text-amber-200">
          {isZh
            ? '此控制台仅内部可见，用于接收受害者的 OpenAI 请求并手打回复。1 token/s 即是你的打字速度。'
            : 'Internal only: receive victim OpenAI requests and type manually. 1 token/s is your typing speed.'}
        </p>
        <p className="mt-1 text-[11px] text-amber-700/70 dark:text-amber-300/70">
          {isZh
            ? '提示：受害者通过 OpenAI SDK 调用 https://api.openapi/v1/chat/completions，你的每一次输入都会以 SSE 流式推回。'
            : 'Tip: victims call https://api.openapi/v1/chat/completions via OpenAI SDK, each keystroke streams via SSE.'}
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
            <label className="text-xs font-semibold tracking-widest text-zinc-500">{isZh ? '昵称' : 'Nickname'}</label>
            <input
              value={nick}
              onChange={(e) => setNick(e.target.value)}
              placeholder={isZh ? '例如：捣蛋鬼' : 'e.g. prankster'}
              className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5"
              disabled={connected}
            />
            <div className="mt-3 flex gap-2">
              {!connected ? (
                <button
                  onClick={connect}
                  className="flex-1 rounded-xl bg-zinc-900 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
                >
                  {isZh ? '上线接单' : 'Go Online'}
                </button>
              ) : (
                <button
                  onClick={disconnect}
                  className="flex-1 rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400"
                >
                  {isZh ? '下线' : 'Go Offline'}
                </button>
              )}
            </div>
            <div className="mt-2 text-xs text-zinc-500">
              {status === 'idle' && (isZh ? '未连接' : 'Idle')}
              {status === 'connecting' && (isZh ? '连接中…' : 'Connecting…')}
              {status === 'waiting' && `● ${isZh ? '等待受害者' : 'Waiting for victim'}`}
              {status === 'assigned' && `● ${isZh ? '已接单' : 'Assigned'} ${assigned?.victimId.slice(0, 6)}`}
              {status === 'error' && `● Error`}
            </div>
            <div className="mt-3 max-h-[200px] overflow-y-auto rounded-lg bg-zinc-50 p-2.5 font-mono text-xs dark:bg-white/5">
              {log.length === 0 ? (
                <span className="text-zinc-400">{isZh ? '日志为空' : 'No logs'}</span>
              ) : (
                log.map((l, i) => (
                  <div key={i} className="truncate">
                    {l}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="flex min-h-[420px] flex-col rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-900">
            <div className="border-b border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-white/5 dark:bg-white/[0.03]">
              <div className="text-sm font-semibold">{isZh ? '当前会话' : 'Current Session'}</div>
              <div className="text-xs text-zinc-500">
                {assigned ? `${assigned.model} · ${assigned.victimId}` : isZh ? '暂无受害者' : 'No victim yet'}
              </div>
            </div>
            <div className="flex-1 space-y-3 p-4">
              {assigned ? (
                <>
                  <div className="rounded-xl bg-zinc-100 p-3 dark:bg-white/5">
                    <div className="text-xs font-semibold tracking-widest text-zinc-500">
                      {isZh ? '受害者 prompt' : 'Victim prompt'}
                    </div>
                    <div className="mt-1 whitespace-pre-wrap text-sm">{assigned.prompt}</div>
                    {assigned.history.length > 1 && (
                      <details className="mt-2 text-xs text-zinc-500">
                        <summary className="cursor-pointer">history ({assigned.history.length})</summary>
                        <pre className="mt-1 whitespace-pre-wrap break-words font-mono text-xs">
                          {JSON.stringify(assigned.history, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                  <div className="rounded-xl border border-dashed border-zinc-200 p-3 text-xs text-zinc-500 dark:border-white/10">
                    {isZh
                      ? '在下方输入，每敲一次或点发送，都会以 SSE 推给受害者，形成 1 token/s。'
                      : 'Type below, each send pushes via SSE to victim at 1 token/s.'}
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-8 text-center text-sm text-zinc-500 dark:border-white/10 dark:bg-white/5">
                  {connected
                    ? isZh
                      ? '等待受害者请求… 可开另一个终端 curl 测试'
                      : 'Waiting for victim… try curl in another terminal'
                    : isZh
                      ? '请先上线'
                      : 'Please go online first'}
                  <br />
                  <code className="mt-2 block rounded bg-white px-2 py-1 font-mono text-xs dark:bg-zinc-800">
                    curl http://127.0.0.1:8787/v1/chat/completions -H "Authorization: Bearer sk-..."
                  </code>
                </div>
              )}
            </div>
            <div className="border-t border-zinc-100 p-3 dark:border-white/5">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendToken(false)
                      setInput('')
                    }
                  }}
                  placeholder={isZh ? '输入回复… 回车发送一个 token' : 'Type reply… Enter to send token'}
                  disabled={!assigned}
                  className="flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm disabled:opacity-50 dark:border-white/10 dark:bg-zinc-800"
                />
                <button
                  onClick={() => sendToken(false)}
                  disabled={!assigned}
                  className="rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900"
                >
                  {isZh ? '发送 token' : 'Send'}
                </button>
                <button
                  onClick={sendCharByChar}
                  disabled={!assigned}
                  className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50 dark:border-white/10 dark:bg-white/5"
                >
                  {isZh ? '逐字' : 'Char-by-char'}
                </button>
                <button
                  onClick={() => sendToken(true)}
                  disabled={!assigned}
                  className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isZh ? '完成' : 'Done'}
                </button>
              </div>
              <p className="mt-2 text-center text-[11px] text-zinc-400">
                {isZh
                  ? '逐字模式会以 1 token/s 自动推流，更像真人'
                  : 'Char-by-char pushes at 1 token/s, more human-like'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
