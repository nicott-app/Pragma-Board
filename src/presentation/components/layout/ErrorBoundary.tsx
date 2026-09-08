import { LoggerService } from '../../../infrastructure/services/LoggerService';
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    LoggerService.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: 'red', background: '#fee2e2', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h2>Application Error</h2>
          <p><strong>{this.state.error && this.state.error.toString()}</strong></p>
          <pre style={{ background: '#f87171', padding: '1rem', overflow: 'auto', color: 'white' }}>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
          <button 
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer', background: 'red', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Borrar Caché y Recargar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
