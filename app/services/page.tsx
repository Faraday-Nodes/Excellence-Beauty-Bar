import type { Metadata } from "next";
import Image from "next/image";
import { asset } from "@/lib/utils";
import { SERVICE_CATEGORIES, BOOK_URL } from "@/lib/services-data";

export const metadata: Metadata = {
  title: "Services & Pricing | Excellence Beauty Bar",
  description:
    "Every service at Excellence Beauty Bar with transparent pricing. Waxing, facial waxes, lash extensions, skin care, makeup, men's services and packages.",
};

export default function ServicesPage() {
  return (
    <div className="w-full bg-gradient-to-b from-[#fdf3ee] via-[#fbe9e2] to-[#f7d9d2] px-6 pb-40 pt-16 text-[#5a3b26] sm:pt-32">
      {/* Heading */}
      <header className="mx-auto max-w-3xl text-center">
        <p className="font-display text-sm font-semibold tracking-[0.3em] text-[#a3785a]">
          EXCELLENCE BEAUTY BAR
        </p>
        <h1 className="font-display mt-3 text-5xl font-semibold md:text-6xl">
          The Menu
        </h1>
        <p className="font-script mt-2 bg-gradient-to-r from-[#d8a75b] to-[#7d4e22] bg-clip-text pb-2 text-4xl text-transparent md:text-5xl">
          every service, upfront
        </p>
        <p className="mx-auto mt-4 max-w-xl text-[#a3785a]">
          Transparent pricing, no surprises. New client and returning client
          waxing appointments are booked from separate menus with matching
          prices.
        </p>
      </header>

      {/* Gallery — CSS columns so cards pack tightly (masonry) instead of
          being locked to a shared row height, which left ragged gaps. */}
      <div className="mx-auto mt-16 max-w-5xl columns-1 [column-gap:1.75rem] md:columns-2">
        {SERVICE_CATEGORIES.map((cat) => (
          <section
            key={cat.name}
            className="mb-7 block w-full break-inside-avoid overflow-hidden rounded-[28px] bg-white/85 shadow-[0_8px_30px_rgba(122,74,34,0.1)]"
            aria-labelledby={`cat-${cat.name}`}
          >
            <div className="relative h-52">
              <Image
                src={asset(cat.image)}
                alt={cat.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3a2211]/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <h2
                  id={`cat-${cat.name}`}
                  className="font-display text-2xl font-semibold text-[#fdf3ee]"
                >
                  {cat.name}
                </h2>
                <p className="text-sm text-[#fdf3ee]/85">{cat.tagline}</p>
              </div>
            </div>
            <ul className="px-7 py-3">
              {cat.services.map((s) => (
                <li
                  key={s.name}
                  className="border-b border-[#f3ddd4] py-4 last:border-b-0"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-semibold">{s.name}</span>
                    <span className="font-display whitespace-nowrap text-lg font-semibold text-[#8a5a2b]">
                      ${s.price}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-baseline justify-between gap-4 text-sm text-[#a3785a]">
                    <span>{s.detail ?? ""}</span>
                    <span className="whitespace-nowrap">{s.dur}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* CTA */}
      <div className="mx-auto mt-20 max-w-xl text-center">
        <h2 className="font-display text-3xl font-semibold md:text-4xl">
          Found your service?
        </h2>
        <p className="mt-3 text-[#a3785a]">
          Appointments open online, around the clock.
        </p>
        <div className="mt-8 flex items-center justify-center gap-6">
          <a
            href={BOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#8a5a2b] px-8 py-3.5 text-lg text-white transition-colors hover:bg-[#a06c3a]"
          >
            Book an appointment
          </a>
          <a href="/" className="text-[#8a5a2b] hover:underline">
            Back home ›
          </a>
        </div>
      </div>
    </div>
  );
}
