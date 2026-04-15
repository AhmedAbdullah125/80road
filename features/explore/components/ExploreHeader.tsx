"use client";

import { ListFilter } from "lucide-react";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";
import { ExploreFilters } from "./ExploreFilters";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function ExploreHeader() {
  return (
    <div className="md:hidden h-[60px] flex items-center justify-center relative bg-white border-b border-[#F3F4F6]">
      <span className="text-[20px] font-bold text-[#3E689B]">اكسبلور</span>

      {/* Filter Button - Right Side */}
      <div className="absolute right-4 flex items-center">
        <Sheet>
          <SheetTrigger asChild>
            <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#F3F4F6] transition-colors active:scale-95 border border-[#E5E7EB]">
              <ListFilter className="w-5 h-5 text-[#3E689B]" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="h-[85vh] max-h-[85vh] rounded-t-[40px] px-0 pt-8 flex flex-col"
            dir="rtl"
          >
            <SheetHeader className="px-6 shrink-0 mb-4">
              <SheetTitle className="text-2xl font-black text-right">
                تصفية النتائج
              </SheetTitle>
              <SheetDescription className="sr-only">
                استخدم الخيارات أدناه لتصفية نتائج البحث عن العقارات
              </SheetDescription>
            </SheetHeader>

            {/* Scrollable Middle Container */}
            <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0">
              <ExploreFilters />
            </div>

            {/* Fixed Bottom Footer */}
            <div className="shrink-0 px-6 py-4 bg-white border-t border-[#E5E7EB]">
              <button className="w-full py-4 bg-[#3E689B] text-white rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all">
                عرض النتائج
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Notification Bell - Left Side */}
      <div className="absolute left-4">
        <NotificationBell />
      </div>
    </div>
  );
}
