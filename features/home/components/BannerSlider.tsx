"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useHomeData } from "@/shared/hooks/useHome";
import { CustomImage } from "@/shared/components/custom-image";

export function BannerSlider() {
  const { data, isLoading } = useHomeData();
  const slides = data?.header || [];

  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);

  const next = useCallback(
    () =>
      setIndex((i) => {
        if (slides.length <= 1) return 0;
        return (i + 1) % slides.length;
      }),
    [slides.length],
  );

  const prev = useCallback(
    () =>
      setIndex((i) => {
        if (slides.length <= 1) return 0;
        return (i - 1 + slides.length) % slides.length;
      }),
    [slides.length],
  );

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next, slides.length]);

  if (isLoading) {
    return (
      <div className="w-full aspect-video md:aspect-3/1 lg:aspect-4/1 xl:aspect-5/1 flex items-center justify-center bg-muted/20 md:rounded-[40px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (slides.length === 0) return null;

  return (
    <div
      dir="rtl"
      className="relative w-full md:rounded-[40px] overflow-hidden select-none aspect-video md:aspect-[3/1] lg:aspect-[4/1] xl:aspect-[5/1] shadow-2xl group"
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const diff = touchX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
          if (diff < 0) {
            prev();
          } else {
            next();
          }
        }
        touchX.current = null;
      }}
    >
      {/* Slides */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          aria-hidden={i !== index}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === index ? 1 : 0, zIndex: i === index ? 1 : 0 }}
        >
          <CustomImage
            src={s.image}
            alt={s.title}
            fill
            className="w-full h-full object-cover will-change-transform transition-transform duration-[5s] group-hover:scale-110"
            priority={i === 0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          />
          {/* Subtle bottom-only gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Label & Title - Mobile Optimized */}
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-12 flex flex-col justify-end text-white">
            <div
              className="flex flex-col gap-2 max-w-2xl transform transition-all duration-700"
              style={{
                transform: i === index ? "translateY(0)" : "translateY(10px)",
                opacity: i === index ? 1 : 0
              }}
            >
              <span className="w-fit px-3 py-1 bg-[#3E689B] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                {s.caption}
              </span>
              <h2 className="text-lg md:text-3xl font-bold leading-tight drop-shadow-md">
                {s.title}
              </h2>
            </div>
          </div>
        </div>
      ))}

      {/* Pagination Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`transition-all duration-300 rounded-full ${
                i === index ? "w-6 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Hidden arrows on mobile, shown on desktop hover */}
      <button
        onClick={next}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full text-white hidden md:flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-all hover:bg-black/40"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={prev}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full text-white hidden md:flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-all hover:bg-black/40"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}
