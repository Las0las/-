# CLAUDE.md - AI Assistant Guide for AA-Staffing AIA

## Repository Overview

**Repository Name**: - (dash)
**Project Name**: AA-Staffing AIA
**Purpose**: AI Recruitment Dashboard - A real-time recruitment management system with AI-powered insights
**Type**: Single-Page Application (SPA)
**Last Updated**: 2025-11-17

### Description
This repository contains an advanced AI recruitment dashboard that provides real-time candidate tracking, AI-powered screening, and recruitment pipeline management. The application features a modern, responsive UI with drag-and-drop kanban boards, live activity feeds, and comprehensive analytics.

---

## Codebase Structure

```
/
├── .git/                    # Git repository metadata
│   └── hooks/              # Standard git hooks (samples only)
├── index.html              # Main application file (self-contained SPA)
└── README.md               # Project documentation
```

### Architecture Pattern
**Monolithic SPA**: The entire application is contained within a single HTML file that includes:
- Embedded CSS (lines 7-636)
- HTML structure (lines 638-867)
- JavaScript logic (lines 869-1263)

This architecture choice prioritizes:
- **Simplicity**: Zero build process, no dependencies
- **Portability**: Single file deployment
- **Quick prototyping**: Rapid iteration and testing

---

## Technology Stack

### Frontend
- **HTML5**: Semantic markup with modern structure
- **CSS3**:
  - CSS Grid for layouts
  - CSS Custom Properties (CSS variables) for theming
  - Flexbox for component alignment
  - CSS animations and transitions
  - Responsive design with media queries
- **Vanilla JavaScript (ES6+)**:
  - Async/await for API calls
  - Event-driven architecture
  - DOM manipulation
  - Local state management

### Design System
**Color Palette** (defined in `:root` at lines 14-24):
```css
--primary: #667eea (Purple)
--secondary: #764ba2 (Deep Purple)
--success: #48bb78 (Green)
--danger: #f56565 (Red)
--warning: #ed8936 (Orange)
--info: #4299e1 (Blue)
--dark: #2d3748 (Dark Gray)
--light: #f7fafc (Light Gray)
--border: #e2e8f0 (Border Gray)
```

### Backend Integration (Simulated)
**API Endpoint**: `http://localhost:8000/api/v1`
**Authentication**: Bearer token-based
**Endpoints** (referenced but not implemented):
- `/auth/token` - User authentication
- `/analytics/metrics` - Dashboard metrics
- `/pipeline/status` - Pipeline status
- `/candidates/{id}/stage` - Update candidate stage

---

## Key Features

### 1. Real-Time Dashboard (lines 700-853)
- **Stats Cards**: Total applications, active pipeline, average time to hire, quality score
- **Auto-updating metrics**: Animated number transitions
- **Live status indicator**: System health monitoring

### 2. Kanban Pipeline (lines 782-852)
- **Drag & Drop**: Native HTML5 drag and drop API
- **Stage Management**: Screening → Assessment → Interview → Offer
- **Real-time Updates**: Stage transitions trigger API calls and UI updates

### 3. Activity Feed (lines 771-779)
- **Live Updates**: New activities added every 5 seconds
- **Auto-scrolling**: Limited to 10 most recent items
- **Animation**: Slide-in effect for new items

### 4. AI Insights Panel (lines 744-768)
- **Metrics Display**: Prediction accuracy, processing time, auto-screening stats
- **Visual Design**: Gradient background with glassmorphism

### 5. Search & Filter (lines 703-714)
- **Real-time Search**: Filter candidates by name or role
- **Debounced Input**: Efficient search implementation

---

## Development Workflow

### Working with This Codebase

#### 1. **Local Development**
```bash
# Simply open the file in a browser
open index.html

# Or use a local server
python -m http.server 8080
# Then navigate to http://localhost:8080
```

#### 2. **Making Changes**
Since this is a monolithic SPA, all changes are made to `index.html`:

**For CSS Changes**:
- Locate styles between `<style>` tags (lines 7-636)
- Modify existing classes or add new ones
- Use CSS custom properties for theming

**For HTML Changes**:
- Edit structure between `<body>` tags (lines 638-867)
- Maintain semantic HTML structure
- Follow existing naming conventions

**For JavaScript Changes**:
- Modify code in `<script>` tags (lines 869-1263)
- Keep functions organized by feature
- Maintain async/await patterns for API calls

#### 3. **Testing**
```bash
# Manual testing in browser
# Check browser console for errors
# Test responsive design at different breakpoints
# Verify drag-and-drop functionality
# Test search and filter features
```

#### 4. **Git Workflow**
```bash
# Current branch
git branch  # Should show: claude/claude-md-mi3st7v7gfmqp5cf-01Uy6yCdk85GCnHks4V91K4D

# Make changes
git add index.html
git commit -m "Descriptive message"

# Push to branch
git push -u origin claude/claude-md-mi3st7v7gfmqp5cf-01Uy6yCdk85GCnHks4V91K4D
```

---

## Code Conventions

### Naming Conventions

#### CSS Classes
- **BEM-inspired**: `.component-name`, `.component-name__element`, `.component-name--modifier`
- **Semantic names**: Descriptive class names that indicate purpose
- **Examples**: `.kanban-card`, `.activity-feed`, `.stat-card`

#### JavaScript Functions
- **camelCase**: `functionName()`
- **Descriptive**: Function names clearly indicate their purpose
- **Async prefix**: Not used, but all async functions use `async` keyword

#### JavaScript Variables
- **camelCase**: `variableName`
- **Constants**: `UPPER_SNAKE_CASE` for true constants (e.g., `API_BASE_URL`)
- **Descriptive**: Clear, meaningful variable names

### Code Organization

#### CSS Organization (lines 7-636)
1. Reset & Base Styles (lines 8-31)
2. CSS Variables (lines 14-24)
3. Sidebar Components (lines 42-99)
4. Main Content (lines 100-117)
5. Feature-Specific Styles (organized by feature)
6. Responsive Styles (lines 619-635)

#### JavaScript Organization (lines 869-1263)
1. Configuration (lines 870-875)
2. Initialization (lines 877-894)
3. Authentication (lines 896-920)
4. Data Management (lines 922-991)
5. Real-time Updates (lines 993-1078)
6. Drag & Drop (lines 1080-1149)
7. User Interactions (lines 1151-1262)

### Patterns & Best Practices

#### 1. Event Handling
```javascript
// Inline handlers in HTML
<button onclick="functionName()">

// Programmatic listeners
element.addEventListener('event', handler);
```

#### 2. API Calls
```javascript
// Always use try-catch
try {
    const response = await fetch(url, options);
    const data = await response.json();
} catch (error) {
    console.log('Fallback behavior:', error);
}
```

#### 3. DOM Manipulation
```javascript
// Cache DOM queries
const element = document.getElementById('elementId');

// Use template literals for HTML
element.innerHTML = `<div>${variable}</div>`;
```

#### 4. Animation
```javascript
// Programmatic animations
function animateValue(id, end) {
    // Smooth number transitions
    // Uses setInterval for frame-by-frame updates
}
```

---

## AI Assistant Guidelines

### When Working on This Repository

#### ✅ DO:
1. **Preserve the monolithic structure**: Keep everything in `index.html`
2. **Maintain inline styles and scripts**: Don't extract to separate files unless explicitly requested
3. **Follow existing patterns**: Match the coding style and organization
4. **Test in context**: Consider how changes affect the entire page
5. **Use CSS variables**: Leverage the existing design system
6. **Maintain responsiveness**: Ensure changes work on mobile and desktop
7. **Add animations thoughtfully**: Match the existing animation style
8. **Handle errors gracefully**: Always provide fallback behavior
9. **Comment complex logic**: Add inline comments for clarity
10. **Update line references**: When providing guidance, reference line numbers

#### ❌ DON'T:
1. **Don't split the file**: Keep the SPA architecture unless explicitly requested
2. **Don't add dependencies**: No npm, webpack, or external libraries
3. **Don't remove demo data**: Keep fallback data for offline functionality
4. **Don't break existing features**: Ensure backward compatibility
5. **Don't ignore responsive design**: Always test at different breakpoints
6. **Don't remove animations**: Maintain the polished UX
7. **Don't hardcode values**: Use CSS variables for colors and spacing
8. **Don't skip error handling**: Always handle API failures gracefully

### Common Tasks

#### Adding a New Feature
1. **Plan the HTML structure**: Determine where it fits in the layout
2. **Define styles**: Add CSS following the existing pattern
3. **Implement logic**: Add JavaScript functions in appropriate section
4. **Add event handlers**: Wire up user interactions
5. **Test thoroughly**: Verify all interactions work correctly

#### Modifying Existing Features
1. **Locate the feature**: Use browser DevTools or search by class name
2. **Understand the context**: Read related code before making changes
3. **Make minimal changes**: Preserve existing functionality
4. **Test interactions**: Ensure drag-drop, search, etc. still work
5. **Update related sections**: CSS, HTML, and JS may all need updates

#### Adding API Integration
1. **Locate API configuration**: Lines 870-872
2. **Find existing API calls**: Search for `fetch(`
3. **Follow the pattern**: Use async/await with try-catch
4. **Implement fallback**: Provide demo data if API fails
5. **Update auth handling**: Ensure bearer token is included

#### Styling Changes
1. **Check CSS variables**: Use existing theme colors
2. **Maintain consistency**: Match existing component styles
3. **Test responsiveness**: Verify on different screen sizes
4. **Preserve animations**: Keep transition and animation effects
5. **Use semantic classes**: Follow BEM-inspired naming

---

## Feature Implementation Details

### Drag & Drop System (lines 1080-1149)
**How it works**:
1. Cards marked as `draggable="true"`
2. Event listeners: `dragstart`, `dragend`, `dragover`, `drop`
3. Global variable `draggedCard` tracks current drag
4. On drop: Card moves to new column, counts update, API called

**Key Functions**:
- `initializeDragAndDrop()`: Sets up all listeners
- `dragStart()`, `dragEnd()`, `dragOver()`, `dragDrop()`: Handle drag events
- `updateKanbanCounts()`: Updates column badge numbers
- `updateCandidateStage()`: API call to persist changes

### Real-Time Updates (lines 993-1078)
**Simulation Pattern**:
- `setInterval()` every 5 seconds
- Generates random activity
- Updates random metrics
- Adds to activity feed with animation

**For Real WebSocket**:
Replace simulation with:
```javascript
const ws = new WebSocket('ws://localhost:8000/ws');
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    addActivityItem(data);
};
```

### Search Implementation (lines 1151-1166)
**Simple Filter Pattern**:
1. Get search term from input
2. Iterate all kanban cards
3. Show/hide based on name or role match
4. Case-insensitive comparison

### Toast Notifications (lines 1202-1216)
**Pattern**:
1. Update message text
2. Add `show` class (triggers CSS transition)
3. Auto-hide after 3 seconds
4. Manual close button available

---

## State Management

### Current Approach
**No formal state management** - Uses:
- DOM as source of truth
- Global variables for transient state
- Local caching of API responses

### State Variables
```javascript
let authToken = null;          // Authentication token
let wsConnection = null;       // WebSocket connection
let draggedCard = null;        // Currently dragged element
```

### Data Flow
1. **Initialize**: Load data from API (or demo)
2. **Display**: Render to DOM
3. **User Action**: Event triggers function
4. **Update DOM**: Immediate UI feedback
5. **Sync API**: Background API call
6. **Handle Response**: Update UI if needed

---

## Responsive Design

### Breakpoints
**Mobile**: `max-width: 1024px`
- Single column layout
- Hidden sidebar
- Stacked components

### Grid Layouts
**Desktop**:
- Dashboard: `grid-template-columns: 250px 1fr`
- Stats: `repeat(auto-fit, minmax(250px, 1fr))`
- Kanban: `repeat(auto-fit, minmax(280px, 1fr))`

**Mobile**:
- All grids collapse to single column
- Full-width components

---

## Performance Considerations

### Optimizations
1. **CSS-only animations**: Leverage GPU acceleration
2. **Limited activity feed**: Max 10 items prevents DOM bloat
3. **Debounced search**: Could be added for large datasets
4. **Lazy loading**: Not implemented but recommended for images

### Potential Improvements
1. **Virtual scrolling**: For large candidate lists
2. **Web Workers**: For heavy data processing
3. **Service Workers**: For offline functionality
4. **IndexedDB**: For local data persistence

---

## Browser Compatibility

### Target Browsers
- **Modern browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile**: iOS Safari, Chrome Mobile

### Required Features
- CSS Grid
- CSS Custom Properties
- ES6+ JavaScript (async/await, template literals, arrow functions)
- Fetch API
- HTML5 Drag & Drop

### Fallbacks
- No polyfills included
- Graceful degradation for API failures
- Demo data as fallback

---

## Security Considerations

### Current Implementation
⚠️ **Demo/Development Mode**:
- Hardcoded API endpoint
- Demo authentication credentials
- Client-side only validation
- No HTTPS enforcement

### Production Requirements
**Before deploying**:
1. ✅ Remove demo credentials
2. ✅ Implement real authentication
3. ✅ Add HTTPS
4. ✅ Sanitize user input
5. ✅ Add CSRF protection
6. ✅ Implement proper CORS
7. ✅ Add rate limiting
8. ✅ Validate all API responses

---

## Deployment

### Static Hosting
**Simple deployment** - No build process required:

```bash
# Deploy to any static host
# Examples:
# - GitHub Pages
# - Netlify
# - Vercel
# - AWS S3 + CloudFront

# For GitHub Pages:
git push origin main
# Enable GitHub Pages in repository settings
```

### Environment Configuration
**Update API endpoint** for production:
```javascript
// Line 871
const API_BASE_URL = 'https://production-api.example.com/api/v1';
```

### Pre-deployment Checklist
- [ ] Update API_BASE_URL
- [ ] Remove demo credentials
- [ ] Test all features
- [ ] Verify responsive design
- [ ] Check browser console for errors
- [ ] Test API integration
- [ ] Validate accessibility
- [ ] Optimize images (if any added)

---

## Troubleshooting

### Common Issues

#### Issue: Drag & Drop Not Working
**Solution**: Check that:
1. Cards have `draggable="true"` attribute
2. Event listeners are initialized
3. Browser supports HTML5 drag & drop

#### Issue: API Calls Failing
**Solution**:
1. Check browser console for CORS errors
2. Verify API endpoint is running
3. Check authentication token
4. Review fallback to demo data

#### Issue: Animations Not Smooth
**Solution**:
1. Check CSS transitions are defined
2. Verify browser supports CSS animations
3. Check for JavaScript errors blocking execution

#### Issue: Responsive Layout Broken
**Solution**:
1. Verify media queries are intact
2. Check grid-template-columns values
3. Test at breakpoint (1024px)

---

## Future Enhancements

### Recommended Improvements
1. **Separate Concerns**: Extract CSS and JS to separate files
2. **Build Process**: Add bundler (Vite, Webpack) for optimization
3. **Framework Migration**: Consider React/Vue for complex state
4. **TypeScript**: Add type safety
5. **Testing**: Add unit and integration tests
6. **Accessibility**: Improve ARIA labels and keyboard navigation
7. **i18n**: Add internationalization support
8. **PWA**: Make it a Progressive Web App
9. **Dark Mode**: Add theme switcher
10. **Real-time**: Implement actual WebSocket connection

### Backend Requirements
For full functionality, implement:
- RESTful API matching referenced endpoints
- WebSocket server for real-time updates
- Authentication system
- Database for candidate persistence
- File upload for resumes
- Email integration for notifications

---

## Quick Reference

### File Locations
- **All code**: `index.html`
- **CSS**: Lines 7-636
- **HTML**: Lines 638-867
- **JavaScript**: Lines 869-1263

### Key Functions
- `initializeDashboard()`: App initialization (line 885)
- `loadDashboardData()`: Fetch and display data (line 923)
- `updateActivityFeed()`: Populate activity feed (line 1010)
- `initializeDragAndDrop()`: Setup kanban drag-drop (line 1081)
- `searchCandidates()`: Filter candidates (line 1152)
- `showToast()`: Display notification (line 1203)

### Important Variables
- `API_BASE_URL`: Backend endpoint (line 871)
- `authToken`: Authentication token (line 872)
- `draggedCard`: Current drag target (line 1096)

### CSS Classes
- `.dashboard-container`: Main grid (line 33)
- `.kanban-board`: Pipeline board (line 369)
- `.stat-card`: Metric cards (line 213)
- `.activity-feed`: Live feed (line 289)
- `.ai-insights`: AI panel (line 480)

---

## Git Workflow

### Branch Strategy
**Current Development Branch**: `claude/claude-md-mi3st7v7gfmqp5cf-01Uy6yCdk85GCnHks4V91K4D`

### Commit Guidelines
```bash
# Good commit messages:
git commit -m "Add candidate filtering by skill tags"
git commit -m "Fix drag-drop issue on mobile devices"
git commit -m "Update AI insights panel styling"

# Bad commit messages:
git commit -m "changes"
git commit -m "fix bug"
git commit -m "update"
```

### Pull Request Process
1. Ensure all changes are committed
2. Push to feature branch
3. Create PR with clear description
4. Include screenshots for UI changes
5. Reference any related issues

---

## Contact & Support

### Repository Information
- **Owner**: Las0las
- **Repository**: -
- **Type**: Public/Private (check GitHub settings)

### Getting Help
1. Check this CLAUDE.md file
2. Review git history: `git log --oneline`
3. Check browser console for errors
4. Review index.html comments

---

## Changelog

### 2025-11-17 - Current Version
- ✅ AI Recruitment Dashboard with real-time features
- ✅ Kanban pipeline with drag-and-drop
- ✅ Activity feed with animations
- ✅ AI insights panel
- ✅ Search and filter functionality
- ✅ Responsive design
- ✅ Toast notifications
- ✅ Loading states

### 2025-11-17 - Initial Commit
- 🎉 Repository created
- 📄 Basic README.md

---

## License

**License information**: Not specified in repository. Check with repository owner before use.

---

## Notes for AI Assistants

### Context Awareness
- **Single file architecture**: All changes affect one file
- **No dependencies**: Pure vanilla JavaScript, no npm
- **Demo mode**: Many features are simulated, not connected to real backend
- **Responsive first**: Always consider mobile and desktop views

### Best Practices for Changes
1. **Read before writing**: Understand existing code structure
2. **Maintain consistency**: Follow established patterns
3. **Test thoroughly**: Verify all features still work
4. **Document changes**: Add comments for complex logic
5. **Preserve UX**: Keep animations and interactions smooth

### Common Pitfalls to Avoid
1. ❌ Breaking the monolithic structure
2. ❌ Adding external dependencies
3. ❌ Removing error handling
4. ❌ Ignoring responsive design
5. ❌ Hardcoding values instead of using CSS variables
6. ❌ Breaking existing drag-and-drop functionality
7. ❌ Removing demo data fallbacks

---

**Document Version**: 1.0
**Last Updated**: 2025-11-17
**Maintained By**: AI Assistant (Claude)
**Next Review**: When significant changes are made to the codebase
