import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '40px',
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif',
          backgroundColor: '#fee',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <h1 style={{ color: '#c00' }}>⚠️ Something Went Wrong</h1>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            There was an error loading the application.
          </p>
          <details style={{ 
            whiteSpace: 'pre-wrap',
            textAlign: 'left',
            backgroundColor: '#fff',
            padding: '15px',
            borderRadius: '4px',
            maxWidth: '600px',
            overflow: 'auto',
            maxHeight: '400px',
            fontSize: '12px',
            border: '1px solid #ccc'
          }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>Error Details</summary>
            <div style={{ marginTop: '10px', color: '#c00' }}>
              {this.state.error?.toString()}
            </div>
            <div style={{ marginTop: '10px', color: '#666', fontSize: '11px' }}>
              {this.state.error?.stack}
            </div>
          </details>
          <p style={{ marginTop: '20px', fontSize: '12px', color: '#999' }}>
            Please check the browser console (F12) for more details.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

