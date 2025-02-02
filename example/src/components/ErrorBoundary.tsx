import React from 'react';
import { Component, ErrorInfo, PropsWithChildren } from 'react';

interface ErrorBoundaryProps extends PropsWithChildren {
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });
    // You can also log the error to an error reporting service here
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
          <details className="mt-2">
            <summary className="text-sm text-red-600 cursor-pointer">
              Error Details
            </summary>
            <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">
              {this.state.error?.toString()}
            </pre>
            {this.state.errorInfo && (
              <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">
                {this.state.errorInfo.componentStack}
              </pre>
            )}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage example:
export const withErrorBoundary = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: React.ReactNode
) => {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
};

// You can use it either as a wrapper component:
/*
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
*/

// Or as a HOC:
/*
const SafeComponent = withErrorBoundary(YourComponent);
// Then use it as:
<SafeComponent />
*/