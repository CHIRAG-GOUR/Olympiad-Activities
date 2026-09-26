"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  questionId?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ActivityErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn(
      `[ActivityErrorBoundary] Handled activity exception for question ${this.props.questionId || "unknown"}:`,
      error,
      errorInfo
    );
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.questionId !== this.props.questionId && this.state.hasError) {
      this.setState({ hasError: false, error: undefined });
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-xl text-xs text-amber-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Interactive activity encountered an issue — standard mode active.</span>
          </div>
          <p className="text-[11px] text-amber-700">
            You can select your answer from standard options below, or retry the interactive view.
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-[11px] flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" /> Retry Interactive View
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
