import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function ProgressTop({
  step,
  totalSteps,
}: {
  step: number;
  totalSteps: number;
  setStep: (s: number) => void;
}) {
  return (
    <div className="sticky top-0 z-40 bg-white border-b border-border/50 shrink-0" dir="rtl">
      <div className="max-w-4xl mx-auto px-5">
        <div className="h-16 flex items-center justify-between relative">
          {/* Close button */}
          <button 
            type="button"
            onClick={() => window.history.back()}
            className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:bg-muted rounded-full transition-all"
          >
            <span className="text-2xl font-light">×</span>
          </button>

          {/* Title */}
          <span className="absolute left-1/2 -translate-x-1/2 text-[18px] font-black text-[#111827]">
            إضافة إعلان
          </span>

          {/* Step Indicator */}
          <div className="flex items-center gap-1 bg-[#F3F4F6] px-3 py-1 rounded-full border border-[#E5E7EB]">
            <span className="text-[14px] font-[900] text-[#3B5897] leading-none">
              {step}
            </span>
            <span className="text-[12px] font-bold text-[#9CA3AF] leading-none">
              / {totalSteps}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Line */}
      <div className="h-[6px] w-full bg-[#E5E7EB] overflow-hidden relative">
        <div
          className="absolute inset-y-0 right-0 bg-[#3B5897] transition-all duration-700 ease-out rounded-l-full"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
}

export function Title({ label }: { label: string }) {
  return (
    <h2 className="text-[22px] md:text-2xl font-black text-right mb-8 tracking-tighter text-[#1F2937] leading-tight">
      {label}
    </h2>
  );
}

export function Opt({
  label,
  selected,
  onClick,
  sub,
}: {
  label: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  sub?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full p-5 rounded-[22px] border-2 flex items-center justify-between transition-all duration-300 group active:scale-[0.98] text-right",
        selected
          ? "border-[#3B5897] bg-[#3B5897]/5 text-[#3B5897] shadow-[0_10px_25px_-5px_rgba(59,88,151,0.1)]"
          : "border-[#F3F4F6] bg-white text-[#111827] hover:border-[#3B5897]/20 shadow-sm"
      )}
    >
      <div className="flex flex-col gap-0.5">
        <div className="font-bold text-[17px] tracking-tight">
          {label}
        </div>
        {sub && (
          <div className="text-[13px] text-[#6B7280] font-medium leading-relaxed">{sub}</div>
        )}
      </div>
      <div
        className={cn(
          "w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-all duration-300",
          selected
            ? "bg-[#3B5897] border-[#3B5897] text-white"
            : "border-[#E5E7EB] group-hover:border-[#3B5897]/30"
        )}
      >
        {selected && <Check className="w-4 h-4 stroke-[3px]" />}
      </div>
    </button>
  );
}
