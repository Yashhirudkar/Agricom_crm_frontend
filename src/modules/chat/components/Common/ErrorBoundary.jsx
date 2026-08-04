"use client";

import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Chat Module Error boundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-6 text-center bg-slate-50 border border-red-100 rounded-2xl m-4 shadow-sm animate-in fade-in duration-200">
          <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-3">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h4 className="font-bold text-slate-800 text-sm mb-1">
            {this.props.title || "Failed to load section"}
          </h4>
          <p className="text-xs text-slate-550 text-slate-500 max-w-xs mb-4 leading-relaxed">
            An unexpected rendering error occurred. You can attempt to reload this specific view.
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 font-semibold text-xs rounded-lg hover:bg-slate-50 hover:border-slate-350 transition-colors shadow-xs cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reload component</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
