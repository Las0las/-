# AI Recruitment Dashboard

A modern, feature-rich recruitment dashboard built with React, TypeScript, and Tailwind CSS. This application provides comprehensive candidate management with real-time features, advanced filtering, and an intuitive user interface.

## Features

### Candidate Management
- **Complete CRUD Operations**: Create, read, update, and archive candidates
- **Advanced Search & Filtering**: Real-time search with debouncing and multi-criteria filtering
- **Multiple View Modes**: Toggle between table and kanban board views
- **Candidate Profiles**: Detailed candidate information including:
  - Contact details (email, phone, LinkedIn)
  - Skills and experience
  - Employment preferences (W2, 1099, C2C, flexible)
  - Availability for interviews and start dates
  - Salary expectations
  - Custom notes and summaries
  - Rating system

### Job Submission System
- Submit candidates to open job positions
- Track submission status (pending, accepted, rejected, interview, offer)
- Add cover letters and notes per submission
- View submission history per candidate

### Data Management
- **LocalStorage Persistence**: All data is automatically saved to browser storage
- **Export Functionality**: Export all data as JSON for backup or migration
- **Mock Data Generation**: Automatic generation of sample data for testing
- **Error Handling**: Comprehensive error boundaries and validation

### User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Theme**: Modern dark mode interface
- **Real-time Updates**: Live saving indicators
- **Pagination**: Efficient handling of large candidate lists
- **Archive System**: Archive/restore candidates instead of permanent deletion
- **Form Validation**: Input validation with helpful error messages

## Technology Stack

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe code with comprehensive interfaces
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Vite**: Next-generation frontend tooling for fast development
- **Lucide React**: Beautiful, consistent icon set

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## Project Structure

```
├── src/
│   ├── components/
│   │   └── CandidatesModule.tsx  # Main candidates component
│   ├── App.tsx                    # Root application component
│   ├── main.tsx                   # Application entry point
│   └── index.css                  # Global styles
├── public/                        # Static assets
├── index.html                     # HTML template
├── vite.config.ts                 # Vite configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Project dependencies
```

## Key Components

### CandidatesModule
The main component that orchestrates the entire candidate management system. Features:
- State management for candidates, jobs, and submissions
- Memoized filtering and pagination for performance
- Debounced search functionality
- Error boundary for graceful error handling
- LocalStorage integration for data persistence

### Features Breakdown

#### Table View
- Sortable columns
- Inline actions (view, submit, edit, archive)
- Pagination controls
- Responsive layout

#### Kanban View
- Visual pipeline representation
- Status-based columns
- Drag-and-drop support (planned)
- Quick actions per card

#### Sidebar Panel
- Dynamic content based on action
- Candidate profile view
- Job submission form
- Add/Edit candidate forms
- Form validation

## Data Schema

### Candidate
```typescript
{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  experience: number;
  skills: string[];
  status: 'new' | 'screening' | 'interviewing' | 'offer' | 'hired' | 'rejected' | 'archived';
  rating: number;
  employmentType?: 'w2' | '1099' | 'c2c' | 'flexible';
  salary?: { min: number; max: number; currency: string };
  // ... additional fields
}
```

### Job
```typescript
{
  id: string;
  title: string;
  client: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract';
  status: 'open' | 'closed' | 'paused';
  payRateRange: string;
}
```

### Submission
```typescript
{
  id: string;
  candidateId: string;
  jobId: string;
  submittedAt: string;
  status: 'pending' | 'accepted' | 'rejected' | 'interview' | 'offer';
  notes: string;
}
```

## Performance Optimizations

- **Memoization**: Expensive computations are memoized with `useMemo`
- **Debouncing**: Search input is debounced to reduce re-renders
- **Virtual Scrolling**: Prepared for large datasets (foundation laid)
- **Code Splitting**: Component-based architecture for optimal bundling
- **Lazy Loading**: Components load on demand

## Browser Storage

The application uses `localStorage` to persist data across sessions:
- `aberdeen_candidates`: All candidate data
- `aberdeen_jobs`: Job postings
- `aberdeen_submissions`: Candidate-to-job submissions

## Future Enhancements

- [ ] Real-time collaboration features
- [ ] Backend API integration
- [ ] Advanced analytics dashboard
- [ ] Email integration
- [ ] Calendar integration for interviews
- [ ] Resume parsing with AI
- [ ] Automated candidate matching
- [ ] Custom workflows and stages
- [ ] Team collaboration features
- [ ] Mobile app

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on the GitHub repository.
