/**
 * PdfModal - Production-ready PDF Preview Modal
 * Inspired by Google Drive PDF viewer
 *
 * Features:
 * - Mobile-first: slides up from bottom, 96dvh, full-width pages
 * - Desktop: centered dialog, max-w-4xl, 90vh
 * - Dark chrome — content stays the focus
 * - Lazy loading and virtualization for performance
 * - Smooth animations
 * - Accessibility support
 * - Download, zoom, fullscreen, keyboard navigation
 */

import React, {
  ReactElement,
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { List, ListImperativeAPI } from 'react-window';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowsOut,
  ArrowsIn,
  CaretUp,
  CaretDown,
  Download,
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
  X,
} from '@phosphor-icons/react';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import { FileSystemNode } from '../data/fileSystem';

// ─── Constants ──────────────────────────────────────────────────────────────────
const PADDING_PER_PAGE = 24;
const DEFAULT_PAGE_HEIGHT = 800;
const MIN_SCALE = 0.5;
const MAX_SCALE = 3.0;
const SCALE_STEP = 0.25;

// ─── Types ───────────────────────────────────────────────────────────────────────
interface PdfModalProps {
  isOpen?: boolean;
  onClose: () => void;
  pdfUrl?: string;
  pdfFile?: File;
  file?: FileSystemNode;
  url?: string;
  title?: string;
}

interface PageInfo {
  width: number;
  height: number;
}

// Custom fields passed via rowProps — react-window spreads these onto the component
interface RowItemData {
  scale: number;
  pageWidth: number;
  onPageLoadSuccess: (page: any, pageNumber: number) => void;
}

// Full props shape: react-window injects index, style, ariaAttributes;
// our custom fields arrive at the top level (not nested under `data`)
type RowProps = RowItemData & {
  index: number;
  style: React.CSSProperties;
  ariaAttributes: {
    'aria-posinset': number;
    'aria-setsize': number;
    role: 'listitem';
  };
};

// ─── PdfRow — outside the component for a stable reference ──────────────────────
const PdfRow = ({
  index,
  style,
  scale,
  pageWidth,
  onPageLoadSuccess,
  ariaAttributes,
}: RowProps): ReactElement | null => {
  const pageNumber = index + 1;
  return (
    <div style={style} className="flex justify-center py-3" {...ariaAttributes}>
      <div className="shadow-lg rounded-sm overflow-hidden bg-white">
        <Page
          pageNumber={pageNumber}
          width={Math.round(pageWidth * scale)}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          onLoadSuccess={(page) => onPageLoadSuccess(page, pageNumber)}
        />
      </div>
    </div>
  );
};

// ─── Main component ──────────────────────────────────────────────────────────────
const PDFPreview: React.FC<PdfModalProps> = ({
  isOpen = true,
  onClose,
  pdfUrl,
  pdfFile,
  file,
  url,
  title,
}) => {
  const [numPages, setNumPages]       = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [pageInfos, setPageInfos]     = useState<PageInfo[]>([]);
  const [scale, setScale]             = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile]       = useState(false);

  const listRef      = useRef<ListImperativeAPI | null>(null);
  const modalRef     = useRef<HTMLDivElement>(null);
  const viewportRef  = useRef<HTMLDivElement>(null);
  const currentPageRef = useRef(1);
  const numPagesRef    = useRef<number | null>(null);
  const scrollUpRef    = useRef<() => void>(() => {});
  const scrollDownRef  = useRef<() => void>(() => {});

  const displayTitle = title || file?.name || 'PDF Preview';

  // Stable PDF source
  const pdfSource = useMemo(() => {
    if (url) return url;
    if (pdfUrl) return pdfUrl;
    if (pdfFile) return pdfFile;
    return undefined;
  }, [url, pdfUrl, pdfFile]);

  // Mobile detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Track content-area dimensions
  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      const e = entries[0];
      if (!e) return;
      setViewportSize({ width: e.contentRect.width, height: e.contentRect.height });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Page width: edge-to-edge on mobile, capped on desktop
  const pageWidth = useMemo(() => {
    if (!viewportSize.width) return 320;
    const padding = isMobile ? 8 : 32;
    return Math.max(280, Math.min(viewportSize.width - padding, 860));
  }, [viewportSize.width, isMobile]);

  const listHeight = useMemo(
    () => (viewportSize.height > 100 ? viewportSize.height : 9999),
    [viewportSize.height]
  );

  // Sync refs
  useEffect(() => { currentPageRef.current = currentPage; }, [currentPage]);
  useEffect(() => { numPagesRef.current = numPages; }, [numPages]);

  // ─── PDF callbacks ────────────────────────────────────────────────────────────
  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    numPagesRef.current = numPages;
    setLoading(false);
    setError(null);
    setCurrentPage(1);
    currentPageRef.current = 1;
  }, []);

  const onDocumentLoadError = useCallback((err: Error) => {
    setError('Failed to load PDF');
    setLoading(false);
    console.error('PDF load error:', err);
  }, []);

  const onPageLoadSuccess = useCallback((page: any, pageNumber: number) => {
    const { width, height } = page;
    setPageInfos((prev) => {
      const next = [...prev];
      next[pageNumber - 1] = { width, height };
      return next;
    });
  }, []);

  const itemData: RowItemData = useMemo(
    () => ({ scale, pageWidth, onPageLoadSuccess }),
    [scale, pageWidth, onPageLoadSuccess]
  );

  // ─── Row sizing ───────────────────────────────────────────────────────────────
  const getItemSize = useCallback(
    (index: number) => {
      const info = pageInfos[index];
      const scaledWidth = Math.round(pageWidth * scale);
      if (!info) return Math.round(DEFAULT_PAGE_HEIGHT * scale) + PADDING_PER_PAGE;
      return Math.round(scaledWidth * (info.height / info.width)) + PADDING_PER_PAGE;
    },
    [pageInfos, pageWidth, scale]
  );

  const getPageAtScrollOffset = useCallback(
    (scrollTop: number): number => {
      const total = numPagesRef.current ?? 0;
      let acc = 0;
      for (let i = 0; i < total; i++) {
        acc += getItemSize(i);
        if (scrollTop < acc) return i + 1;
      }
      return total || 1;
    },
    [getItemSize]
  );

  const handleRowsRendered = useCallback(
    ({ startIndex, scrollTop }: { startIndex: number; stopIndex: number; scrollTop?: number }) => {
      const page = scrollTop !== undefined ? getPageAtScrollOffset(scrollTop) : startIndex + 1;
      if (page !== currentPageRef.current) {
        setCurrentPage(page);
        currentPageRef.current = page;
      }
    },
    [getPageAtScrollOffset]
  );

  // ─── Navigation ───────────────────────────────────────────────────────────────
  const scrollToPage = useCallback((pageNumber: number) => {
    if (!listRef.current) return;
    const total = numPagesRef.current ?? 0;
    const index = Math.max(0, Math.min(pageNumber - 1, total - 1));
    listRef.current.scrollToRow({ index, align: 'start', behavior: 'smooth' });
    setCurrentPage(pageNumber);
    currentPageRef.current = pageNumber;
  }, []);

  const scrollUp   = useCallback(() => {
    if (currentPageRef.current > 1) scrollToPage(currentPageRef.current - 1);
  }, [scrollToPage]);

  const scrollDown = useCallback(() => {
    const total = numPagesRef.current;
    if (total && currentPageRef.current < total) scrollToPage(currentPageRef.current + 1);
  }, [scrollToPage]);

  useEffect(() => {
    scrollUpRef.current   = scrollUp;
    scrollDownRef.current = scrollDown;
  }, [scrollUp, scrollDown]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':    onClose(); break;
        case 'ArrowUp':   e.preventDefault(); scrollUpRef.current();   break;
        case 'ArrowDown': e.preventDefault(); scrollDownRef.current(); break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // ─── Zoom ─────────────────────────────────────────────────────────────────────
  const zoomIn  = useCallback(() => {
    setScale((s) => Math.min(parseFloat((s + SCALE_STEP).toFixed(2)), MAX_SCALE));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((s) => Math.max(parseFloat((s - SCALE_STEP).toFixed(2)), MIN_SCALE));
  }, []);

  useEffect(() => {
    (listRef.current as any)?.recomputeRowHeights?.();
  }, [scale, pageWidth]);

  // ─── Fullscreen ───────────────────────────────────────────────────────────────
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      modalRef.current?.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // ─── Download ─────────────────────────────────────────────────────────────────
  const handleDownload = useCallback(async () => {
    const href = url || pdfUrl;
    if (href) {
      const link = document.createElement('a');
      link.href = href;
      link.download = displayTitle || 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (pdfFile) {
      const objectUrl = URL.createObjectURL(pdfFile);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = pdfFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    }
  }, [url, pdfUrl, pdfFile, displayTitle]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    const focusable = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (last  && document.activeElement === last)  { last.focus();  e.preventDefault(); }
      } else {
        if (first && document.activeElement === first) { first.focus(); e.preventDefault(); }
      }
    };
    document.addEventListener('keydown', handleTab);
    first?.focus();
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  // ─── Animation variants ───────────────────────────────────────────────────────
  const backdropVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit:    { opacity: 0, transition: { duration: 0.18 } },
  };

  const modalVariants: import('motion/react').Variants = {
    hidden:  { opacity: 0, y: isMobile ? '100%' : 0,  scale: isMobile ? 1 : 0.96 },
    visible: { opacity: 1, y: 0, scale: 1,
               transition: { duration: 0.28, ease: 'easeOut' } },
    exit:    { opacity: 0, y: isMobile ? '100%' : 0,  scale: isMobile ? 1 : 0.96,
               transition: { duration: 0.2, ease: 'easeIn' } },
  };

  if (!isOpen) return null;

  // Shared button class — large touch target, smooth feedback
  const btn = (extra = '') =>
    `p-2.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10
     active:bg-white/20 transition-colors touch-manipulation disabled:opacity-25
     disabled:cursor-not-allowed ${extra}`.replace(/\s+/g, ' ');

  return (
    <AnimatePresence>
      {/* Outer: bottom-align on mobile, center on desktop */}
      <motion.div
        className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center sm:p-4"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />

        {/* ── Modal shell ── */}
        <motion.div
          ref={modalRef}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pdf-modal-title"
          className={[
            // Base
            'relative z-10 flex flex-col bg-[#181818] overflow-hidden',
            // Mobile: full width, 96dvh, top-rounded only
            'w-full h-[96dvh] rounded-t-2xl',
            // Desktop: max-width, max-height, all-rounded
            'sm:w-full sm:max-w-4xl sm:h-[88vh] sm:rounded-2xl',
          ].join(' ')}
        >
          {/* ── Drag handle (mobile only) ── */}
          <div className="sm:hidden flex justify-center pt-2.5 pb-0 shrink-0" aria-hidden>
            <div className="w-9 h-[3px] rounded-full bg-white/20" />
          </div>

          {/* ── Header ── */}
          <div className="flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-2 border-b border-white/8 shrink-0">

            {/* Title + page badge */}
            <div className="flex-1 min-w-0 flex items-center gap-2 px-1">
              <h2
                id="pdf-modal-title"
                className="text-[13px] font-medium text-white/80 truncate leading-tight"
              >
                {displayTitle}
              </h2>
              {numPages && (
                <span className="text-[11px] font-medium text-white/40 bg-white/8 px-2 py-0.5 rounded-full shrink-0 tabular-nums">
                  {currentPage} / {numPages}
                </span>
              )}
            </div>

            {/* Controls row — always fits in one line */}
            <div className="flex items-center gap-0 shrink-0">

              {/* Page navigation */}
              <button
                onClick={scrollUp}
                disabled={currentPage <= 1}
                className={btn()}
                aria-label="Previous page"
              >
                <CaretUp size={17} weight="bold" />
              </button>
              <button
                onClick={scrollDown}
                disabled={!numPages || currentPage >= numPages}
                className={btn()}
                aria-label="Next page"
              >
                <CaretDown size={17} weight="bold" />
              </button>

              {/* Divider */}
              <span className="w-px h-4 bg-white/12 mx-1" aria-hidden />

              {/* Zoom */}
              <button
                onClick={zoomOut}
                disabled={scale <= MIN_SCALE}
                className={btn()}
                aria-label="Zoom out"
              >
                <MagnifyingGlassMinus size={17} />
              </button>
              <span className="text-[11px] text-white/40 w-9 text-center select-none tabular-nums">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={zoomIn}
                disabled={scale >= MAX_SCALE}
                className={btn()}
                aria-label="Zoom in"
              >
                <MagnifyingGlassPlus size={17} />
              </button>

              {/* Divider */}
              <span className="w-px h-4 bg-white/12 mx-1" aria-hidden />

              {/* Fullscreen — desktop only (modal is already near-fullscreen on mobile) */}
              <button
                onClick={toggleFullscreen}
                className={btn('hidden sm:flex')}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? <ArrowsIn size={17} /> : <ArrowsOut size={17} />}
              </button>

              {/* Download */}
              <button
                onClick={handleDownload}
                className={btn()}
                aria-label="Download PDF"
              >
                <Download size={17} />
              </button>

              {/* Close */}
              <button
                onClick={onClose}
                className={btn()}
                aria-label="Close"
              >
                <X size={17} weight="bold" />
              </button>
            </div>
          </div>

          {/* ── PDF content area ── */}
          <div ref={viewportRef} className="flex-1 min-h-0 overflow-hidden bg-[#242424]">

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <div className="w-7 h-7 rounded-full border-2 border-white/15 border-t-white/70 animate-spin" />
                <p className="text-[13px] text-white/40">Loading PDF…</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <span className="text-3xl" role="img" aria-label="error">⚠️</span>
                <p className="text-sm text-white/50">{error}</p>
              </div>
            )}

            {/* Document — always mounted to prevent remount/duplicate-key cycle */}
            {!error && (
              <div className={loading ? 'hidden' : 'h-full'}>
                <Document
                  file={pdfSource}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading=""
                >
                  {numPages && (
                    <List
                      defaultHeight={listHeight}
                      rowCount={numPages}
                      rowHeight={getItemSize}
                      rowComponent={PdfRow}
                      rowProps={itemData as unknown as RowProps}
                      onRowsRendered={handleRowsRendered}
                      listRef={listRef}
                      style={{ width: '100%', height: listHeight, overflowX: 'auto' }}
                      className="pdf-list"
                    />
                  )}
                </Document>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PDFPreview;