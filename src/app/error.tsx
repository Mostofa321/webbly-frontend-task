"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen p-6 bg-app text-text-primary text-center gap-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-danger-50 border border-danger-500/25 text-danger-500 shadow-xs">
        <AlertTriangle size={32} />
      </div>

      <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>

      <p className="text-sm text-text-muted max-w-md leading-relaxed">
        An unexpected error occurred while running the workspace explorer. You can try recovering by clicking the button below.
      </p>

      <button
        type="button"
        onClick={() => reset()}
        className="inline-flex items-center gap-2 mt-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary hover:bg-primary-700 text-white shadow-xs transition-colors cursor-pointer"
      >
        <RefreshCw size={16} />
        Try Again
      </button>
    </div>
  );
}
