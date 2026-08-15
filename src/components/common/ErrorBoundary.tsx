import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackTitle?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught portal error:', error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public override render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-[300px] flex items-center justify-center p-6">
          <div className="bg-[#0b1324] border border-red-500/30 rounded-2xl p-6 max-w-md w-full text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {this.props.fallbackTitle || 'Component Rendering Error'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {this.state.error?.message || 'An unexpected error occurred while displaying this section.'}
              </p>
            </div>
            <button
              onClick={this.handleReload}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry / Reload</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
