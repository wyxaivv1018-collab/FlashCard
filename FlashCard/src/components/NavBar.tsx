"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Brain,
  BookOpen,
  BarChart3,
  Crown,
  Home,
} from "lucide-react";

const links = [
  { href: "/", label: "首页", icon: Home },
  { href: "/study", label: "刷卡", icon: Brain },
  { href: "/mistakes", label: "错题", icon: BookOpen },
  { href: "/stats", label: "统计", icon: BarChart3 },
  { href: "/vip", label: "会员", icon: Crown },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-sm safe-area-inset-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-2">
        {links.map((link) => {
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors",
                isActive
                  ? "text-primary-600"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
