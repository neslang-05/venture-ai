"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Analyse", icon: BarChart3 },
];

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex border-t border-border bg-sidebar"
      aria-label="Mobile navigation"
    >
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex-1 flex flex-col items-center justify-center gap-1 py-3 min-h-[56px]",
            "text-xs transition-colors duration-100",
            pathname === href
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
          aria-current={pathname === href ? "page" : undefined}
          aria-label={label}
        >
          <Icon
            className={cn(
              "w-5 h-5",
              pathname === href ? "text-terracotta" : "text-current"
            )}
            aria-hidden="true"
          />
          <span className="font-display text-xs">{label}</span>
        </Link>
      ))}
    </nav>
  );
}
