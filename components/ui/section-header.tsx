import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionHeaderProps {
  id?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({
  id,
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-1 text-right mb-6", className)} dir="rtl">
      <h2 id={id} className="text-[20px] font-bold text-[#374151]">
        {title}
      </h2>
      {description && (
        <p className="text-[13px] text-[#9CA3AF] max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
