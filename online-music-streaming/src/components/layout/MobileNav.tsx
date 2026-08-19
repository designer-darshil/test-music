"use client";

import Link from "next/link";
import { Home, Search, Library } from "lucide-react";
import { usePathname } from "next/navigation";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-around bg-neutral-900 border-t border-neutral-800 p-2 text-xs">
      <Link href="/" className={`flex flex-col items-center p-2 ${pathname === "/" ? "text-white" : "text-neutral-400"}`}>
        <Home className="w-6 h-6 mb-1" />
        <span>Home</span>
      </Link>
      <Link href="/search" className={`flex flex-col items-center p-2 ${pathname === "/search" ? "text-white" : "text-neutral-400"}`}>
        <Search className="w-6 h-6 mb-1" />
        <span>Search</span>
      </Link>
      <Link href="/library" className={`flex flex-col items-center p-2 ${pathname === "/library" ? "text-white" : "text-neutral-400"}`}>
        <Library className="w-6 h-6 mb-1" />
        <span>Library</span>
      </Link>
    </div>
  );
}
