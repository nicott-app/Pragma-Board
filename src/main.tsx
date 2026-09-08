import { createRoot } from 'react-dom/client';
import './styles/main.css';
import './styles/board.css';
import './styles/ticket.css';
import './styles/daily.css';
import './styles/settings.css';
import './styles/notes.css';
import './styles/metrics.css';
import './styles/utilities.css';
import App from './App.tsx';
import { ErrorBoundary } from './presentation/components/layout/ErrorBoundary.tsx';

import { useAuthStore } from './application/store/useAuthStore';
import { useProjectStore } from './application/store/useProjectStore';

// E2E Testing Backdoor
if (import.meta.env.MODE !== 'production') {
  (window as any).useAuthStore = useAuthStore;
  (window as any).useProjectStore = useProjectStore;
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
