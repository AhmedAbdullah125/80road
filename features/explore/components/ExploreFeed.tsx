'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Listing } from '@/lib/types';
import { useExploreListings } from '../hooks/useExploreListings';
import { mapRawExploreToListing } from '../services/explore.service';
import { ExploreFilters } from '../types';
import { cn } from '@/lib/utils';

const FALLBACK = 'https://placehold.co/600x600/e2e8f0/64748b?text=80road';

function ExploreItem({ listing }: { listing: Listing }) {
  const [imgSrc, setImgSrc] = useState(listing.images[0] ?? FALLBACK);

  return (
    <Link
      href={`/ad/${listing.id}`}
      id={`explore-item-${listing.id}`}
      className="relative aspect-square bg-muted cursor-pointer block outline-none overflow-hidden group"
    >
      {/* ── Main Media Content ── */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={() => setImgSrc(FALLBACK)}
        />
        {/* Persistent Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent opacity-80" />
      </div>

      {/* ── Play Icon Center ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[52px] h-[52px] rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
          <Play className="w-[20px] h-[20px] text-white fill-white ml-1 opacity-90" />
        </div>
      </div>

      {/* ── Basic Info ── */}
      <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-end text-white pb-3 px-3" dir="rtl">
        <div className="flex flex-col gap-0.5 min-w-0">
           <span className="font-bold text-[16px] tracking-tight drop-shadow-md leading-none">
             {listing.price}
           </span>
           <span className="text-[13px] font-medium opacity-90 truncate drop-shadow-sm leading-none mt-1">
             {listing.area}
           </span>
        </div>
        <div className="shrink-0 text-[13px] font-medium opacity-90 drop-shadow-sm mb-[2px]">
          {listing.propertyType}
        </div>
      </div>
    </Link>
  );
}

export function ExploreFeed() {
  const searchParams = useSearchParams();
  
  const filters: ExploreFilters = {
    country_id: searchParams.get('country_id') || undefined,
    state_id: searchParams.get('state_id') || undefined,
    city_id: searchParams.get('city_id') || undefined,
    category_values_ids: searchParams.getAll('category_values_ids'),
    min_price: searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined,
    max_price: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined,
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
  };

  const { data, isPending, isError, isFetching } = useExploreListings(filters);

  if (isError) {
    return (
      <div className="flex xl h-40 items-center justify-center text-destructive text-sm" dir="rtl">
        تعذّر تحميل المحتوى
      </div>
    );
  }

  if (isPending && !data) {
    return (
      <div className="flex h-40 items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
      </div>
    );
  }

  const ads = data?.data || [];

  if (ads.length === 0 && !isFetching) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground" dir="rtl">
        <Play className="w-16 h-16 mb-4 opacity-10" />
        <p className="text-lg font-bold">لا توجد إعلانات حالياً</p>
      </div>
    );
  }

  const listings = ads.map(mapRawExploreToListing);

  return (
    <div className="relative w-full bg-white pb-2" dir="rtl">
      <AnimatePresence>
        {isFetching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] flex items-center justify-center"
          >
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn(
        "grid grid-cols-2 gap-[2px] bg-white transition-all duration-300",
        isFetching && "opacity-60"
      )}>
        {listings.map(listing => (
          <ExploreItem key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
