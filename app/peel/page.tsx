import type { Metadata } from "next";
import { PagePeelDemo } from "@/components/ui/PagePeel";

export const metadata: Metadata = {
  title: "PagePeel Demo | Excellence Beauty Bar",
  description:
    "Interactive drag-to-peel page curl component demo. Drag the folded corner to peel the card open.",
};

export default function PeelPage() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-[#fdf3ee] via-[#fbe9e2] to-[#f7d9d2] px-6 pb-32 pt-10 sm:pt-24">
      <PagePeelDemo />
    </main>
  );
}
