'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { ChatInterface } from '@/components/chat-interface'
import { AIProvider } from '@/types'

export default function Home() {
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('claude')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        selectedProvider={selectedProvider}
        onProviderChange={setSelectedProvider}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <ChatInterface
          provider={selectedProvider}
          onProviderChange={setSelectedProvider}
        />
      </main>
    </div>
  )
}
