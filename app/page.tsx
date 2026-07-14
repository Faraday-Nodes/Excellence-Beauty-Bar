import Image from "next/image";
import { Sparkles, Heart, Clock } from "lucide-react";
import { HeroScrollDemo } from "@/components/hero-scroll-demo";
import { PagePeelDemo } from "@/components/ui/PagePeel";

const BOOK_URL = "https://excellencebeautybarnj.as.me/schedule/9671e509";

const services = [
  {
    name: "Brazilian Wax.",
    tag: "Gentle beyond belief.",
    price: "From $55",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1600&auto=format&fit=crop",
    alt: "Calm spa setting with towels and candles",
  },
  {
    name: "Lash Extensions.",
    tag: "Full volume. Zero effort.",
    price: "From $70",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1600&auto=format&fit=crop",
    alt: "Close up of a client receiving eye makeup",
  },
  {
    name: "Glam Makeup.",
    tag: "Ready when you are.",
    price: "From $70",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1600&auto=format&fit=crop",
    alt: "Makeup brushes and palettes arranged on a table",
  },
];

const values = [
  {
    icon: Sparkles,
    title: "Hygiene, first.",
    text: "Fresh linens and single use applicators for every client. No exceptions.",
  },
  {
    icon: Clock,
    title: "Private. Unhurried.",
    text: "One client at a time in a private suite. Your appointment is yours alone.",
  },
  {
    icon: Heart,
    title: "Results that last.",
    text: "Aftercare built into every visit, so smooth stays smooth between appointments.",
  },
];

export default function Home() {
  return (
    <div className="w-full bg-gradient-to-b from-[#fdf3ee] via-[#fbe9e2] to-[#f7d9d2] text-[#5a3b26]">
      {/* Hero with scroll animation */}
      <main>
        <HeroScrollDemo />

        {/* Services */}
        <section id="services" className="px-6 py-24 md:py-32">
          <h2 className="font-display text-center text-4xl font-semibold md:text-5xl">
            The essentials.
            <br />
            <span className="text-[#b07c3f]">Done beautifully.</span>
          </h2>
          <div className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-3">
            {services.map((s) => (
              <a
                key={s.name}
                href="/services"
                className="group overflow-hidden rounded-[28px] bg-white/80 shadow-[0_8px_30px_rgba(122,74,34,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(122,74,34,0.18)]"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-7">
                  <h3 className="text-xl font-semibold">{s.name}</h3>
                  <p className="mt-0.5 font-medium text-[#a3785a]">{s.tag}</p>
                  <p className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-[#a3785a]">{s.price}</span>
                    <span className="text-[#8a5a2b]">See pricing ›</span>
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Featured package: interactive peel card */}
        <section id="featured" className="px-6 py-10 md:py-16">
          <PagePeelDemo />
        </section>

        {/* Salon hours */}
        <section id="hours" className="px-6 py-24 md:py-32">
          <h2 className="font-display text-center text-4xl font-semibold tracking-[0.08em] md:text-5xl">
            Salon Hours
          </h2>
          <div className="mx-auto mt-14 grid max-w-3xl gap-6 md:grid-cols-2">
            <div className="rounded-[28px] bg-[#fbd9dd]/70 p-9 text-center shadow-[0_8px_30px_rgba(122,74,34,0.08)]">
              <h3 className="font-display text-sm font-semibold tracking-[0.3em] text-[#8a5a2b]">
                OPEN
              </h3>
              <p className="font-display mt-5 text-2xl font-semibold text-[#a0526b]">
                Tues to Fri
              </p>
              <p className="mt-1 text-[#6b4a30]">12:00 pm to 8:30 pm</p>
              <p className="font-display mt-5 text-2xl font-semibold text-[#a0526b]">
                Saturday
              </p>
              <p className="mt-1 text-[#6b4a30]">9:00 am to 6:00 pm</p>
            </div>
            <div className="rounded-[28px] bg-[#fbd9dd]/70 p-9 text-center shadow-[0_8px_30px_rgba(122,74,34,0.08)]">
              <h3 className="font-display text-sm font-semibold tracking-[0.3em] text-[#8a5a2b]">
                CLOSED
              </h3>
              <p className="font-display mt-5 text-2xl font-semibold text-[#a0526b]">
                Sunday
              </p>
              <p className="font-display mt-5 text-2xl font-semibold text-[#a0526b]">
                Monday
              </p>
              <p className="mt-6 text-sm text-[#a3785a]">
                Appointment only. Book online anytime.
              </p>
            </div>
          </div>
        </section>

        {/* Why */}
        <section id="why" className="px-6 py-24 md:py-32">
          <h2 className="font-display text-center text-4xl font-semibold md:text-5xl">
            Why Excellence.
          </h2>
          <div className="mx-auto mt-14 grid max-w-4xl gap-12 text-center md:grid-cols-3">
            {values.map((v) => (
              <div key={v.title}>
                <v.icon
                  className="mx-auto mb-4 h-9 w-9 text-[#b07c3f]"
                  strokeWidth={1.4}
                  aria-hidden
                />
                <h3 className="text-lg font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-[#a3785a]">{v.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-b from-[#dd8fa8] via-[#bb547a] to-[#8a3055] px-6 py-28 text-center text-[#fdf3ee] md:py-36">
          <h2 className="font-display text-4xl font-semibold md:text-6xl">
            Your glow.
            <br />
            <span className="font-script bg-gradient-to-r from-[#e9c286] via-[#d8a75b] to-[#b07c3f] bg-clip-text pr-3 text-5xl text-transparent md:text-8xl">
              one click away
            </span>
          </h2>
          <p className="mt-5 text-[#fdf3ee]/70">
            Appointments open online, around the clock.
          </p>
          <a
            href={BOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-9 inline-block rounded-full bg-[#d8a75b] px-8 py-3.5 text-lg text-[#3a2211] transition-colors hover:bg-[#e9c286]"
          >
            Book an appointment
          </a>
        </section>
      </main>

      {/* Footer — light blush to blend with the page rather than a dark bar */}
      <footer className="bg-[#f7d9d2] px-6 py-10 text-xs text-[#6b4a30]">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 border-t border-[#e2bfb5] pt-6">
          <p>
            Copyright © {new Date().getFullYear()} Excellence Beauty Bar LLC.
            All rights reserved.
          </p>
          <p>Saddle Brook, New Jersey</p>
        </div>
      </footer>
    </div>
  );
}
