"use client";

import { useRef, useState, useEffect } from "react";
import { useLocale } from "@/contexts/locale-context";
import { LOCALES, type Locale } from "@/i18n";
import { cn } from "@/lib/utils";

type LocaleToggleProps = { compact?: boolean };

export function LocaleToggle({ compact }: LocaleToggleProps) {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = LOCALES.find((l) => l.value === locale) ?? LOCALES[0];

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="relative" role="group" aria-label="Idioma">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-8 min-w-0 items-center gap-2 rounded-lg px-2 text-sm transition-colors",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "border border-transparent",
          open && "bg-sidebar-accent text-sidebar-accent-foreground"
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={current.label}
      >
        <span className="text-lg leading-none shrink-0" aria-hidden>
          {current.flag}
        </span>
        {!compact && <span className="truncate">{current.label}</span>}
        <svg
          className={cn("h-4 w-4 shrink-0 transition-transform", open && "rotate-180")}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute bottom-full left-0 right-0 z-50 mb-1 max-h-48 overflow-auto rounded-lg border border-border bg-popover py-1 text-popover-foreground shadow-md"
        >
          {LOCALES.map(({ value, flag, label }) => (
            <li key={value} role="option" aria-selected={locale === value}>
              <button
                type="button"
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-left text-sm",
                  "hover:bg-accent hover:text-accent-foreground",
                  locale === value && "bg-accent text-accent-foreground"
                )}
                onClick={() => {
                  setLocale(value as Locale);
                  setOpen(false);
                }}
              >
                <span className="text-lg leading-none">{flag}</span>
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
