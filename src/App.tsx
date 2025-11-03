import React from 'react';
import CandidatesModule from './components/CandidatesModule/CandidatesModule.refactored';
import { ErrorBoundary } from './components/ErrorBoundary';

/**
 * Main App component
 */
function App() {
  return (
    <ErrorBoundary>
      <CandidatesModule />
    </ErrorBoundary>
  );
}

export default App;
