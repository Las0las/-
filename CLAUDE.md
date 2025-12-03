# CLAUDE.md - AI Recruitment Dashboard

## Project Overview

This is **AI Recruit Pro**, an AI-powered recruitment dashboard for AA-Staffing AIA. It provides real-time candidate tracking, AI-powered insights, and pipeline management capabilities.

## Tech Stack

- **Frontend**: Single-page HTML application with embedded CSS and vanilla JavaScript
- **Styling**: CSS custom properties (CSS variables) with a purple/blue gradient theme
- **Backend API**: Expected at `http://localhost:8000/api/v1` (REST API)
- **Real-time**: Simulated WebSocket updates (polling-based in demo mode)

## Project Structure

```
/
├── index.html      # Main application (HTML, CSS, JS all-in-one)
├── README.md       # Basic project info
└── CLAUDE.md       # This file
```

## Key Features

1. **Dashboard View** - Real-time metrics and KPIs
2. **Kanban Pipeline** - Drag-and-drop candidate management (Screening → Assessment → Interview → Offer)
3. **AI Insights Panel** - Prediction accuracy, processing time, match quality metrics
4. **Live Activity Feed** - Auto-updating candidate activity stream
5. **Search & Filtering** - Candidate search functionality

## Design System

### CSS Variables (Theme)
- `--primary`: #667eea (purple)
- `--secondary`: #764ba2 (dark purple)
- `--success`: #48bb78 (green)
- `--danger`: #f56565 (red)
- `--warning`: #ed8936 (orange)
- `--info`: #4299e1 (blue)
- `--dark`: #2d3748
- `--light`: #f7fafc
- `--border`: #e2e8f0

### Component Patterns
- Cards use `border-radius: 12px` with subtle shadows
- Buttons follow `.filter-btn` / `.export-btn` patterns
- Icons are emoji-based throughout the UI

## API Endpoints (Expected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/token` | User authentication |
| GET | `/analytics/metrics` | Dashboard metrics |
| GET | `/pipeline/status` | Pipeline overview |
| PUT | `/candidates/{id}/stage` | Update candidate stage |

## Development Notes

### Running Locally
Simply open `index.html` in a browser. The app runs in demo mode when the backend API is unavailable.

### Adding New Views
1. Add a nav item in the sidebar `.nav-menu`
2. Create a view container with `id="viewName"` class `view-content`
3. Update `switchView()` and `loadViewContent()` functions

### Kanban Cards
To add new candidates to the pipeline:
```javascript
const card = document.createElement('div');
card.className = 'kanban-card';
card.draggable = true;
// Add to appropriate column: #screening-cards, #assessment-cards, etc.
```

## Build & Test Commands

This is a static HTML project - no build step required.

```bash
# Serve locally (optional)
python -m http.server 8080

# Or with Node.js
npx serve .
```

## Code Conventions

- Use vanilla JavaScript (no frameworks)
- CSS custom properties for theming
- Emoji icons instead of icon libraries
- Async/await for API calls with try/catch fallbacks
- Demo mode fallbacks for all API-dependent features

## Common Tasks

### Updating Metrics
Edit the `updateMetrics()` function or modify stat card values directly in HTML.

### Styling Changes
All CSS is in the `<style>` block in `index.html`. Follow existing patterns for consistency.

### Adding API Integration
1. Update `API_BASE_URL` constant
2. Add new `fetch` calls following existing patterns
3. Include `authToken` in Authorization header
