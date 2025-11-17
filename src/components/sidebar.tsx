'use client'

import { AIProvider } from '@/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Brain,
  MessageSquare,
  Search,
  Menu,
  X,
  Plus,
  Settings,
  History,
  Sparkles,
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  selectedProvider: AIProvider
  onProviderChange: (provider: AIProvider) => void
}

const aiProviders = [
  {
    id: 'claude' as AIProvider,
    name: 'Claude',
    icon: Brain,
    description: 'Anthropic Claude Sonnet 4.5',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    id: 'chatgpt' as AIProvider,
    name: 'ChatGPT',
    icon: MessageSquare,
    description: 'OpenAI GPT-4',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    id: 'perplexity' as AIProvider,
    name: 'Perplexity',
    icon: Search,
    description: 'Perplexity AI',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
]

export function Sidebar({
  isOpen,
  onToggle,
  selectedProvider,
  onProviderChange,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-50
          w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">Multi-AI Chat</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <Button className="w-full" size="lg">
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>

        {/* AI Providers */}
        <div className="p-4 space-y-2">
          <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2 mb-3">
            AI Models
          </h2>
          {aiProviders.map((provider) => {
            const Icon = provider.icon
            const isSelected = selectedProvider === provider.id

            return (
              <Card
                key={provider.id}
                className={`
                  p-4 cursor-pointer transition-all hover:shadow-md
                  ${isSelected
                    ? 'border-primary shadow-sm ' + provider.bgColor
                    : 'hover:border-slate-300 dark:hover:border-slate-700'
                  }
                `}
                onClick={() => onProviderChange(provider.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${provider.bgColor}`}>
                    <Icon className={`w-5 h-5 ${provider.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm">{provider.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {provider.description}
                    </p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2 mb-3">
            Recent Chats
          </h2>
          <div className="space-y-1">
            {[1, 2, 3].map((i) => (
              <Button
                key={i}
                variant="ghost"
                className="w-full justify-start text-left font-normal"
              >
                <History className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">Chat session {i}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </aside>

      {/* Mobile menu button */}
      {!isOpen && (
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-40 lg:hidden"
          onClick={onToggle}
        >
          <Menu className="w-5 h-5" />
        </Button>
      )}
    </>
  )
}
