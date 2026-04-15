import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { QUERY_KEYS } from "@/lib/types";
import { fetchExploreFeed } from "@/features/explore/services/explore.service";
import { ExploreFeed } from "@/features/explore/components/ExploreFeed";
import { Suspense } from "react";
import type { Metadata } from "next";
import { ExploreHeader } from "@/features/explore/components/ExploreHeader";

export const metadata: Metadata = {
  title: "اكسبلور العقارات | 80road - فيديوهات عقارية قصيرة في الكويت",
  description: "استعرض أحدث إعلانات العقارات في الكويت بأسلوب الفيديو القصير. شاهد الشقق والفلل من الداخل عبر تجربة بصرية فريدة مع 80road.",
};

export default async function ExplorePage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.listings.explore,
    queryFn: () => fetchExploreFeed(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-full pb-24 bg-white" dir="rtl">
        {/* SEO Main Heading (Visually Hidden) */}
        <h1 className="sr-only">اكسبلور 80road - منصة عرض العقارات بالفيديو في الكويت</h1>

        {/* ── Custom Mobile Header (Client Component with Filter Sheet) ── */}
        <ExploreHeader />

        {/* ── Main Catalog Feed ── */}
        <Suspense
          fallback={
            <div className="grid grid-cols-2 gap-[2px] animate-pulse">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square bg-muted" />
              ))}
            </div>
          }
        >
          <ExploreFeed />
        </Suspense>
      </div>
    </HydrationBoundary>
  );
}
