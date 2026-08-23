# openapi — Open Source API, Every Day

> **One API. Every self-developed multimodal model. Free, forever.**

![CI](https://github.com/openapiday/openapi/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue)

## What is this

`openapi` is an OpenAI-compatible gateway with two parts:

- **Web** — marketing landing + live chat demo. Pick a model, type, watch tokens stream. No signup, no key.
- **API** — serves 8 self-developed multimodal models (`openapi-omni v2.1`, `vision v1.8`, `flash v1.5`, `thinker v2.0`, `audio v0.9`, `lite v1.2`, `coder v1.7`, `creative v0.8`) via `POST /v1/chat/completions` (stream & non-stream) and `GET /v1/models`.

## Features

- **OpenAI SDK compatible** — point `baseURL` at the API, everything else just works
- **Streaming** — SSE with `stream: true`
- **8 models** — up to 1M context, MoE architecture, benchmark scores on the landing
- **Bilingual UI** — English default, 中文 toggle in header
- **Quality gates** — ESLint + Prettier + Husky pre-commit, CI on every PR

## Models

| Model | Version | Context | Highlight |
|-------|---------|---------|-----------|
| openapi-omni | v2.1 | 1M → 2M | Flagship omni-modal, 718B MoE |
| openapi-vision | v1.8 | 256K | Vision specialist, MMMU 86.2% |
| openapi-flash | v1.5 | 1M | Ultra-fast, 180 tok/s |
| openapi-thinker | v2.0 | 256K | Reasoning, AIME 91.3% |
| openapi-audio | v0.9 | 256K | Speech & audio |
| openapi-lite | v1.2 | 32K | 8B edge-ready |
| openapi-coder | v1.7 | 200K | SWE-bench 82.4% |
| openapi-creative | v0.8 | 128K | Design & writing |

## Development

Prerequisites: Node.js 22.

```bash
# web
npm install
npm run dev        # http://localhost:3025
npm run check      # typecheck + lint + build

# api
cd server
npm install
npm run dev        # http://localhost:8787
```

Smoke test the API:

```bash
curl http://127.0.0.1:8787/v1/models

curl -N http://127.0.0.1:8787/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"openapi-omni","messages":[{"role":"user","content":"hi"}],"stream":true}'
```

## Project Structure

```
openapi/
├── .github/workflows/   # CI (lint / typecheck / build)
├── public/              # favicon, _headers, _routes.json
├── src/                 # web landing (React + Tailwind)
│   ├── components/      # LiveChat, PranksterConsole
│   ├── lib/             # i18n, utils
│   └── App.tsx
└── server/              # API worker (Hono)
    └── src/
        ├── index.ts     # routes: /v1/*, /ws/prankster
        └── matcher.ts   # request queue + operator pool
```

## Contributing

Branch from `master`, open a PR. CI must pass; preview deployments are generated automatically for every PR.

## License

MIT
