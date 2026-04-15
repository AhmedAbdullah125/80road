'use client';

import Link from 'next/link';
import { useHomeData } from '@/shared/hooks/useHome';
import { CustomImage } from '@/shared/components/custom-image';

export function QuickActions() {
  const { data, isLoading } = useHomeData();
  const categories = data?.categories || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-3 md:flex md:flex-wrap items-center justify-center gap-3 md:gap-8" dir="rtl">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="bg-card w-full md:w-44 lg:w-52 py-4 md:py-8 rounded-2xl md:rounded-3xl shadow-lg border border-border/50 animate-pulse flex flex-col items-center justify-center gap-2 md:gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-muted" />
            <div className="h-4 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {categories.map(category => (
        <Link
          key={category.id}
          href={`/explore?category=${category.id}`}
          id={`quick-action-${category.id}`}
          className="group flex flex-col items-center justify-center gap-2 bg-white w-full aspect-square rounded-[24px] shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] border border-[#E5E7EB] transition-all hover:border-[#3E689B]/20 active:scale-[0.96]"
        >
          <div className="relative w-12 h-12 rounded-full bg-[#F3F6FA] flex items-center justify-center">
            <CustomImage 
              src={category.icon} 
              alt={category.value}
              width={24}
              height={24}
              className="object-contain grayscale opacity-80"
            />
          </div>
          <span className="text-[14px] font-bold text-[#3E689B] text-center leading-none">
            {category.value}
          </span>
        </Link>
      ))}
    </>
  );
}
