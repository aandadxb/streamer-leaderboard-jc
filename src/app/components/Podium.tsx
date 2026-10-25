'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Player } from '../types';
import { RankBadge } from './RankBadge';

interface PodiumProps {
  topPlayers: Player[];
  usePoints?: boolean;
  prizes?: {
    1?: string;
    2?: string;
    3?: string;
  };
}

export const Podium: React.FC<PodiumProps> = ({
  topPlayers,
  usePoints = false,
  prizes = {}
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const rank1Ref = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(1);

  const updateScrollState = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const children = Array.from(container.children) as HTMLElement[];
    const center = container.scrollLeft + container.offsetWidth / 2;
    let closest = 0;
    let minDist = Infinity;
    children.forEach((child, i) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const dist = Math.abs(center - childCenter);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    setActiveIndex(closest);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener('scroll', updateScrollState, { passive: true });
    return () => container.removeEventListener('scroll', updateScrollState);
  }, [updateScrollState]);

  const desktopOrder = [
    topPlayers.find((p) => p.rank === 2),
    topPlayers.find((p) => p.rank === 1),
    topPlayers.find((p) => p.rank === 3),
  ].filter((p): p is Player => p !== undefined);

  const mobileOrder = [
    topPlayers.find((p) => p.rank === 2),
    topPlayers.find((p) => p.rank === 1),
    topPlayers.find((p) => p.rank === 3),
  ].filter((p): p is Player => p !== undefined);
  const rank1MobileIndex = mobileOrder.findIndex((player) => player.rank === 1);

  useEffect(() => {
    const container = scrollRef.current;
    const rank1El = rank1Ref.current;
    if (!container || !rank1El || rank1MobileIndex === -1) return;

    const frame = requestAnimationFrame(() => {
      container.scrollLeft = rank1El.offsetLeft - container.offsetWidth / 2 + rank1El.offsetWidth / 2;
      setActiveIndex(rank1MobileIndex);
    });

    return () => cancelAnimationFrame(frame);
  }, [rank1MobileIndex]);

  const getBorderWrapperClass = (rank: number) => {
    if (rank === 1) return 'shadow-[0_4px_20px_rgba(251,227,163,0.6)]';
    return '';
  };

  const getAmountBorderClass = (rank: number) => {
    if (rank === 1) return 'border-[#FBE3A3]';
    if (rank === 2) return 'border-[#94A3B8]';
    return 'border-[#D3A48B]';
  };

  const amountLabel = usePoints ? 'Points' : 'Wagered';
  const formatPodiumAmount = (val: number) => {
    if (usePoints) return new Intl.NumberFormat('en-US').format(Math.round(val * 5));
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
  };

  const PodiumCard = ({ player }: { player: Player }) => {
    const isFirst = player.rank === 1;
    const widthClass = isFirst ? 'w-full max-w-[320px]' : 'w-full max-w-[240px]';
    const prizeText = prizes[player.rank as 1 | 2 | 3];
    const hasPrize = !!prizeText;

    return (
      <div className={`flex flex-col items-center ${widthClass} transition-all duration-300`}>
        <div className={`flex justify-center items-center pointer-events-none z-20 ${isFirst ? 'w-[70%]' : 'w-[70%]'}`}>
          <RankBadge rank={player.rank as 1 | 2 | 3} className={player.rank !== 1 ? 'translate-y-[30px] md:translate-y-0' : ''} />
        </div>

        <div className={`w-full rounded-[48px] z-10 ${getBorderWrapperClass(player.rank)} ${isFirst ? `-mt-[70px] md:-mt-[70px] ${hasPrize ? 'h-[215px] md:h-[260px]' : 'h-[185px] md:h-[240px]'}` : `-mt-[60px] md:-mt-[60px] ${hasPrize ? 'h-[210px] md:h-[250px]' : 'h-[155px] md:h-[200px]'}`}`}>
          <div className={`flex flex-col items-center justify-end w-full h-full px-7 md:px-8 rounded-[47px] bg-white/[0.03] shadow-[inset_0_2.27px_2.27px_0_rgba(255,255,255,0.15),inset_0_0_34.01px_0_rgba(255,255,255,0.05)] ${isFirst ? 'pb-4 md:pb-8' : 'pb-3 md:pb-7'}`}>

            <span className="font-hero font-medium text-surface-variant tracking-[0.1em] mb-1 md:mb-2 text-[10px] md:text-[12px] uppercase opacity-60 w-full text-center">
              {player.username}
            </span>

            {prizeText && (
              <div className="mb-4 w-full px-1">
                <div className={`flex items-center justify-center py-2 rounded-lg border text-center transition-all duration-300 ${isFirst ? 'bg-brand-gold/5 border-brand-gold/40 shadow-[0_0_15px_rgba(251,227,163,0.1)]' : 'bg-white/[0.03] border-white/10'}`}>
                  <span className={`font-hero font-bold text-[9px] md:text-[10px] tracking-[0.18em] uppercase truncate px-2 ${isFirst ? 'text-brand-gold' : 'text-brand-offwhite/50'}`}>
                    {prizeText}
                  </span>
                </div>
              </div>
            )}

            <div className={`w-full rounded-lg border-[0.9px] ${getAmountBorderClass(player.rank)}`} style={{ background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.16) -7.84%, rgba(255, 255, 255, 0) 109.62%)', backdropFilter: 'blur(5.41px)', WebkitBackdropFilter: 'blur(5.41px)' }}>
              <div className="rounded-[calc(0.5rem-0.9px)] px-1 sm:px-2 py-2 md:py-4 text-center w-full flex flex-col gap-0 md:gap-1">
                <span className="font-hero font-bold md:font-medium text-[10px] md:text-base text-white tracking-widest md:tracking-normal leading-tight">
                  {amountLabel}
                </span>
                <span className={`font-hero font-bold text-[16px] sm:text-[18px] ${isFirst ? 'md:text-[32px]' : 'md:text-[20px]'} tabular-nums whitespace-nowrap leading-tight text-brand-gold`}>
                  {formatPodiumAmount(player.wagered)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full relative flex flex-col items-center z-10">
      <div className="absolute top-[58%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 rounded-full w-[520px] max-w-[80vw] h-[190px] bg-[#FFC000]/10 blur-[120px]" />

      <div className="hidden md:flex items-end justify-center gap-4 pt-8 pb-8 relative z-10 w-full">
        {desktopOrder.map((player) => <PodiumCard key={player.id} player={player} />)}
      </div>

      <div ref={scrollRef} className="md:hidden relative z-10 flex items-end w-[100vw] -mx-4 gap-3 pt-4 pb-9 overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden px-[12.5vw]">
        {mobileOrder.map((player) => (
          <div key={player.id} ref={player.rank === 1 ? rank1Ref : undefined} className="snap-center shrink-0 flex justify-center w-[75vw]">
            <PodiumCard player={player} />
          </div>
        ))}
      </div>

      <div className="flex md:hidden items-center justify-center gap-2 mt-2">
        {mobileOrder.map((_, index) => (
          <div key={index} className={`rounded-full transition-all duration-300 ${index === activeIndex ? 'w-2 h-2 bg-white/80' : 'w-1.5 h-1.5 bg-white/20'}`} />
        ))}
      </div>
    </div>
  );
};
