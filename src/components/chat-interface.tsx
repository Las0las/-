'use client'

import { useState, useRef, useEffect } from 'react'
import { AIProvider, Message } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Send,
  Loader2,
  User,
  Brain,
  MessageSquare,
  Search,
} from 'lucide-react'

interface ChatInterfaceProps {
  provider: AIProvider
  onProviderChange: (provider: AIProvider) => void
}

const providerConfig = {
  claude: {
    name: 'Claude',
    icon: Brain,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  chatgpt: {
    name: 'ChatGPT',
    icon: MessageSquare,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  perplexity: {
    name: 'Perplexity',
    icon: Search,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
}

export function ChatInterface({ provider }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      provider,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          provider,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        provider,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        provider,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const config = providerConfig[provider]
  const ProviderIcon = config.icon

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${config.bgColor}`}>
              <ProviderIcon className={`w-5 h-5 ${config.color}`} />
            </div>
            <div>
              <h2 className="font-semibold">{config.name}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {messages.length} messages
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className={`p-4 rounded-full ${config.bgColor} mb-4`}>
              <ProviderIcon className={`w-12 h-12 ${config.color}`} />
            </div>
            <h3 className="text-2xl font-bold mb-2">
              Chat with {config.name}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">
              Start a conversation by typing a message below. Ask questions,
              get creative, or explore ideas together.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${
                message.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <Avatar className="flex-shrink-0">
                <AvatarFallback
                  className={
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : config.bgColor
                  }
                >
                  {message.role === 'user' ? (
                    <User className="w-5 h-5" />
                  ) : (
                    <ProviderIcon className={`w-5 h-5 ${config.color}`} />
                  )}
                </AvatarFallback>
              </Avatar>

              <Card
                className={`max-w-[80%] p-4 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : ''
                }`}
              >
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                <p className="text-xs opacity-50 mt-2">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </Card>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex gap-4">
            <Avatar className="flex-shrink-0">
              <AvatarFallback className={config.bgColor}>
                <ProviderIcon className={`w-5 h-5 ${config.color}`} />
              </AvatarFallback>
            </Avatar>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-slate-500">Thinking...</span>
              </div>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${config.name}...`}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}
