import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { getQueryClient } from "@/lib/query-client";
import { QUERY_KEYS } from "@/lib/types";
import { fetchListingById } from "@/features/listing-detail/services/listing-detail.service";
import { SectionHeader } from "@/components/ui/section-header";
import { MediaCarousel } from "@/features/listing-detail/components/MediaCarousel";
import { ContactBar } from "@/features/listing-detail/components/ContactBar";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { CustomImage as Image } from "@/shared/components/custom-image";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const listing = await fetchListingById(Number(id));
    if (!listing) return { title: "إعلان غير موجود | 80road" };

    const images = listing.images.length > 0 ? listing.images : ["/og-ad-default.png"];
    return {
      title: `${listing.title} | ${listing.area} | 80road`,
      description: listing.description?.slice(0, 160) ?? "تصفح تفاصيل هذا الإعلان المميز على 80road.",
      openGraph: { title: listing.title, description: listing.description?.slice(0, 160), images, type: "article" },
    };
  } catch {
    return { title: "إعلان غير موجود | 80road" };
  }
}



function AttrBadge({ label, value }: { label: string; value?: string | number }) {
  if (!value) return null;
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-4 flex flex-col items-end text-right gap-1 h-[88px] justify-center transition-all">
      <span className="text-[12px] text-[#9CA3AF] font-bold">{label}</span>
      <span className="text-[16px] font-bold text-[#3E689B]">{value}</span>
    </div>
  );
}

export default async function AdPage({ params }: Props) {
  const { id } = await params;
  const numericId = Number(id);

  const queryClient = getQueryClient();
  try {
    await queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.listings.detail(numericId),
      queryFn: () => fetchListingById(numericId),
    });
  } catch {}

  const listing = queryClient.getQueryData<
    Awaited<ReturnType<typeof fetchListingById>>
  >(QUERY_KEYS.listings.detail(numericId));

  if (!listing) notFound();
  const isOwner = false;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-screen bg-[#F5F8FA] flex flex-col animate-in fade-in duration-300 pb-28">
        
        {/* Media Hero */}
        <div className="w-full bg-[#f5f8fa]">
          <MediaCarousel listing={listing} />
        </div>

        {/* Content Container */}
        <div className="px-4 flex flex-col gap-4 -mt-2 relative z-10" dir="rtl">
          
          {/* Main Info Card */}
          <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#E5E7EB] flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <h1 className="text-[18px] md:text-xl font-bold text-[#3E689B] leading-tight max-w-[65%]">
                {listing.title}
              </h1>
              <span className="text-[#3E689B] font-black text-[18px] whitespace-nowrap">
                {listing.price}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[#6B7280] text-[13px] font-bold">
              <MapPin className="w-4 h-4" />
              <span>{listing.area}، {listing.governorate}</span>
            </div>

            <div className="border-t border-[#F3F4F6] pt-4 mt-2 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[12px] font-bold text-[#9CA3AF]">
                  {listing.views ? `${listing.views} مشاهدة` : "0 مشاهدة"}
                </span>
              </div>
              
              <Link href={listing.publisherId ? `/profile/${listing.publisherId}` : "#"} className="flex items-center gap-3">
                <span className="text-[14px] font-bold text-[#3E689B]">
                  {listing.publisherName ?? "مكتب عقاري"}
                </span>
                <div className="w-10 h-10 rounded-full border border-border overflow-hidden relative">
                  {listing.publisherAvatar ? (
                    <Image src={listing.publisherAvatar} alt={listing.publisherName ?? ""} fill className="object-cover" />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-sm font-bold">م</span>
                  )}
                </div>
              </Link>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-[#f5f8fa] flex flex-col gap-4 mt-2">
            <h2 className="text-[18px] font-black text-[#3E689B]">الوصف</h2>
            <p className="text-[14px] text-[#4B5563] leading-relaxed whitespace-pre-line font-medium px-1">
              {listing.description ?? "لا يوجد وصف متاح."}
            </p>
          </div>

          {/* Details Section */}
          <div className="bg-[#f5f8fa] flex flex-col gap-4 mt-4">
            <h2 className="text-[18px] font-black text-[#3E689B]">تفاصيل العقار</h2>
            <div className="grid grid-cols-2 gap-3">
              <AttrBadge label="نوع الإعلان" value={listing.listingType} />
              <AttrBadge label="نوع العقار" value={listing.propertyType} />
              <AttrBadge label="المساحة" value={listing.size ? `${listing.size} م²` : undefined} />
              <AttrBadge label="الغرف" value={listing.rooms} />
              <AttrBadge label="الحمامات" value={listing.bathrooms} />
              <AttrBadge label="بلكونة" value={listing.balcony} />
              <AttrBadge label="المواقف" value={listing.parking} />
              <AttrBadge label="نظام المواقف" value={listing.parkingSystems?.join("، ")} />
              <AttrBadge label="التكييف" value={listing.ac} />
              <AttrBadge label="الكهرباء" value={listing.electricity} />
              <AttrBadge label="الماء" value={listing.water} />
            </div>
          </div>

        </div>

        {/* Contact Bar (Sticky Bottom) */}
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/90 backdrop-blur-md border-t shadow-[0_-10px_20px_rgba(0,0,0,0.03)] pb-safe">
          <ContactBar listingId={listing.id} publisherId={listing.publisherId} isOwner={isOwner} />
        </div>
      </div>
    </HydrationBoundary>
  );
}

