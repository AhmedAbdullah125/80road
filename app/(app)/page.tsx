import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { QUERY_KEYS } from "@/lib/types";
import { fetchHomeListings } from "@/features/home/services/listings.service";
import { homeService } from "@/shared/services/home.service";
import { BannerSlider } from "@/features/home/components/BannerSlider";
import { QuickActions } from "@/features/home/components/QuickActions";
import { HomeListingsGrid } from "@/features/home/components/HomeListingsGrid";
import { SearchCard } from "@/features/home/components/SearchCard";
import { HomeListingCardSkeleton } from "@/features/home/components/HomeListingCard";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import type { Metadata } from "next";
import { HomeBlogsSection } from "@/features/blogs/components/HomeBlogsSection";
import { HomeFooterBanner } from "@/features/home/components/HomeFooterBanner";

export const metadata: Metadata = {
  title: "80road | أفضل العقارات في الكويت - شقق، فلل، أراضي",
  description: "اكتشف أحدث وأفضل إعلانات العقارات في الكويت مع 80road. شقق للإيجار، فلل للبيع، وأراضي استثمارية في جميع مناطق الكويت.",
  keywords: ["عقارات الكويت", "شقق للإيجار", "فلل للبيع", "80road", "عقارات"],
  openGraph: {
    title: "80road – منصة العقارات الأولى في الكويت",
    description: "اكتشف أحدث إعلانات الشقق والفلل والأراضي في الكويت",
    images: ["/og-image.png"],
  },
};

export default async function HomePage() {
  // ── Server-side prefetch ──────────────────────────────────
  const queryClient = getQueryClient();
  
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.listings.all,
      queryFn: fetchHomeListings,
    }),
    queryClient.prefetchQuery({
      queryKey: ['home-data'],
      queryFn: () => homeService.getHomeData(),
    }),
  ]);

  // Dehydrate the cache so the client doesn't refetch
  const dehydratedState = dehydrate(queryClient);


  return (
    <HydrationBoundary state={dehydratedState}>
      <div
        className="max-w-7xl mx-auto px-4 md:px-8 pt-2 pb-28 flex flex-col gap-8"
        dir="rtl"
      >
        {/* SEO Main Heading (Visually Hidden) */}
        <h1 className="sr-only">80road - منصة العقارات المتكاملة في الكويت</h1>


        {/* ── Hero Banner (Strictly Separated) ──────────────────────── */}
        <div className="px-5">
          <div className="rounded-[24px] overflow-hidden border border-[#E5E7EB] shadow-sm bg-white">
            <BannerSlider />
          </div>
        </div>

        {/* ── Search Card (Strictly Separated) ──────────────────────── */}
        <div className="px-5 mt-5">
          <SearchCard />
        </div>

        {/* ── Quick Actions (3-Column Grid) ────────────────────────────── */}
        <section className="mt-6 px-5">
          <div className="grid grid-cols-3 gap-4">
             <QuickActions />
          </div>
        </section>

        {/* ── Latest Listings ──────────────────────────── */}
        <section
          aria-labelledby="latest-listings-heading"
          className="flex flex-col"
        >
          <SectionHeader
            id="latest-listings-heading"
            title="أحدث الإعلانات"
            description="إليك ما تمت إضافته مؤخراً ويناسب اهتماماتك في سوق العقار الكويتي."
            action={
              <Button
                variant="ghost"
                className="text-primary font-bold hover:bg-primary/5 hidden md:flex text-base"
              >
                عرض الكل
              </Button>
            }
          />

          <Suspense
            fallback={
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <HomeListingCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <HomeListingsGrid />
          </Suspense>

          <div className="flex justify-center mt-5">
            <button
              id="load-more-listings"
              className="group relative w-full md:w-auto md:min-w-[280px] overflow-hidden py-4 px-8 bg-primary text-primary-foreground rounded-2xl font-bold text-base shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 active:scale-95 transition-all"
            >
              <span className="relative z-10">استكشاف المزيد من النتائج</span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </section>

        {/* ── Blogs / News Section ─────────────────────── */}
        <HomeBlogsSection />

        <HomeFooterBanner />
      </div>
    </HydrationBoundary>
  );
}
