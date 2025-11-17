import { NextRequest, NextResponse } from 'next/server'
import { AIProvider, Message } from '@/types'
import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'

// Initialize AI clients
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function POST(req: NextRequest) {
  try {
    const { messages, provider } = await req.json()

    if (!messages || !provider) {
      return NextResponse.json(
        { error: 'Messages and provider are required' },
        { status: 400 }
      )
    }

    let responseMessage = ''

    switch (provider as AIProvider) {
      case 'claude':
        responseMessage = await handleClaudeRequest(messages)
        break
      case 'chatgpt':
        responseMessage = await handleChatGPTRequest(messages)
        break
      case 'perplexity':
        responseMessage = await handlePerplexityRequest(messages)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid provider' },
          { status: 400 }
        )
    }

    return NextResponse.json({ message: responseMessage })
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleClaudeRequest(messages: Message[]): Promise<string> {
  try {
    const formattedMessages = messages.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }))

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: formattedMessages as any,
    })

    const content = response.content[0]
    return content.type === 'text' ? content.text : 'No response'
  } catch (error) {
    console.error('Claude API error:', error)
    throw error
  }
}

async function handleChatGPTRequest(messages: Message[]): Promise<string> {
  try {
    const formattedMessages = messages.map((msg) => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
    }))

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: formattedMessages,
      max_tokens: 4096,
    })

    return response.choices[0]?.message?.content || 'No response'
  } catch (error) {
    console.error('ChatGPT API error:', error)
    throw error
  }
}

async function handlePerplexityRequest(messages: Message[]): Promise<string> {
  try {
    // Perplexity uses OpenAI-compatible API
    const perplexityClient = new OpenAI({
      apiKey: process.env.PERPLEXITY_API_KEY || '',
      baseURL: 'https://api.perplexity.ai',
    })

    const formattedMessages = messages.map((msg) => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
    }))

    const response = await perplexityClient.chat.completions.create({
      model: 'llama-3.1-sonar-large-128k-online',
      messages: formattedMessages,
    })

    return response.choices[0]?.message?.content || 'No response'
  } catch (error) {
    console.error('Perplexity API error:', error)
    throw error
  }
}
