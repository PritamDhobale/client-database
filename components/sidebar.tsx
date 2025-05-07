"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, FileText, Settings, BarChart3, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"

const navItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Clients",
    href: "/clients",
    icon: Users,
  },
  {
    name: "Agreements",
    href: "/agreements",
    icon: FileText,
  },
  {
    name: "Services",
    href: "/services",
    icon: Settings,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { logout } = useAuth()

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-50 bottom-4 right-4 bg-primary text-white p-3 rounded-full shadow-lg md:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      
      <aside
        className={cn(
          "bg-white border-r border-gray-200 w-40 flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out",
          isOpen ? "fixed inset-y-0 left-0 z-40" : "hidden md:flex",
        )}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
          <div className="w-38 h-11 flex items-center justify-center overflow-hidden">
          <Image
            src="/images/accounthub.png"
            alt="Sage Healthy Logo"
            width={196}
            height={132}
          />
        </div>
        </div>
        </div>
            {/* <div>
              <h1 className="text-xl font-bold text-primary">Sage Healthy</h1>
              <p className="text-sm text-gray-500">RCM Admin Portal</p>
            </div> */}

        <nav className="flex-1 pt-4 pb-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary rounded-md mx-2",
                    pathname === item.href && "bg-primary/10 text-primary font-medium",
                  )}
                >
                  <item.icon className="h-5 w-5 w-5 min-w-[20px] shrink-0 mr-3" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button onClick={logout} className="flex items-center text-gray-700 hover:text-red-600 w-full">
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
