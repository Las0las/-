import React from 'react';
import CandidatesModule from './components/CandidatesModule';
import WorkbenchShell from './components/lawrence/WorkbenchShell';

function App() {
  return (
    <WorkbenchShell
      renderWorkspace={(api) => (
        <CandidatesModule onFocus={api.focus} focusedId={api.focusedId} />
      )}
    />
  );
}

export default App;
