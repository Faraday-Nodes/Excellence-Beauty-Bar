"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-[0.02em] text-[#5a3b26] sm:text-6xl md:text-8xl">
              EXCELLENCE
              <br />
              BEAUTY BAR
            </h1>
            <p className="font-script mx-auto mt-4 max-w-xl bg-gradient-to-r from-[#d8a75b] via-[#b07c3f] to-[#7d4e22] bg-clip-text pr-3 text-3xl leading-none text-transparent md:text-5xl">
              where beauty meets excellence
            </p>
            <p className="mx-auto mt-6 max-w-xl text-lg text-[#a3785a]">
              Waxing, skincare, lashes and glam. A private studio in Saddle
              Brook, New Jersey, designed around you.
            </p>
            <div className="mb-16 mt-8 flex items-center justify-center gap-6">
              <a
                href="https://excellencebeautybarnj.as.me/schedule/9671e509"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#8a5a2b] px-6 py-3 text-white transition-colors hover:bg-[#a06c3a]"
              >
                Book now
              </a>
              <a href="/services" className="text-[#8a5a2b] hover:underline">
                Explore services ›
              </a>
            </div>
          </>
        }
      >
        <Image
          src="/meet-the-owner.png"
          alt="Meet the owner, Yariliz — a passionate waxer with five years of experience and three years running her own business, dedicated to making every client feel confident, comfortable and silky smooth."
          height={962}
          width={1635}
          className="block h-auto w-full rounded-2xl"
          draggable={false}
          priority
        />
      </ContainerScroll>
    </div>
  );
}
