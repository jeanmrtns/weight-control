"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { SunIcon, MoonIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/contexts/locale-context";

export function ModeToggle() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  const toggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="relative" aria-hidden>
        <MoonIcon className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className="relative"
      aria-label={isDark ? t("nav.activateLightMode") : t("nav.activateDarkMode")}
    >
      <SunIcon
        className={cn(
          "h-5 w-5 transition-transform",
          isDark ? "scale-0 opacity-0" : "scale-100 opacity-100"
        )}
      />
      <MoonIcon
        className={cn(
          "absolute h-5 w-5 transition-transform",
          isDark ? "scale-100 opacity-100" : "scale-0 opacity-0"
        )}
      />
    </Button>
  );
}
