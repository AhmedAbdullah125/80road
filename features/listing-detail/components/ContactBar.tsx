"use client";

import { useState } from "react";
import { MessageCircle, Phone, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/user.store";
import { UnlockModal } from "./UnlockModal";

interface Props {
  listingId: number;
  publisherId?: string;
  isOwner?: boolean;
}

export function ContactBar({ listingId, publisherId }: Props) {
  const [showUnlock, setShowUnlock] = useState(false);
  const user = useUserStore((s) => s.user);
  const userId = user?.phone ?? "guest";

  const isOwner =
    user?.id != null && publisherId != null
      ? String(user.id) === String(publisherId)
      : false;

  const handleAction = () => {
    setShowUnlock(true);
  };

  return (
    <>
      <div
        className="fixed bottom-0 left-0 right-0 w-full z-30 bg-white border-t border-[#E5E7EB] p-3 flex gap-2 justify-between
                   md:static md:translate-x-0 md:max-w-none md:border md:rounded-2xl md:shadow-md md:flex-col md:gap-3 lg:hidden"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
        dir="rtl"
      >
        {isOwner ? (
          <div className="flex-1 flex items-center justify-center py-3 bg-muted/50 rounded-xl border border-dashed border-border">
            <span className="text-sm font-bold text-muted-foreground">
              هذا إعلانك
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 w-full">
            {/* WhatsApp */}
            <Button
              id="contact-whatsapp"
              className="flex-1 min-w-0 gap-1.5 text-[#059669] border border-[#059669]/20 bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[15px] font-bold rounded-[14px] h-[48px] shadow-none px-2"
              onClick={handleAction}
            >
              <MessageCircle className="w-5 h-5 shrink-0" />
              <span className="truncate">واتساب</span>
            </Button>
            
            {/* Lock 1 */}
            <Button variant="outline" className="w-[48px] h-[48px] rounded-[14px] border-[#E5E7EB] shrink-0 p-0 shadow-sm" onClick={handleAction}>
              <Lock className="w-[18px] h-[18px] text-[#9CA3AF]" />
            </Button>

            {/* Call */}
            <Button
              id="contact-call"
              className="flex-1 min-w-0 gap-1.5 text-white bg-[#3E689B] hover:bg-[#3E689B]/90 text-[15px] font-bold rounded-[14px] h-[48px] shadow-[0_4px_15px_-5px_rgba(62,104,155,0.4)] px-2"
              onClick={handleAction}
            >
               <Phone className="w-4 h-4 shrink-0 fill-current border-none" />
               <span className="truncate">اتصال</span>
            </Button>

            {/* Lock 2 */}
            <Button variant="outline" className="w-[48px] h-[48px] rounded-[14px] border-[#E5E7EB] shrink-0 p-0 shadow-sm" onClick={handleAction}>
              <Lock className="w-[18px] h-[18px] text-[#9CA3AF]" />
            </Button>
          </div>
        )}
      </div>

      <UnlockModal
        open={showUnlock}
        onOpenChange={setShowUnlock}
        listingId={listingId}
        userId={userId}
      />
    </>
  );
}
