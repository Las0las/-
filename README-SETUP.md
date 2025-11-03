# Aberdeen ATS - Applicant Tracking System

AI-powered recruitment platform with modern features for candidate management, job tracking, and interview scheduling.

## Features

### Candidates Module
- **Full CRUD Operations** - Create, read, update, delete candidates with form validation
- **Table & Kanban Views** - Switch between table view with pagination or kanban board by status
- **Virtual Scrolling** - High performance rendering for large datasets
- **Advanced Search & Filtering** - Real-time search with debouncing, multi-field filtering
- **Profile Management** - Comprehensive candidate profiles with skills, experience, availability
- **Job Submissions** - Submit candidates to open positions with cover letters
- **Archive System** - Soft delete with restore capability
- **Export Functionality** - Export all data to JSON format
- **LocalStorage Persistence** - Automatic data persistence with error recovery
- **Error Boundaries** - Graceful error handling throughout the application
- **Responsive Design** - Mobile-first design with Tailwind CSS

### Candidate Fields
- Personal Information (name, email, phone, location)
- Professional Details (title, experience, skills, LinkedIn)
- Employment Preferences (W2, 1099, C2C, flexible)
- Availability (interview availability, start date)
- Salary Expectations (min/max range)
- Status Tracking (new, screening, interviewing, offer, hired, rejected, archived)
- Rating System (1-5 stars)
- Candidate Summary
- Notes & Documentation
- Job Submissions History

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Full type safety
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **LocalStorage API** - Client-side data persistence

## Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   └── CandidatesModule.tsx  # Main candidates component
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Root component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── index-vite.html        # HTML template for Vite
├── index.html             # Standalone dashboard (legacy)
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS config
└── postcss.config.js      # PostCSS config
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd -
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:3000`
   - The application should open automatically

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

### Type Checking

```bash
# Run TypeScript type checker
npm run type-check
```

### Linting

```bash
# Run ESLint
npm run lint
```

## Usage Guide

### Adding a New Candidate

1. Click the "New Candidate" button in the header
2. Fill in the required fields (marked with *)
   - First Name, Last Name
   - Email (validated format)
   - Current Title
3. Optionally add:
   - Phone number
   - LinkedIn profile URL
   - Location, experience, skills
   - Employment type preference
   - Interview and start availability
   - Salary range
   - Candidate summary
4. Click "Add Candidate" to save

### Viewing Candidate Profile

1. Click on any candidate row in the table view
2. Or click on a candidate card in the kanban view
3. The sidebar will open showing:
   - Full contact information
   - Professional details
   - Skills and ratings
   - Submission history
   - Notes and summary

### Editing a Candidate

1. Open the candidate profile
2. Click "Edit Profile" button
3. Update any fields
4. Click "Update Candidate" to save changes

### Submitting to a Job

1. Open the candidate profile
2. Click "Submit to Job" button
3. Select a job from the dropdown
4. Add cover letter/notes (optional)
5. Click "Submit Candidate"

### Archiving & Deleting

**Archive (Soft Delete):**
- Click the archive icon on any candidate row
- Confirm the action
- Candidate moves to archived view
- Can be restored later

**Restore:**
- Toggle to "View Archived" mode
- Click the restore icon
- Candidate returns to active status

**Permanent Delete:**
- Only available for archived candidates
- Click delete icon in archived view
- Confirm permanent deletion
- This action cannot be undone

### Search & Filter

**Search:**
- Type in the search box
- Searches across: first name, last name, email, title, summary
- Real-time results with 300ms debounce

**Status Filter:**
- Select from dropdown: All, New, Screening, Interviewing, Offer, Hired, Rejected
- Combines with search query

**View Toggle:**
- Switch between Table and Kanban views
- Your preference is maintained during session

### Exporting Data

1. Click the download icon in the footer
2. All data (candidates, jobs, submissions) exports as JSON
3. Includes metadata (export date, version)
4. Filename format: `aberdeen_data_YYYY-MM-DD.json`

## Data Persistence

### LocalStorage

All data is automatically saved to browser LocalStorage:
- **Candidates**: `aberdeen_candidates`
- **Jobs**: `aberdeen_jobs`
- **Submissions**: `aberdeen_submissions`

**Features:**
- Auto-save on changes (500ms debounce)
- Error recovery and validation
- Mock data generated on first load
- Import/Export capability

**Storage Limits:**
- Most browsers: 5-10 MB
- Error handling for quota exceeded

### Data Safety

- Input sanitization (XSS protection)
- Email and phone validation
- Error boundaries for crash recovery
- Graceful degradation

## Performance Optimizations

- **Memoization**: useMemo for expensive computations
- **Virtual Scrolling**: Efficient rendering of large lists
- **Debouncing**: Search input optimization
- **Code Splitting**: Lazy loading with Vite
- **Optimistic Updates**: Immediate UI feedback
- **Component Memoization**: React.memo for pure components

## Browser Support

- Chrome/Edge >= 90
- Firefox >= 88
- Safari >= 14
- Opera >= 76

## Development

### File Naming Conventions

- Components: PascalCase (e.g., `CandidatesModule.tsx`)
- Utilities: camelCase (e.g., `validateEmail.ts`)
- Styles: kebab-case (e.g., `global-styles.css`)
- Types: PascalCase with `.d.ts` or inline

### Code Style

- TypeScript strict mode enabled
- ESLint with React hooks plugin
- Consistent formatting
- Comprehensive type definitions

### Adding New Features

1. Create component in `src/components/`
2. Add types in component or `src/types/`
3. Import and use in `App.tsx`
4. Update documentation

## Troubleshooting

### Build Errors

**TypeScript errors:**
```bash
npm run type-check
```

**Clear build cache:**
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Runtime Errors

**Clear LocalStorage:**
```javascript
// In browser console
localStorage.clear()
location.reload()
```

**Check console:**
- Open DevTools (F12)
- Check Console and Network tabs
- Look for error messages

### Performance Issues

- Check browser DevTools Performance tab
- Reduce number of candidates displayed
- Clear old data from LocalStorage
- Update to latest Chrome/Firefox

## Roadmap

### Upcoming Features

- [ ] Backend API integration (REST/GraphQL)
- [ ] Real-time collaboration (WebSockets)
- [ ] Advanced analytics dashboard
- [ ] Interview scheduling
- [ ] Email integration
- [ ] Document management
- [ ] AI-powered candidate matching
- [ ] Bulk operations
- [ ] Custom fields
- [ ] Reporting & exports (PDF, CSV)

### In Progress

- [x] Full CRUD for candidates
- [x] Table and Kanban views
- [x] Search and filtering
- [x] Archive system
- [x] Data export

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or contributions:
- GitHub Issues: [repository]/issues
- Email: support@aberdeen-ats.com
- Documentation: [repository]/wiki

## Credits

Built with:
- React Team for the amazing framework
- Vite Team for the build tool
- Tailwind Labs for the CSS framework
- Lucide Icons for beautiful icons

---

**Version:** 2.0.0
**Last Updated:** 2025-01-27
**Status:** Active Development
