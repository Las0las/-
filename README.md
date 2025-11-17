# Multi-AI Application Shell

A unified chat interface for multiple AI providers: **Anthropic Claude**, **ChatGPT**, and **Perplexity AI**.

## Features

- 🤖 **Multi-AI Support**: Seamlessly switch between Claude, ChatGPT, and Perplexity
- 💬 **Unified Chat Interface**: Beautiful, consistent UI across all AI providers
- 🎨 **Modern Design**: Built with Next.js, Tailwind CSS, and shadcn/ui
- 📱 **Responsive**: Works perfectly on desktop and mobile
- 🔒 **Type-Safe**: Full TypeScript support
- ⚡ **Fast**: Optimized with Next.js 15 and React 18
- 🎯 **Clean Architecture**: Well-organized code structure

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **AI SDKs**:
  - Anthropic SDK
  - OpenAI SDK
  - Perplexity API
- **Backend**: Supabase
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- API keys for:
  - Anthropic Claude
  - OpenAI
  - Perplexity
  - Supabase (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd multi-ai-app-shell
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your API keys:
   ```env
   ANTHROPIC_API_KEY=your_anthropic_key
   OPENAI_API_KEY=your_openai_key
   PERPLEXITY_API_KEY=your_perplexity_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── api/               # API routes
│   │   │   └── chat/         # Chat API endpoint
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── globals.css       # Global styles
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── sidebar.tsx       # App sidebar
│   │   └── chat-interface.tsx # Chat interface
│   ├── lib/                   # Utility functions
│   │   ├── utils.ts          # Helper functions
│   │   ├── supabase.ts       # Supabase client
│   │   └── ai-providers.ts   # AI provider configs
│   └── types/                 # TypeScript types
│       └── index.ts          # Type definitions
├── public/                    # Static assets
├── .env.example              # Environment variables template
├── next.config.js            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Project dependencies
```

## Features in Detail

### Multi-AI Provider Support

The application supports three major AI providers:

1. **Claude (Anthropic)**: Advanced reasoning and analysis
2. **ChatGPT (OpenAI)**: Versatile conversational AI
3. **Perplexity**: AI with real-time web search capabilities

### Chat Interface

- Real-time messaging with streaming support
- Message history
- Provider-specific styling
- Responsive design
- Keyboard shortcuts (Enter to send, Shift+Enter for new line)

### API Architecture

The `/api/chat` endpoint handles routing to different AI providers based on the selected provider. Each provider has its own handler function that formats requests and processes responses appropriately.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Build for Production

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Anthropic Claude API key | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `PERPLEXITY_API_KEY` | Perplexity API key | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Optional |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Optional |

## Customization

### Adding a New AI Provider

1. Update `src/types/index.ts` to add the new provider type
2. Add provider configuration in `src/lib/ai-providers.ts`
3. Create handler function in `src/app/api/chat/route.ts`
4. Update UI components to display the new provider

### Styling

The app uses Tailwind CSS with a custom design system. Modify:
- `tailwind.config.ts` for theme customization
- `src/app/globals.css` for global styles
- Component files for component-specific styles

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues and questions, please open an issue on GitHub.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Anthropic](https://anthropic.com/)
- [OpenAI](https://openai.com/)
- [Perplexity](https://perplexity.ai/)
- [Supabase](https://supabase.com/)
- [Vercel](https://vercel.com/)
