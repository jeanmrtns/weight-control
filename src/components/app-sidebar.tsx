"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ScaleIcon,
  UsersIcon,
  PlusCircleIcon,
  LayoutDashboardIcon,
  InfoIcon,
  MenuIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
} from "@/components/icons";
import { ModeToggle } from "@/components/mode-toggle";
import { LocaleToggle } from "@/components/locale-toggle";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useTranslation } from "@/contexts/locale-context";

const SIDEBAR_COLLAPSED_KEY = "sidebar-collapsed";

const navPaths = [
  { href: "/", labelKey: "nav.home", icon: ScaleIcon },
  { href: "/people", labelKey: "nav.people", icon: UsersIcon },
  { href: "/weight", labelKey: "nav.registerWeight", icon: PlusCircleIcon },
  { href: "/dashboard", labelKey: "nav.comparative", icon: LayoutDashboardIcon },
  { href: "/imc", labelKey: "nav.aboutBmi", icon: InfoIcon },
];

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLarge = useMediaQuery("(min-width: 1024px)");
  const { t } = useTranslation();

  const [isCollapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (stored !== null) setCollapsed(stored === "true");
  }, []);

  useEffect(() => {
    if (isCollapsed) localStorage.setItem(SIDEBAR_COLLAPSED_KEY, "true");
    else localStorage.setItem(SIDEBAR_COLLAPSED_KEY, "false");
  }, [isCollapsed]);

  useEffect(() => {
    if (isLarge) setMobileOpen(false);
  }, [isLarge]);

  const sidebarExpanded = isLarge ? !isCollapsed : isMobileOpen;
  const sidebarWidth = isLarge ? (isCollapsed ? "w-16" : "w-64") : "w-64";

  return (
    <div className="flex min-h-screen">
      {/* Barra superior em mobile quando sidebar fechada */}
      {!isLarge && !isMobileOpen && (
        <div className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center gap-2 border-b border-sidebar-border bg-sidebar px-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
            aria-label={t("nav.openMenu")}
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
          <Link href="/" className="flex items-center gap-2 font-semibold text-sidebar-foreground">
            <ScaleIcon className="h-5 w-5" />
            {t("common.appName")}
          </Link>
        </div>
      )}

      {/* Overlay em mobile quando menu aberto */}
      {!isLarge && isMobileOpen && (
        <button
          type="button"
          aria-label={t("nav.closeMenu")}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-200 ease-in-out lg:z-30",
          sidebarWidth,
          !isLarge && "translate-x-0 shadow-xl",
          !isLarge && !isMobileOpen && "-translate-x-full"
        )}
      >
        {/* Header: logo (ou ícone) + toggle mobile/toggle collapse */}
        <div className="flex h-14 shrink-0 items-center justify-center gap-2 border-b border-sidebar-border px-2 overflow-hidden">
          {!isLarge ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(false)}
                className="shrink-0"
                aria-label={t("nav.closeMenu")}
              >
                <PanelLeftCloseIcon className="h-5 w-5" />
              </Button>
              <Link
                href="/"
                className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden font-semibold"
              >
                <ScaleIcon className="h-5 w-5 shrink-0" />
                <span className="truncate">{t("common.appName")}</span>
              </Link>
            </>
          ) : isCollapsed ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(false)}
              className="shrink-0"
              aria-label={t("nav.expandMenu")}
            >
              <PanelLeftOpenIcon className="h-5 w-5" />
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCollapsed(true)}
                className="shrink-0"
                aria-label={t("nav.collapseMenu")}
              >
                <PanelLeftCloseIcon className="h-5 w-5" />
              </Button>
              <Link
                href="/"
                className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden font-semibold"
              >
                <ScaleIcon className="h-5 w-5 shrink-0" />
                <span className="truncate">{t("common.appName")}</span>
              </Link>
            </>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex flex-1 flex-col gap-1 overflow-auto p-2">
          {navPaths.map(({ href, labelKey, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => !isLarge && setMobileOpen(false)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isLarge && isCollapsed && "justify-center px-2"
              )}
              title={isLarge && isCollapsed ? t(labelKey) : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {sidebarExpanded && <span className="truncate">{t(labelKey)}</span>}
            </Link>
          ))}
        </nav>

        {/* Footer: idioma + tema */}
        <div className="border-t border-sidebar-border space-y-2 p-2">
          <div className={cn("flex items-center", isLarge && isCollapsed && "justify-center")}>
            <LocaleToggle compact={isLarge && isCollapsed} />
          </div>
          <div className={cn("flex items-center", isLarge && isCollapsed && "justify-center")}>
            <ModeToggle />
            {sidebarExpanded && (
              <span className="ml-2 text-sm text-muted-foreground">{t("nav.theme")}</span>
            )}
          </div>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <div
        className={cn(
          "min-h-screen min-w-0 flex-1 overflow-x-hidden transition-all duration-200",
          isLarge && (isCollapsed ? "lg:pl-16" : "lg:pl-64"),
          !isLarge && "pt-14"
        )}
      >
        <main className="container min-w-0 mx-auto max-w-6xl px-4 py-6">{children}</main>
      </div>
    </div>
  );
}
