'use client';

import * as React from 'react';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, ChevronRight } from 'lucide-react';
import { useCountries, useStates, useCities } from '@/shared/hooks/useLocation';
import { useCategoriesAppearInFilter, useSaveFilterHistory } from '@/shared/hooks/useHome';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { CustomImage } from '@/shared/components/custom-image';
import { useUIStore } from '@/stores/ui.store';
import { useUserStore } from '@/stores/user.store';

/**
 * QUICK START PAGE - 1:1 PIXEL PERFECT MOBILE REPLICATION
 * FINAL PARITY ADJUSTMENTS:
 * - Card Width: exactly 76.4% of viewport width.
 * - Spacing: Padded card with bottom-anchored buttons.
 * - Typography: Tajawal 700/Bold for titles.
 */

function QuickStartContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = React.useState(1);
  
  const [userName, setUserName] = React.useState('');
  const [selectedCountryId, setSelectedCountryId] = React.useState<number | null>(null);
  const [selectedStateId, setSelectedStateId] = React.useState<number | null>(null);
  const [selectedCityId, setSelectedCityId] = React.useState<number | null>(null);
  const [selectedCategoryValues, setSelectedCategoryValues] = React.useState<number[]>([]);

  const { data: countries, isLoading: loadingCountries } = useCountries();
  const { data: states, isLoading: loadingStates } = useStates(selectedCountryId || undefined);
  const { data: cities, isLoading: loadingCities } = useCities(selectedStateId || undefined);
  const { data: filters, isLoading: loadingFilters } = useCategoriesAppearInFilter();
  
  const saveFilterMutation = useSaveFilterHistory();

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const toggleCategoryValue = (id: number) => {
    setSelectedCategoryValues((prev) => 
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const user = useUserStore((s) => s.user);
  const setPreferences = useUIStore((s) => s.setPreferences);
  const initialPrefs = useUIStore((s) => s.preferences);
  const hasHydrated = React.useRef(false);

  React.useEffect(() => {
    if (searchParams.get('mode') === 'edit' && !hasHydrated.current) {
        if (user?.name) setUserName(user.name);
        if (initialPrefs) {
            if (initialPrefs.countryId) setSelectedCountryId(initialPrefs.countryId);
            if (initialPrefs.stateId) setSelectedStateId(initialPrefs.stateId);
            if (initialPrefs.cityId) setSelectedCityId(initialPrefs.cityId);
            if (initialPrefs.categoryValues) setSelectedCategoryValues(initialPrefs.categoryValues);
            setStep(2); 
        }
        hasHydrated.current = true;
    }
  }, [initialPrefs, searchParams, user]);

  const onFinalSubmit = () => {
    if (!selectedStateId || !selectedCityId) {
      toast.error('يرجى اختيار المنطقة والمدينة');
      return;
    }
    const stateName = states?.find(s => s.id === selectedStateId)?.name || '';
    const cityName = cities?.find(c => c.id === selectedCityId)?.name || '';
    
    setPreferences({
      propertyType: '',
      area: cityName || stateName,
      purpose: 'للإيجار',
      countryId: selectedCountryId || undefined,
      stateId: selectedStateId || undefined,
      cityId: selectedCityId || undefined,
      categoryValues: selectedCategoryValues,
    });

    router.push('/');
    saveFilterMutation.mutate({
      state_id: selectedStateId,
      city_id: selectedCityId,
      category_values_ids: selectedCategoryValues,
      name: userName,
    });
  };

  const stepsCount = 5;

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <>
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700 pt-8">
                <div className="text-center space-y-3 mb-4">
                    <h1 className="text-[31.2px] font-bold text-[#3E689B] leading-[40px] tracking-tight">مرحباً بك 👋</h1>
                    <p className="text-[18.2px] leading-[28px] text-[#9CA3AF] font-normal px-2">الرجاء إدخال اسمك لنبدأ</p>
                </div>
                <div className="relative pt-4">
                    <div className="p-[2px] rounded-[24px] bg-white border border-[#3E689B]/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                         <Input
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="الاسم الكامل"
                            className="h-[64px] px-[24px] rounded-[22px] border-2 border-[#3E689B] text-[26px] font-bold text-center bg-white text-[#3E689B] placeholder:text-[#9CA3AF]/30 focus-visible:ring-0 transition-all focus:border-[#3E689B]"
                            autoFocus
                        />
                    </div>
                </div>
            </div>
            <div className="mt-auto pt-10">
              <Button 
                  className={cn(
                    "w-full h-[56px] rounded-[14px] font-bold text-[18px] transition-all active:scale-[0.98]",
                    userName.trim() 
                      ? "bg-[#3E689B] text-white shadow-[0_15px_30px_-5px_rgba(62,104,155,0.25)] hover:bg-[#3E689B]/95" 
                      : "bg-[#E5E7EB] text-white cursor-not-allowed"
                  )}
                  onClick={handleNext}
                  disabled={!userName.trim()}
              >
                  التالي
              </Button>
            </div>
          </>
        );
      case 2:
      case 3:
      case 4:
      case 5:
        return (
          <div className="flex-1 flex flex-col pt-2">
             {(() => {
                if (step === 2) return (
                  <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                    <div className="text-center space-y-2">
                      <h2 className="text-[24px] font-bold text-[#3E689B]">اختر بلدك</h2>
                      <p className="text-[14px] text-[#9CA3AF]">أين تبحث عن عقارك القادم؟</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-1 pb-4 no-scrollbar">
                      {loadingCountries ? (
                         Array(4).fill(0).map((_, i) => <div key={i} className="h-32 rounded-[20px] bg-[#F9FAFB] animate-pulse" />)
                      ) : (
                        countries?.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => { setSelectedCountryId(c.id); handleNext(); }}
                            className={cn(
                              "p-5 rounded-[20px] border-2 transition-all flex flex-col items-center justify-center gap-3 relative group",
                              selectedCountryId === c.id ? "border-[#3E689B] bg-[#3E689B]/5" : "border-[#F3F4F6] bg-[#F3F4F6] hover:border-[#3E689B]/20"
                            )}
                          >
                             <div className="relative w-16 h-16 transition-transform group-active:scale-90">
                                <CustomImage src={c.image} alt={c.name} fill className="object-contain" />
                             </div>
                             <span className="font-bold text-[15px] text-center text-[#3E689B]">{c.name}</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                );
                
                if (step === 3 || step === 4) {
                   const isState = step === 3;
                   const currentData = isState ? states : cities;
                   const currentLoading = isState ? loadingStates : loadingCities;
                   const setter = isState ? setSelectedStateId : setSelectedCityId;
                   const currentSelected = isState ? selectedStateId : selectedCityId;
                   return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                      <div className="text-center space-y-2">
                        <h2 className="text-[24px] font-bold text-[#3E689B]">{isState ? "اختر المنطقة" : "اختر المدينة"}</h2>
                        <p className="text-[14px] text-[#9CA3AF]">{isState ? "في أي محافظة تود البحث؟" : "حدد المدينة المفضلة لديك"}</p>
                      </div>
                      <div className="grid grid-cols-1 gap-3 max-h-[380px] overflow-y-auto pr-1 pb-4 no-scrollbar">
                        {currentLoading ? (
                           Array(5).fill(0).map((_, i) => <div key={i} className="h-14 rounded-[16px] bg-[#F9FAFB] animate-pulse" />)
                        ) : (
                          currentData?.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => { setter(item.id); handleNext(); }}
                              className={cn(
                                "p-4 h-[60px] rounded-[16px] border-2 transition-all text-right font-bold flex items-center justify-between",
                                currentSelected === item.id ? "border-[#3E689B] bg-[#3E689B]/5 text-[#3E689B]" : "border-[#F3F4F6] bg-[#F3F4F6] text-[#3B5897] hover:border-[#3E689B]/20"
                              )}
                            >
                              <span>{item.name}</span>
                              {currentSelected === item.id && <CheckCircle2 className="w-5 h-5 text-[#3E689B]" />}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                   );
                }

                if (step === 5) return (
                   <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                    <div className="text-center space-y-2">
                      <h2 className="text-[24px] font-bold text-[#3E689B]">تفضيلات البحث</h2>
                      <p className="text-[14px] text-[#9CA3AF]">ساعدنا في عرض ما يهمك أولاً</p>
                    </div>
                    <div className="space-y-6 max-h-[320px] overflow-y-auto pr-1 no-scrollbar">
                        {loadingFilters ? (
                            Array(2).fill(0).map((_, i) => <div key={i} className="h-20 bg-[#F9FAFB] rounded-2xl animate-pulse" />)
                        ) : (
                            filters?.map((group) => (
                                <div key={group.id} className="space-y-4">
                                    <h3 className="font-bold text-[16px] text-[#3E689B]">{group.name}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {group.values.map((v) => (
                                            <button
                                                key={v.id}
                                                onClick={() => toggleCategoryValue(v.id)}
                                                className={cn(
                                                    "px-4 py-2 rounded-full border-2 transition-all font-bold text-sm",
                                                    selectedCategoryValues.includes(v.id) 
                                                        ? "border-[#3E689B] bg-[#3E689B] text-white shadow-md shadow-[#3E689B]/20" 
                                                        : "border-[#F3F4F6] bg-[#F3F4F6] text-[#3B5897] hover:border-[#3E689B]/20"
                                                )}
                                            >
                                                {v.value}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="mt-auto pt-4">
                      <Button 
                          className="w-full h-[56px] rounded-[14px] font-bold text-[18px] bg-[#3E689B] text-white shadow-[0_15px_30px_-5px_rgba(62,104,155,0.25)] active:scale-[0.98]"
                          onClick={onFinalSubmit}
                          disabled={saveFilterMutation.isPending}
                      >
                          {saveFilterMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "حفظ وإكمال التصفح"}
                      </Button>
                    </div>
                  </div>
                );
             })()}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-vignette flex flex-col items-center justify-center overscroll-none" dir="rtl">
      {/* 
         CARD WIDTH FIX: 76.4% of viewport width match.
         MAX WIDTH: 430px for larger phones.
      */}
      <div className="w-[76.4%] max-w-[430px] flex flex-col items-center relative h-[620px] isolate">
        {/* Background decorative elements if any - Original site sometimes has subtle circles */}
        <div className="w-full bg-white rounded-[40px] shadow-[0_25px_60px_-15px_rgba(62,104,155,0.12)] border border-[#3E689B]/5 flex flex-col h-full relative z-10 overflow-hidden">
          
          {/* Progress Bar - EXACT Match: top 32px, left/right 12% */}
          <div className="absolute top-[32px] left-[12%] right-[12%] h-[6px] bg-[#E1EAF5] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#3E689B] transition-all duration-700 rounded-full" 
              style={{ width: `${(step / stepsCount) * 100}%` }}
            />
          </div>

          <div className="p-8 flex-1 flex flex-col mt-10">
            {step > 1 && (
              <button 
                onClick={handleBack} 
                className="flex items-center gap-1 text-[#3E689B] font-bold text-sm self-start mb-4 transition-colors hover:text-[#3E689B]/80"
              >
                <ChevronRight className="w-4 h-4" /> العودة
              </button>
            )}

            <div className="flex-1 flex flex-col">
              {renderStep()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuickStartPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-vignette"><Loader2 className="animate-spin text-[#3E689B] w-10 h-10" /></div>}>
        <QuickStartContent />
    </Suspense>
  );
}
