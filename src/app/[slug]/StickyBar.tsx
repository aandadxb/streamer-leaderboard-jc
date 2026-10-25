'use client'
import { useState, useEffect } from 'react';
import { PrimaryButton } from '../components/PrimaryButton';

interface StickyBarProps {
  joinHref: string;
  loginHref: string;
}

export function StickyBar({ joinHref, loginHref }: StickyBarProps) {
  const [showSticky, setShowSticky] = useState(true);

  useEffect(() => {
    const target = document.getElementById('mobile-inline-buttons');
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { rootMargin: '0px', threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`lg:hidden fixed bottom-0 left-0 right-0 w-full h-14 px-4 z-50 flex items-center justify-center gap-3 bg-brand-dark/95 backdrop-blur-md border-t border-white/10 transition-transform duration-300 ${showSticky ? 'translate-y-0' : 'translate-y-full'}`}>
      <a href={loginHref} className="h-9 w-[61px] rounded-[4px] bg-[#121212] text-brand-gold text-[12px] border border-brand-gold shadow-lg inline-flex items-center justify-center">Log In</a>
      <PrimaryButton href={joinHref} className="h-9 w-20 text-[12px] shadow-lg">Join Now</PrimaryButton>
    </div>
  );
}
