import Link from "next/link";
import { FolderX, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen p-6 bg-app text-text-primary text-center gap-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-surface border border-border-medium text-primary-500 shadow-xs">
        <FolderX size={32} />
      </div>

      <h1 className="text-2xl font-semibold tracking-tight">Page Not Found</h1>

      <p className="text-sm text-text-muted max-w-sm leading-relaxed">
        The page or workspace path you are looking for does not exist or has been moved.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 mt-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary hover:bg-primary-700 text-white shadow-xs transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Explorer
      </Link>
    </div>
  );
}
