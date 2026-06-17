import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

type Props = { images: string[] };

export default function CoverFlow({ images }: Props) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const n = images.length;
  const wrap = (i: number) => ((i % n) + n) % n;

  const go = useCallback((dir: number) => setIndex((i) => wrap(i + dir)), [n]);

  // Auto-advance
  const pausedRef = useRef(false);
  useEffect(() => {
    const id = setInterval(() => { if (!pausedRef.current && dragOffset === 0) setIndex((i) => wrap(i + 1)); }, 4500);
    return () => clearInterval(id);
  }, [n, dragOffset]);

  // Keyboard
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [go]);

  // Drag & Swipe
  const dragRef = useRef<{ x: number; active: boolean; moved: number } | null>(null);
  const wasDraggingRef = useRef(false);

  const onPointerDown = (e: React.PointerEvent) => {
    pausedRef.current = true;
    dragRef.current = { x: e.clientX, active: true, moved: 0 };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d?.active) return;
    const diff = e.clientX - d.x;
    d.moved = diff;
    setDragOffset(diff);
    if (Math.abs(diff) > 5) {
      wasDraggingRef.current = true;
    }
  };

  const onPointerUp = () => {
    const d = dragRef.current;
    if (d?.active) {
      const threshold = 60;
      if (d.moved > threshold) go(-1);
      else if (d.moved < -threshold) go(1);
    }
    dragRef.current = null;
    setDragOffset(0);
    setTimeout(() => {
      wasDraggingRef.current = false;
      pausedRef.current = false;
    }, 100);
  };

  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > 10) {
      e.preventDefault();
      if (!pausedRef.current) {
        pausedRef.current = true;
        go(e.deltaX > 0 ? 1 : -1);
        setTimeout(() => { pausedRef.current = false; }, 400);
      }
    }
  };

  const isDragging = dragOffset !== 0;

  return (
    <div className="relative">
      {/* Stage */}
      <div
        className="coverflow-stage select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { if (!isDragging) pausedRef.current = false; }}
      >
        <div className="coverflow-track">
          {images.map((src, i) => {
            let offset = i - index;
            // shortest wrap
            if (offset > n / 2) offset -= n;
            if (offset < -n / 2) offset += n;

            // Calculate dynamic offset during drag
            const dynamicOffset = offset - dragOffset / 180;
            const abs = Math.abs(dynamicOffset);
            const visible = abs <= 3;
            const isCenter = Math.abs(dynamicOffset) < 0.5;
            const sign = dynamicOffset === 0 ? 0 : dynamicOffset > 0 ? 1 : -1;

            const translateX = offset * 180 + dragOffset;
            const rotateY = -sign * 45 * Math.min(1, Math.abs(dynamicOffset));
            const scale = isCenter 
              ? 1.05 * Math.max(0.9, 1 - Math.abs(dynamicOffset) * 0.12)
              : Math.max(0.65, 1 - abs * 0.12);
            const z = Math.round(100 - abs);
            const opacity = visible ? (isCenter ? 1 : Math.max(0.25, 1 - abs * 0.28)) : 0;
            const blur = Math.abs(dynamicOffset) < 0.1 ? 0 : Math.min(4, abs * 1.2);

            return (
              <button
                key={i}
                type="button"
                aria-label={`Memory ${i + 1}`}
                className={`coverflow-card group ${isCenter ? "is-center" : ""}`}
                onClick={() => {
                  if (wasDraggingRef.current) return;
                  if (isCenter) setLightbox(src);
                  else setIndex(i);
                }}
                style={{
                  transform: `translate(-50%, -50%) translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
                  zIndex: z,
                  opacity,
                  pointerEvents: visible ? "auto" : "none",
                  filter: blur ? `blur(${blur}px) saturate(0.85)` : undefined,
                  transition: isDragging ? "none" : undefined,
                }}
              >
                <div className="coverflow-img-wrap">
                  <img src={src} alt="" draggable={false} className="coverflow-img" />
                </div>
                <div className="coverflow-reflection" aria-hidden>
                  <img src={src} alt="" draggable={false} className="coverflow-img" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Arrows */}
        <button
          aria-label="Previous"
          onClick={() => go(-1)}
          className="coverflow-arrow left-2 sm:left-6"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          aria-label="Next"
          onClick={() => go(1)}
          className="coverflow-arrow right-2 sm:right-6"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Dots */}
      <div className="mt-8 flex items-center justify-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`coverflow-dot ${i === index ? "is-active" : ""}`}
          />
        ))}
      </div>

      {/* Slide hint */}
      <div className="mt-8 flex justify-center">
        <div className="glass px-6 py-3 rounded-full text-sm tracking-wide font-hindi text-[#f5d77a] flex items-center gap-2 border border-[rgba(212,175,55,.35)]">
          <Heart className="h-4 w-4" />
          तस्वीरें देखने के लिए स्लाइड करें
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4 animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox} alt="Memory" className="max-h-[88vh] max-w-[92vw] rounded-2xl frame" />
        </div>
      )}
    </div>
  );
}
