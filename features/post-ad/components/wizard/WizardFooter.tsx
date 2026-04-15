import React from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import { CustomImage as Image } from "@/shared/components/custom-image";
import { WizardStep } from "@/features/post-ad/types/wizard";

const KNET_LOGO =
  "https://media.licdn.com/dms/image/v2/D4D0BAQFazp_I3lLeQg/company-logo_200_200/company-logo_200_200/0/1715599858189/the_shared_electronic_banking_services_co_knet_logo?e=2147483647&v=beta&t=FfjCLbNIUGrTCTi-tI5nXSNP9B4AcOJbWsFqV0bSWcM";

export function WizardFooter({
  step,
  currentStepInfo,
  processing,
  published,
  handlePublish,
  next,
  prev,
}: {
  step: number;
  currentStepInfo: WizardStep;
  processing: boolean;
  published: boolean;
  handlePublish: () => void;
  next: () => void;
  prev: () => void;
}) {
  if (published) return null;

  const hasBackBtn = step > 1;
  const isSummary = currentStepInfo.type === "summary";
  const needsNextBtn = !isSummary;

  if (!needsNextBtn && !hasBackBtn && !isSummary) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none px-5 pt-5" 
      style={{ paddingBottom: 'calc(20px + var(--safe-area-bottom, 0px))' }}
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto flex items-center gap-4 pointer-events-auto">
        {hasBackBtn && (
          <button
            type="button"
            onClick={prev}
            disabled={processing}
            className="h-14 px-8 bg-white border border-[#F3F4F6] text-[#111827] rounded-[18px] font-bold text-lg active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <ChevronRight className="w-5 h-5 text-[#3B5897]" />
            <span className="hidden sm:inline">رجوع</span>
          </button>
        )}

        {isSummary ? (
          <div className="flex-1 flex gap-3">
             <button
              type="button"
              onClick={handlePublish}
              disabled={processing}
              className="flex-1 h-14 bg-black text-white rounded-[18px] font-[900] text-[18px] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-black/10"
            >
              {processing ? <Loader2 className="w-6 h-6 animate-spin" /> : "Apple Pay"}
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={processing}
              className="flex-1 h-14 bg-[#3B5897] text-white rounded-[18px] font-[900] text-[18px] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-[#3B5897]/20"
            >
              {processing ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Image
                    src={KNET_LOGO}
                    width={28}
                    height={28}
                    className="w-7 h-7 object-contain bg-white rounded-full p-0.5"
                    alt="KNET"
                  />
                  كي نت
                </>
              )}
            </button>
          </div>
        ) : (
          needsNextBtn && (
            <button
              type="button"
              onClick={next}
              className="flex-1 h-14 bg-[#3B5897] text-white rounded-[18px] font-[900] text-[18px] shadow-[0_12px_24px_-4px_rgba(59,88,151,0.2)] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>التالي</span>
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
          )
        )}
      </div>
    </div>
  );
}
