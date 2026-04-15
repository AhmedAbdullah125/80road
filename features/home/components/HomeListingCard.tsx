'use client';

import { CustomImage as Image } from '@/shared/components/custom-image';
import Link from 'next/link';
import { Listing } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { BedIcon, BathIcon, MaximizeIcon, MapPinIcon, Heart } from 'lucide-react';
import { useState } from 'react';
import { useToggleLike } from '@/shared/hooks/useListing';
import { cn } from '@/lib/utils';

const FALLBACK = 'https://raiyansoft.com/wp-content/uploads/2026/01/1.png';

interface Props {
  listing: Listing;
}

export function HomeListingCard({ listing }: Props) {
  const toggleLike = useToggleLike();

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike.mutate(listing.id);
  };

  const imgSrc =
    typeof listing.imageUrl === 'string'
      ? listing.imageUrl
      : listing.images[0] ?? FALLBACK;

  return (
    <Link
      href={`/ad/${listing.id}`}
      id={`listing-card-${listing.id}`}
      className="group relative flex flex-col w-full rounded-[30px] overflow-hidden bg-white border border-[#E5E7EB] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] transition-all duration-300 active:scale-[0.98] outline-none"
    >
      {/* ── Top Media Section ────────────────────────────────── */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={imgSrc}
          alt={listing.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        
        {/* Status Badge (if any) */}
        <div className="absolute top-3 left-3 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-[10px] text-white font-bold">
          {listing.listingType || 'للإيجار'}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleToggleLike}
          disabled={toggleLike.isPending}
          className={cn(
            "absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all shadow-lg active:scale-90",
            listing.isLiked 
              ? "bg-white border-red-500 text-red-500" 
              : "bg-black/20 border-white/20 text-white"
          )}
        >
          <Heart 
            className={cn("w-4 h-4 transition-colors", listing.isLiked && "fill-current")} 
          />
        </button>
      </div>

      {/* ── Content Section ───────────────────────────────────── */}
      <div className="p-4 flex flex-col gap-3" dir="rtl">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="font-black text-[18px] text-[#3E689B]">
              {listing.price} <span className="text-[12px] font-bold opacity-70">د.ك</span>
            </span>
          </div>
          <h3 className="text-[#374151] font-bold text-[15px] truncate leading-tight">
            {listing.title}
          </h3>
          <div className="flex items-center gap-1 text-[#9CA3AF]">
            <MapPinIcon className="w-3.5 h-3.5" />
            <span className="text-[12px] font-medium truncate">{listing.area}، {listing.governorate}</span>
          </div>
        </div>

        {/* Info Grid (Simplified Mobile View) */}
        <div className="flex items-center gap-4 pt-1 border-t border-[#F3F4F6]">
          <div className="flex items-center gap-1.5 grayscale opacity-60">
            <BedIcon className="w-3.5 h-3.5" />
            <span className="text-[13px] font-bold text-[#374151]">{listing.rooms || 0}</span>
          </div>
          <div className="flex items-center gap-1.5 grayscale opacity-60">
            <BathIcon className="w-3.5 h-3.5" />
            <span className="text-[13px] font-bold text-[#374151]">{listing.bathrooms || 0}</span>
          </div>
          <div className="flex items-center gap-1.5 grayscale opacity-60">
            <MaximizeIcon className="w-3.5 h-3.5" />
            <span className="text-[12px] font-bold text-[#374151]">{listing.size || 0} م²</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function HomeListingCardSkeleton() {
  return (
    <div className="aspect-[3/4] flex flex-col rounded-[30px] border border-[#E5E7EB] overflow-hidden animate-pulse bg-white">
      <div className="aspect-[4/3] bg-gray-100" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 bg-gray-100 rounded w-1/2" />
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full mt-2" />
      </div>
    </div>
  );
}
