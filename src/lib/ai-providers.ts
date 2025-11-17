import { AIModel } from '@/types'

export const AI_MODELS: AIModel[] = [
  {
    id: 'claude-sonnet-4',
    name: 'Claude Sonnet 4',
    provider: 'claude',
    description: 'Most intelligent model with best reasoning',
    icon: '🧠',
    color: 'orange',
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'chatgpt',
    description: 'OpenAI\'s most capable model',
    icon: '💬',
    color: 'green',
  },
  {
    id: 'perplexity-sonar',
    name: 'Perplexity Sonar',
    provider: 'perplexity',
    description: 'AI with real-time web search',
    icon: '🔍',
    color: 'blue',
  },
]

export function getModelByProvider(provider: string) {
  return AI_MODELS.find((model) => model.provider === provider)
}

export function getAllProviders() {
  return [...new Set(AI_MODELS.map((model) => model.provider))]
}
