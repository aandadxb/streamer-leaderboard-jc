import React from "react";
import { HERO_FALLBACKS } from "@/lib/hero-config";

interface HeroBannerProps {
  bannerUrl?: string;
  streamerUrl?: string;
  caption?: string;
  mainText?: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  bannerUrl = HERO_FALLBACKS.bannerUrl,
  streamerUrl = HERO_FALLBACKS.streamerImageUrl,
  caption = HERO_FALLBACKS.caption,
  mainText = HERO_FALLBACKS.mainText,
}) => (
  <section className="w-full">
    <div
      className="md:hidden relative w-full h-[214px] sm:h-[260px] rounded-[16px] border border-white/10 shadow-2xl z-20 bg-brand-dark"
      style={{ clipPath: "inset(-200px 0px 0px 0px round 16px)" }}
    >
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-right rounded-[16px] overflow-hidden"
        style={{ backgroundImage: `url("${bannerUrl}")` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/60 to-brand-dark/20" />
      </div>

      <img
        src={streamerUrl}
        alt="Streamer"
        className="absolute bottom-[-58px] sm:bottom-[-68px] right-[-150px] sm:right-[-170px] z-30 pointer-events-none w-auto object-cover object-top drop-shadow-2xl h-[295px] sm:h-[355px]"
      />

      <div className="absolute bottom-0 left-0 p-4 z-40 pointer-events-none w-[52%] xs:w-[54%] sm:w-[50%] max-w-[300px]">
        <span className="font-hero font-medium text-white/90 text-sm sm:text-base tracking-wide leading-tight block mb-1 whitespace-normal break-words [overflow-wrap:anywhere]">
          {caption}
        </span>
        <h1 className="font-hero font-bold text-[19px] xs:text-[22px] leading-[1.05] sm:text-[26px] text-brand-gold uppercase drop-shadow-lg whitespace-normal break-words [overflow-wrap:anywhere]">
          {mainText}
        </h1>
      </div>
    </div>

    <div
      className="hidden md:block relative w-full h-[320px] lg:h-[400px] rounded-[24px] border border-white/10 shadow-2xl z-20 bg-brand-dark"
      style={{ clipPath: "inset(-200px 0px 0px 0px round 24px)" }}
    >
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center rounded-[24px] overflow-hidden"
        style={{ backgroundImage: `url("${bannerUrl}")` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/60 to-transparent" />
      </div>

      <img
        src={streamerUrl}
        alt="Streamer"
        className="absolute right-[-45%] lg:right-[-4%] bottom-[-40px] lg:bottom-[-14%] z-30 pointer-events-none w-auto object-cover object-top h-[460px] lg:h-[560px]"
      />

      <div className="absolute inset-y-0 left-0 flex flex-col justify-end items-start text-left p-8 lg:pl-12 xl:pl-16 lg:pb-12 z-40 pointer-events-none w-[45%] lg:w-[44%] xl:w-[43%]">
        <span className="font-hero font-medium text-white/90 mb-2 tracking-wide leading-tight max-w-full whitespace-normal break-words [overflow-wrap:anywhere]">
          {caption}
        </span>
        <h1 className="font-hero font-bold text-2xl lg:text-[32px] xl:text-[40px] 2xl:text-5xl leading-[1.2] text-brand-gold uppercase drop-shadow-lg max-w-full lg:max-w-[330px] xl:max-w-[410px] 2xl:max-w-[470px] whitespace-normal break-words [overflow-wrap:anywhere]">
          {mainText}
        </h1>
      </div>
    </div>
  </section>
);
