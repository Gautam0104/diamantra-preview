import { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

export default function ErrorState({ error, onRetry, title = 'Something went wrong' }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const errorMessage = error?.message || error?.toString() || 'An unexpected error occurred.';

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <AlertCircle className="mx-auto mb-3 text-red-500" size={40} />
      <h3 className="text-lg font-semibold text-red-800 mb-1">{title}</h3>
      <p className="text-red-600 text-sm mb-4">Please try again or contact support if the issue persists.</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors mb-3"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      )}

      <div className="mt-2">
        <button
          onClick={() => setDetailsOpen(!detailsOpen)}
          className="inline-flex items-center gap-1 text-red-500 text-xs hover:text-red-700"
        >
          Error details
          {detailsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {detailsOpen && (
          <pre className="mt-2 text-left bg-red-100 rounded p-3 text-xs text-red-700 overflow-auto max-h-40">
            {errorMessage}
          </pre>
        )}
      </div>
    </div>
  );
}
