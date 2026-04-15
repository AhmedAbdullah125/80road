'use client';

import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { ThemeToggle } from './ThemeToggle';
import { Logo } from '@/shared/components/Logo';
import { CountryPicker } from '@/features/home/components/CountryPicker';

const NotificationBell = dynamic(
  () => import('@/features/notifications/components/NotificationBell').then(mod => mod.NotificationBell),
  { ssr: false, loading: () => <div className="w-9 h-9" /> }
);

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
}

export function AppHeader({ title, showBack = false }: AppHeaderProps) {
  const router = useRouter();

  return (
    <header className="w-full bg-[#f5f8fa] flex flex-col relative h-[140px]">
      {/* Title - Center Top */}
      <div className="absolute left-1/2 -translate-x-1/2 top-4">
        <h1 className="text-[22px] font-bold text-[#3E689B]">الرئيسية</h1>
      </div>

      {/* Bell - Visually Left in RTL (end-4) */}
      <div className="absolute end-4 top-4">
        <NotificationBell />
      </div>

      {/* Theme Toggle (Moon) - Visually Left, Below Bell */}
      <div className="absolute end-4 top-[64px]">
        <div className="w-9 h-9 rounded-full bg-[#F3F6FA] flex items-center justify-center text-[#3E689B]">
          <ThemeToggle />
        </div>
      </div>

      {/* Country Picker - Visually Right in RTL (start-4) */}
      <div className="absolute start-4 top-[56px] text-right">
        <CountryPicker />
      </div>
    </header>
  );
}
