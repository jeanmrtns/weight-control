"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScaleIcon, UsersIcon, PlusCircleIcon, LayoutDashboardIcon } from "@/components/icons";
import { ModeToggle } from "@/components/mode-toggle";

const navItems = [
  { href: "/", label: "Início", icon: ScaleIcon },
  { href: "/people", label: "Pessoas", icon: UsersIcon },
  { href: "/weight", label: "Registrar peso", icon: PlusCircleIcon },
  { href: "/dashboard", label: "Comparativo", icon: LayoutDashboardIcon },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 border-b bg-card px-4 py-2">
      <Link
        href="/"
        className="mr-4 flex items-center gap-2 font-semibold text-foreground"
      >
        <ScaleIcon className="h-5 w-5" />
        Controle de Peso
      </Link>
      <div className="flex flex-1 gap-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </div>
      <ModeToggle />
    </nav>
  );
}
