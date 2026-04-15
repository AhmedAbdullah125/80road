'use client';

import { usePathname } from 'next/navigation';
import { DesktopHeader } from './DesktopHeader';
import { BottomNav } from '@/components/BottomNav';
import { AppHeader } from '@/components/AppHeader';
import { Footer } from './Footer';
import { cn } from '@/lib/utils';

interface ResponsiveShellProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  hideShell?: boolean;
  hideHeader?: boolean;
  hideFooter?: boolean;
}

/**
 * ResponsiveShell (Top Nav Paradigm)
 *
 * Mobile  (<md)  → AppHeader + BottomNav (phone shell).
 * Desktop (≥md)  → Full-width top header, content centered in container mx-auto px-4 md:px-8.
 */
export function ResponsiveShell({
  children,
  title = '80road',
  showBack = false,
  hideShell = false,
  hideHeader = false,
  hideFooter = false,
}: ResponsiveShellProps) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth') || pathname === '/otp' || pathname?.startsWith('/quick-start') || pathname?.startsWith('/post-ad');
  const isAdPage = pathname?.startsWith('/ad') && !pathname?.startsWith('/post-ad');
  const isExplorePage = pathname?.startsWith('/explore');

  const shouldHideHeader = hideShell || hideHeader || isAuthPage || isAdPage || isExplorePage;
  const shouldHideFooter = hideShell || hideFooter || isAuthPage;

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      {/* ── Desktop navigation (hidden on mobile) ── */}
      {!shouldHideHeader && (
        <div className="hidden md:block">
          <DesktopHeader />
        </div>
      )}

      {/* ── Mobile-only top header (force hidden on desktop) ── */}
      {/* padding-top = safe-area-inset-top accounts for the notch / Dynamic Island / status bar */}
      {!shouldHideHeader && (
        <div className="block md:hidden sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
          <AppHeader title={title} showBack={showBack} />
        </div>
      )}

      {/* ── Main Content Area ── */}
      <main
        className={cn(
          "flex-1 relative w-full",
          // Desktop: padding top for fixed header (72px height + extra breathing room)
          !shouldHideHeader && "md:pt-24",
          // Mobile: padding bottom for fixed nav
          !shouldHideFooter && "pb-20 md:pb-0"
        )}
      >
        {children}
      </main>

      {/* ── Global Footer (Hidden on Mobile) ── */}
      {!shouldHideFooter && (
        <div className="hidden md:block">
          <Footer />
        </div>
      )}

      {/* ── Mobile-only bottom nav (hidden on desktop) ── */}
      <div className={cn(
        "md:hidden fixed bottom-1/2 translate-y-1/2 pointer-events-none z-0", // anchor point
        "md:relative md:inset-0 md:translate-y-0"
      )}>
        {/* Placeholder to reserve space if needed, though BottomNav is fixed */}
      </div>

      {/* padding-bottom = safe-area-inset-bottom accounts for the iOS home indicator
          and Android gesture navigation bar so nav items are not obscured */}
      {!shouldHideFooter && (
        <div className="md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <BottomNav />
        </div>
      )}
    </div>
  );
}
