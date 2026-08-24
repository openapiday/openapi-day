export type RawModel = {
  id: string
  key: string
  context: string
  price: string
  officialPrice: string
  accent: 'violet' | 'blue' | 'emerald' | 'amber' | 'rose' | 'cyan'
  badge?: boolean
  version: string
}
export const RAW_MODELS: RawModel[] = [
  {
    id: 'omni',
    key: 'omni',
    context: '1M',
    price: '$0',
    officialPrice: '$6.00 / 1M',
    accent: 'violet',
    badge: true,
    version: 'v2.1',
  },
  {
    id: 'vision',
    key: 'vision',
    context: '256K',
    price: '$0',
    officialPrice: '$4.00 / 1M',
    accent: 'blue',
    version: 'v1.8',
  },
  {
    id: 'flash',
    key: 'flash',
    context: '1M',
    price: '$0',
    officialPrice: '$1.20 / 1M',
    accent: 'emerald',
    version: 'v1.5',
  },
  {
    id: 'thinker',
    key: 'thinker',
    context: '256K',
    price: '$0',
    officialPrice: '$5.00 / 1M',
    accent: 'amber',
    version: 'v2.0',
  },
  {
    id: 'audio',
    key: 'audio',
    context: '256K',
    price: '$0',
    officialPrice: '$3.50 / 1M',
    accent: 'rose',
    version: 'v0.9',
  },
  {
    id: 'lite',
    key: 'lite',
    context: '32K',
    price: '$0',
    officialPrice: '$0.60 / 1M',
    accent: 'cyan',
    version: 'v1.2',
  },
  {
    id: 'coder',
    key: 'coder',
    context: '200K',
    price: '$0',
    officialPrice: '$4.50 / 1M',
    accent: 'emerald',
    version: 'v1.7',
  },
  {
    id: 'creative',
    key: 'creative',
    context: '128K',
    price: '$0',
    officialPrice: '$3.00 / 1M',
    accent: 'amber',
    version: 'v0.8',
  },
]
export const ACCENT: Record<RawModel['accent'], string> = {
  violet: 'from-violet-500/15 to-purple-500/10 border-violet-500/20 text-violet-600 dark:text-violet-300',
  blue: 'from-blue-500/15 to-sky-500/10 border-blue-500/20 text-blue-600 dark:text-blue-300',
  emerald: 'from-emerald-500/15 to-teal-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-300',
  amber: 'from-amber-500/15 to-orange-500/10 border-amber-500/20 text-amber-600 dark:text-amber-300',
  rose: 'from-rose-500/15 to-pink-500/10 border-rose-500/20 text-rose-600 dark:text-rose-300',
  cyan: 'from-cyan-500/15 to-teal-500/10 border-cyan-500/20 text-cyan-600 dark:text-cyan-300',
}
