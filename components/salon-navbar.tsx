"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Home, Sparkles, Heart, CalendarCheck } from "lucide-react"
import { NavBar } from "@/components/ui/tubelight-navbar"

export function SalonNavBar() {
  const pathname = usePathname()
  const [active, setActive] = useState("Home")

  /* Live location tracking: route decides the tab; on the home page a
     scroll spy hands the lamp to "Why Excellence" while that section is
     in view. */
  useEffect(() => {
    const compute = () => {
      if (pathname === "/services") {
        setActive("Services")
        return
      }
      if (pathname !== "/") {
        setActive("")
        return
      }
      const why = document.getElementById("why")
      if (why) {
        const r = why.getBoundingClientRect()
        if (r.top < window.innerHeight * 0.5 && r.bottom > window.innerHeight * 0.25) {
          setActive("Why Excellence")
          return
        }
      }
      setActive("Home")
    }
    compute()
    window.addEventListener("scroll", compute, { passive: true })
    window.addEventListener("resize", compute)
    return () => {
      window.removeEventListener("scroll", compute)
      window.removeEventListener("resize", compute)
    }
  }, [pathname])

  const navItems = [
    { name: "Home", url: "/", icon: Home },
    { name: "Services", url: "/services", icon: Sparkles },
    { name: "Why Excellence", url: "/#why", icon: Heart },
    {
      name: "Book",
      url: "https://excellencebeautybarnj.as.me/schedule/9671e509",
      icon: CalendarCheck,
    },
  ]

  return <NavBar items={navItems} activeName={active} />
}
