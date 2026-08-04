import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, ZoomIn, ZoomOut, RotateCw, Download, ChevronLeft, ChevronRight } from "lucide-react";

const MediaViewer = ({ currentMedia, mediaList = [], onClose }) => {
  const [activeMedia, setActiveMedia] = useState(currentMedia);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const modalRef = useRef(null);
  const triggerRef = useRef(document.activeElement);

  const activeIndex = useMemo(() => {
    return mediaList.findIndex(m => m.src === activeMedia.src) ?? 0;
  }, [mediaList, activeMedia]);

  // Preload adjacent images to eliminate loading flashes
  useEffect(() => {
    if (mediaList.length <= 1) return;
    const preloadIndices = [activeIndex - 1, activeIndex + 1].filter(
      idx => idx >= 0 && idx < mediaList.length
    );
    preloadIndices.forEach(idx => {
      const item = mediaList[idx];
      if (item && item.type === "IMAGE") {
        const img = new Image();
        img.src = item.src;
      }
    });
  }, [activeIndex, mediaList]);

  // Reset transforms when switching active media
  const changeActiveMedia = useCallback((media) => {
    setActiveMedia(media);
    setScale(1);
    setRotation(0);
  }, []);

  const handlePrev = useCallback(() => {
    if (activeIndex > 0) {
      changeActiveMedia(mediaList[activeIndex - 1]);
    }
  }, [activeIndex, mediaList, changeActiveMedia]);

  const handleNext = useCallback(() => {
    if (activeIndex < mediaList.length - 1) {
      changeActiveMedia(mediaList[activeIndex + 1]);
    }
  }, [activeIndex, mediaList, changeActiveMedia]);

  // Keyboard navigation & close listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, handlePrev, handleNext]);

  // Focus lock trap
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
    return () => {
      if (triggerRef.current) triggerRef.current.focus();
    };
  }, []);

  // Transforms modifiers
  const zoomIn = () => setScale(s => Math.min(s + 0.25, 3));
  const zoomOut = () => setScale(s => Math.max(s - 0.25, 0.5));
  const rotateCw = () => setRotation(r => (r + 90) % 360);

  const viewerContent = (
    <div
      ref={modalRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/95 z-[9999] flex flex-col justify-between items-center text-white select-none outline-none animate-in fade-in duration-150"
    >
      {/* Lightbox Header toolbar */}
      <header className="w-full flex items-center justify-between p-4 bg-black/40 backdrop-blur-md relative z-20">
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-300 truncate max-w-md">
            {activeMedia.name || "Media Viewer"}
          </p>
        </div>
        <div className="flex items-center gap-3.5">
          {activeMedia.type === "IMAGE" && (
            <>
              <button onClick={zoomIn} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer" title="Zoom In">
                <ZoomIn className="h-4 w-4" />
              </button>
              <button onClick={zoomOut} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer" title="Zoom Out">
                <ZoomOut className="h-4 w-4" />
              </button>
              <button onClick={rotateCw} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer" title="Rotate">
                <RotateCw className="h-4 w-4" />
              </button>
            </>
          )}
          <a
            href={activeMedia.src}
            download={activeMedia.name || "download"}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </a>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer" title="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 w-full flex items-center justify-center relative overflow-hidden">
        {activeIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-6 p-3 bg-black/35 hover:bg-black/55 rounded-full text-white cursor-pointer transition-colors z-20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        {/* Media Frame */}
        <div
          className="max-w-[85vw] max-h-[75vh] flex items-center justify-center transition-transform duration-200"
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
          }}
        >
          {activeMedia.type === "IMAGE" ? (
            <img
              src={activeMedia.src}
              alt="Media asset"
              className="max-w-full max-h-[75vh] object-contain pointer-events-none select-none rounded-lg border border-white/5"
            />
          ) : activeMedia.type === "VIDEO" ? (
            <video
              src={activeMedia.src}
              controls
              autoPlay
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
            />
          ) : activeMedia.type === "PDF" ? (
            <iframe
              src={activeMedia.src}
              title="PDF document viewer"
              className="w-[70vw] h-[70vh] bg-white rounded-lg"
            />
          ) : (
            <div className="p-6 bg-slate-800 text-sm rounded-lg">
              Unsupported file format preview.
            </div>
          )}
        </div>

        {activeIndex < mediaList.length - 1 && (
          <button
            onClick={handleNext}
            className="absolute right-6 p-3 bg-black/35 hover:bg-black/55 rounded-full text-white cursor-pointer transition-colors z-20"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </main>

      {/* Lightbox Footer pagination label */}
      <footer className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest relative z-20">
        Asset {activeIndex + 1} of {mediaList.length}
      </footer>
    </div>
  );

  return createPortal(viewerContent, document.body);
};

// Helper hook replacement for useMemo to avoid import errors
function useMemo(factory, deps) {
  return React.useMemo(factory, deps);
}

export default MediaViewer;
