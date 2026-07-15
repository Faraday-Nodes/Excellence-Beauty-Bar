"use client"

import { usePathname } from "next/navigation"
import { Home, Sparkles, CalendarCheck } from "lucide-react"
import { NavBar } from "@/components/ui/tubelight-navbar"

export function SalonNavBar() {
  const pathname = usePathname()
  /* The active tab follows the current route. */
  const active =
    pathname === "/services" ? "Services" : pathname === "/" ? "Home" : ""

  const navItems = [
    { name: "Home", url: "/", icon: Home },
    { name: "Services", url: "/services", icon: Sparkles },
    {
      name: "Book",
      url: "https://excellencebeautybarnj.as.me/schedule/9671e509",
      icon: CalendarCheck,
    },
  ]

  return <NavBar items={navItems} activeName={active} />
}
