'use client';

import Link from 'next/link';
import { SlidersHorizontal } from 'lucide-react';
import { useUIStore } from '@/stores/ui.store';

export function SearchCard() {
  const prefs = useUIStore(s => s.preferences);

  const text = prefs?.propertyType && prefs?.area
    ? `${prefs.propertyType} / ${prefs.area}`
    : 'اضغط لتحديد طلبك';

  return (
    <Link
      href="/quick-start?mode=edit"
      id="search-card"
      dir="rtl"
      className="group w-full bg-white text-[#374151] rounded-[32px] p-3 flex flex-row items-center justify-between cursor-pointer active:scale-[.98] transition-all border border-[#E5E7EB] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] h-[88px]"
    >
      <div className="flex flex-col flex-1 text-right justify-center pr-4">
        <span className="text-[12px] text-[#9CA3AF] font-bold mb-1">
          عن ماذا تبحث؟
        </span>
        <h3 className="text-[17px] font-bold text-[#3E689B]">
          {text}
        </h3>
      </div>
      <div className="w-[52px] h-[52px] shrink-0 bg-[#3E689B] text-white rounded-[16px] flex items-center justify-center transition-transform group-active:scale-95 ml-2">
        <SlidersHorizontal className="w-6 h-6" />
      </div>
    </Link>
  );
}
