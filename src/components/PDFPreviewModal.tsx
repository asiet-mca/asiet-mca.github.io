import { XIcon, DownloadIcon, FilePdfIcon, SpinnerGapIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export default function PDFPreview({ file, url, onClose }: { file: any, url: string, onClose: () => void }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
          <div className="flex items-center gap-3">
            <FilePdfIcon size={24} className="text-red-500" weight="fill" />
            <h3 className="max-w-[200px] truncate font-display text-sm font-medium text-text-primary sm:max-w-md">
              {file.name}
            </h3>
          </div>
          
          <div className="flex items-center gap-1">
            <a 
              href={url} 
              download 
              className="flex h-9 w-9 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-bg hover:text-text-primary"
              title="Download PDF"
            >
              <DownloadIcon size={20} />
            </a>
            <button 
              onClick={onClose} 
              className="flex h-9 w-9 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-bg hover:text-text-primary"
              title="Close Preview"
            >
              <XIcon size={20} weight="bold" />
            </button>
          </div>
        </div>
        
        {/* PDF Viewer Body */}
        <div className="relative flex-1 bg-bg-secondary">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <SpinnerGapIcon size={24} className="animate-spin text-text-quaternary" />
              <p className="text-[13px] text-text-tertiary">Loading preview...</p>
            </div>
          )}
          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`}
            className={`h-full w-full border-none ${loading ? 'invisible' : ''}`}
            title={`Preview of ${file.name}`}
            onLoad={() => setLoading(false)}
          />
        </div>
        
        {/* Mobile Footer Action */}
        <div className="flex items-center justify-between border-t border-border bg-surface px-4 py-3 sm:hidden">
          <span className="text-[11px] text-text-tertiary">
            Previewing PDF
          </span>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="rounded-md bg-accent px-3 py-1.5 text-[11px] font-medium text-white"
          >
            Open Full Screen
          </a>
        </div>

      </div>
    </div>
  );
}
