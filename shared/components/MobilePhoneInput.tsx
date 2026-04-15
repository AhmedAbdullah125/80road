'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useCountries } from '../hooks/useCountries';
import { Country } from '../types/country';
import { CustomImage } from './custom-image';

interface MobilePhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onCountryChange?: (countryId: number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  defaultCountry?: string;
}

export function MobilePhoneInput({
  value = '',
  onChange,
  onCountryChange,
  placeholder,
  className,
  disabled,
  defaultCountry = 'KW',
}: MobilePhoneInputProps) {
  const { data: countries, isLoading } = useCountries();
  const [open, setOpen] = React.useState(false);
  const [selectedCountryId, setSelectedCountryId] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (countries && !selectedCountryId) {
       if (value) {
         const country = countries.find(c => {
           const clean = c.phone_code.replace('+', '');
           return value.startsWith(`+${clean}`);
         });
         if (country) {
           setSelectedCountryId(country.id);
           onCountryChange?.(country.id);
           return;
         }
       }
       
       const defaultC = countries.find(c => c.country_code === defaultCountry) || countries[0];
       if (defaultC) {
         setSelectedCountryId(defaultC.id);
         onCountryChange?.(defaultC.id);
       }
    }
  }, [countries, selectedCountryId, defaultCountry, value, onCountryChange]);

  const selectedCountry = React.useMemo(() => {
    return countries?.find(c => c.id === selectedCountryId) || null;
  }, [countries, selectedCountryId]);

  const cleanPhoneCode = React.useMemo(() => {
    return selectedCountry?.phone_code?.replace('+', '') || '';
  }, [selectedCountry]);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountryId(country.id);
    onCountryChange?.(country.id);
    setOpen(false);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '');
    onChange?.(input);
  };

  const displayValue = value.replace(/\D/g, '');

  return (
    <div className={cn('flex items-center w-full bg-[#F3F4F6] rounded-[16px] h-[56px] px-4 gap-0', className)} dir="ltr">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-1 h-full outline-none focus:bg-gray-200/50 rounded-lg px-2 transition-colors shrink-0"
            disabled={disabled || isLoading}
          >
            {selectedCountry ? (
               <div className="flex items-center gap-2 font-bold text-[#3B5897] text-[16px]">
                  <span className="opacity-80 uppercase">{selectedCountry.country_code}</span>
                  <span className="font-extrabold">+{cleanPhoneCode}</span>
               </div>
            ) : isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-[#3B5897]" />
            ) : (
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 text-[#3B5897]" />
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="ابحث عن دولة..." className="text-right" dir="rtl" />
            <CommandList>
              <ScrollArea className="h-72">
                <CommandEmpty>لم يتم العثور على نتائج.</CommandEmpty>
                <CommandGroup>
                  {countries?.map((country) => (
                    <CommandItem
                      key={country.id}
                      value={`${country.name} ${country.phone_code} ${country.country_code}`}
                      onSelect={() => handleCountrySelect(country)}
                      className="gap-2 flex-row-reverse text-right"
                    >
                      <div className="relative w-6 h-4 overflow-hidden rounded-sm bg-muted shrink-0">
                        <CustomImage
                          src={country.image}
                          alt={country.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="flex-1 text-sm font-black">{country.name}</span>
                       <span className="text-xs text-muted-foreground font-black" dir="ltr">
                        +{country.phone_code.replace('+', '')}
                      </span>
                      <Check
                        className={cn(
                          'ml-auto h-4 w-4',
                          selectedCountry?.id === country.id ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Vertical Divider - EXACT Match */}
      <div className="w-[1.5px] h-[24px] bg-gray-300/60 mx-3" />

      <input
        type="tel"
        placeholder={placeholder}
        value={displayValue}
        onChange={handlePhoneChange}
        disabled={disabled}
        className="flex-1 bg-transparent border-none outline-none font-bold text-[20px] text-[#3B5897] placeholder:text-gray-300 placeholder:font-normal"
        dir="ltr"
      />
    </div>
  );
}
