import React from "react";
import { FormField, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Title, Opt } from "./shared";
import { CustomImage as Image } from "@/shared/components/custom-image";
import { VideoUploadPreview, ImageUploadGrid } from "@/features/post-ad/components/MediaPreview";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function WizardStepsRenderer({ currentStepInfo, form, handleUpdate, sel, countries, states, cities, categories, settings, uploadState, uploadVideo, resetVideoUpload, published, processing, categorySelections }: any) {
  // Only keep the watches that are used outside of the summary (for location fields)
  const watchedCountry = form.watch("country");
  const watchedGovernorate = form.watch("governorate");
  const watchedArea = form.watch("area");
  const watchedPrice = form.watch("price");

  return (
    <>
      {currentStepInfo.type === "category" && (
        <FormField
          control={form.control}
          name={`category_values_ids.${currentStepInfo.data.id}`}
          render={({ field }) => (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Title label={currentStepInfo.data.name} />
              {(currentStepInfo.data.type === "select" || currentStepInfo.data.type === "boolean") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {currentStepInfo.data.values.map((v: any) => (
                    <Opt key={v.id} label={v.value} selected={field.value === v.id} onClick={() => sel(field.name, v.id)} />
                  ))}
                </div>
              )}
              {currentStepInfo.data.type === "number" && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                    <button
                      type="button"
                      key={n}
                      onClick={() => sel(field.name, n)}
                      className={cn(
                        "aspect-square rounded-[18px] border-2 flex items-center justify-center text-[20px] font-[900] transition-all active:scale-95",
                        field.value === n 
                          ? "bg-[#3B5897] text-white border-[#3B5897] shadow-lg shadow-[#3B5897]/20" 
                          : "bg-white border-[#F3F4F6] text-[#111827] hover:border-[#3B5897]/20"
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              )}
              {currentStepInfo.data.type === "range" && (
                <div className="flex flex-col items-center justify-center gap-10 py-12 bg-white rounded-[32px] border border-[#F3F4F6] shadow-sm">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[56px] font-[900] text-[#3B5897] tracking-tighter">{field.value || 50}</span>
                    <span className="text-[18px] text-[#9CA3AF] font-[900]">م²</span>
                  </div>
                  <input
                    type="range" min="50" max="2000" step="5"
                    value={field.value || 50}
                    onChange={(e) => handleUpdate(field.name, parseInt(e.target.value))}
                    className="w-4/5 accent-[#3B5897] h-2 rounded-lg appearance-none cursor-pointer bg-[#F3F4F6]"
                  />
                  <div className="flex justify-between w-4/5 text-[12px] text-[#9CA3AF] font-bold" dir="rtl">
                    <span>50 م²</span><span>1000 م²</span><span>2000 م²</span>
                  </div>
                </div>
              )}
              <FormMessage className="text-center font-black mt-4" />
            </div>
          )}
        />
      )}

      {currentStepInfo.type === "country" && (
        <FormField control={form.control} name="country" render={({ field }) => (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Title label="الدولة" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {countries?.map((c: any) => (
                <Opt key={c.id} label={<span className="flex items-center gap-3"><Image src={c.image} width={32} height={20} alt={c.name} className="rounded-sm object-cover" />{c.name}</span>} selected={field.value === c.id} onClick={() => { handleUpdate("governorate", ""); handleUpdate("area", ""); sel("country", c.id); }} />
              ))}
            </div>
            <FormMessage className="text-center font-black mt-4" />
          </div>
        )} />
      )}

      {currentStepInfo.type === "state" && (
        <FormField control={form.control} name="governorate" render={({ field }) => (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Title label="المحافظة / الولاية" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {states?.map((o: any) => (
                <Opt key={o.id} label={o.name} selected={field.value === o.id} onClick={() => { handleUpdate("area", ""); sel("governorate", o.id); }} />
              ))}
              {(!states || states.length === 0) && <div className="col-span-full py-20 text-center text-muted-foreground font-bold">لا يوجد محافظات متوفرة لهذه الدولة</div>}
            </div>
            <FormMessage className="text-center font-black mt-4" />
          </div>
        )} />
      )}

      {currentStepInfo.type === "city" && (
        <FormField control={form.control} name="area" render={({ field }) => (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Title label="المنطقة / المدينة" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 h-[400px] md:h-auto overflow-y-auto no-scrollbar pb-10 text-right" dir="rtl">
              {cities?.map((o: any) => (
                <Opt key={o.id} label={o.name} selected={field.value === o.id} onClick={() => sel("area", o.id)} />
              ))}
              {(!cities || cities.length === 0) && <div className="col-span-full py-20 text-center text-muted-foreground font-bold">لا يوجد مدن متوفرة لهذه المحافظة</div>}
            </div>
            <FormMessage className="text-center font-black mt-4" />
          </div>
        )} />
      )}

      {currentStepInfo.type === "video" && (
        <FormField control={form.control} name="video" render={({ field }) => (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Title label="ارفع فيديو" />
            <VideoUploadPreview
              file={field.value instanceof File ? field.value : null}
              uploadStatus={uploadState?.status ?? 'idle'}
              uploadProgress={uploadState?.progress ?? 0}
              serverPath={uploadState?.serverPath ?? null}
              uploadError={uploadState?.error ?? null}
              onFileChange={(file) => {
                handleUpdate("video", file);
                uploadVideo(file).catch(() => {});
              }}
              onRemove={() => { handleUpdate("video", null); resetVideoUpload(); }}
            />
          </div>
        )} />
      )}

      {currentStepInfo.type === "images" && (
        <FormField control={form.control} name="images" render={({ field }) => (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Title label="ارفع صور العقار" />
            <ImageUploadGrid images={field.value || []} onChange={(imgs) => handleUpdate("images", imgs)} />
          </div>
        )} />
      )}

      {currentStepInfo.type === "details" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" dir="rtl">
          <Title label="تفاصيل الإعلان" />
          <div className="flex flex-col gap-6">
            <FormField control={form.control} name="price" render={({ field }) => (
              <div className="flex flex-col gap-3">
                <FormLabel className="text-[14px] font-[900] text-[#111827] flex justify-between">السعر (د.ك) <span className="text-red-500 font-bold">*</span></FormLabel>
                <FormControl><Input {...field} type="number" min="1" placeholder="0.00" className="h-[56px] rounded-[18px] border-2 border-[#F3F4F6] bg-[#F9FAFB] text-[20px] font-[900] text-[#3B5897] focus-visible:border-[#3B5897] transition-all px-6" /></FormControl>
                <FormMessage />
              </div>
            )} />
            <FormField control={form.control} name="title" render={({ field }) => (
              <div className="flex flex-col gap-3">
                <FormLabel className="text-[14px] font-[900] text-[#9CA3AF]">عنوان الإعلان (اختياري)</FormLabel>
                <FormControl><Input {...field} placeholder="مثال: شقة للإيجار في السالمية" className="h-[56px] rounded-[18px] border-2 border-[#F3F4F6] text-[16px] font-bold text-[#111827] focus-visible:border-[#3B5897] transition-all px-6" /></FormControl>
                <FormMessage />
              </div>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <div className="flex flex-col gap-3">
                <FormLabel className="text-[14px] font-[900] text-[#9CA3AF]">وصف الإعلان (اختياري)</FormLabel>
                <FormControl><textarea {...field} rows={6} placeholder="اكتب وصفاً تفصيلياً للعقار..." className="w-full rounded-[22px] border-2 border-[#F3F4F6] bg-[#F9FAFB] px-6 py-4 text-[16px] font-medium resize-none outline-none focus:border-[#3B5897] transition-all text-[#111827]" /></FormControl>
                <FormMessage />
              </div>
            )} />
          </div>
        </div>
      )}

      {currentStepInfo.type === "summary" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-right" dir="rtl">
          <Title label="ملخص الإعلان" />
          <div className="bg-white rounded-[28px] p-6 shadow-[0_15px_40px_-10px_rgba(59,88,151,0.08)] border border-[#F3F4F6] mb-8 text-base flex flex-col gap-4">
            {categories.map((cat: any) => {
              // Use categorySelections (plain React state) — reliable regardless of RHF subscription issues
              const val = (categorySelections || {})[String(cat.id)];
              let displayVal: React.ReactNode = "—";

              // If the category has a values list, look up the selected option by ID
              if (cat.values && cat.values.length > 0) {
                const found = cat.values.find((v: any) => String(v.id) === String(val));
                displayVal = found ? (found.value || found.name || String(val)) : (val !== undefined && val !== null ? String(val) : "—");
              } else if (cat.type === "range") {
                displayVal = `${val !== undefined && val !== null ? val : 50} م²`;
              } else {
                // number or any other type — show raw value
                displayVal = (val !== undefined && val !== null && val !== "") ? String(val) : "—";
              }

              return (
                <div key={cat.id} className="flex justify-between items-center border-b border-border/50 pb-3 last:border-0 last:pb-0">
                  <span className="text-muted-foreground font-bold">{cat.name}</span>
                  <span className="font-black text-foreground text-lg">{displayVal}</span>
                </div>
              );
            })}
            <div className="flex justify-between items-center border-b border-border/50 pb-3">
              <span className="text-muted-foreground font-bold">الدولة</span>
              <span className="font-black text-foreground text-lg">{countries?.find((c: any) => String(c.id) === String(watchedCountry))?.name || "—"}</span>
            </div>
            <div className="flex justify-between items-center border-b border-border/50 pb-3">
              <span className="text-muted-foreground font-bold">المحافظة</span>
              <span className="font-black text-foreground text-lg">{states?.find((s: any) => String(s.id) === String(watchedGovernorate))?.name || "—"}</span>
            </div>
            <div className="flex justify-between items-center border-b border-border/50 pb-3">
              <span className="text-muted-foreground font-bold">المنطقة</span>
              <span className="font-black text-foreground text-lg">{cities?.find((c: any) => String(c.id) === String(watchedArea))?.name || "—"}</span>
            </div>
            <div className="flex justify-between items-center border-b border-border/50 pb-3">
              <span className="text-muted-foreground font-bold">السعر</span>
              <span className="font-black text-foreground text-lg">{watchedPrice ? `${watchedPrice} د.ك` : "—"}</span>
            </div>
            <div className="mt-4 pt-6 border-t border-dashed border-[#E5E7EB] flex flex-col gap-3">
              <div className="flex justify-between items-center bg-[#F9FAFB] p-5 rounded-[20px] border border-[#F3F4F6]">
                <span className="font-bold text-[#111827]">قيمة النشر</span>
                <span className="text-[22px] font-[900] text-[#3B5897]">{settings?.publish_ad_fees ? `${settings.publish_ad_fees} د.ك` : '5 د.ك'}</span>
              </div>
            </div>
          </div>
          {published && (
            <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 text-white shadow-lg shadow-green-500/20">
                <Check className="w-12 h-12 stroke-[4px]" />
              </div>
              <h3 className="text-2xl md:text-xl font-black mb-3">تم النشر بنجاح!</h3>
              <p className="text-muted-foreground text-base max-w-xs text-center leading-relaxed">جاري التوجيه إلى حسابك لإدارة الإعلان...</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
