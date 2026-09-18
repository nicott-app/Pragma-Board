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
import * as Sentry from "@sentry/react";

// Configuración de Sentry (Plan Gratuito / Cero Coste)
// Solo se activa si detecta el DSN en las variables de entorno
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    // Para no agotar la capa gratuita de 10k errores/mes o eventos,
    // deshabilitamos el Performance Monitoring (Traces) y Replays,
    // manteniéndolo exclusivamente para Error Tracking crítico.
    tracesSampleRate: 0.0,
    replaysSessionSampleRate: 0.0,
    replaysOnErrorSampleRate: 0.0,
  });
}

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
