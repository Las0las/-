export type AIProvider = 'claude' | 'chatgpt' | 'perplexity'

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  provider?: AIProvider
  timestamp: Date
}

export interface ChatSession {
  id: string
  title: string
  provider: AIProvider
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface AIModel {
  id: string
  name: string
  provider: AIProvider
  description: string
  icon: string
  color: string
}
