"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type ThemeSelectOption = { value: string; label: string };

type ThemeSelectProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: ThemeSelectOption[];
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
};

export function ThemeSelect({
  id,
  value,
  onChange,
  options,
  placeholder = "Selecione…",
  className,
  required,
  disabled,
}: ThemeSelectProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedLabel = value
    ? (options.find((o) => o.value === value)?.label ?? placeholder)
    : placeholder;

  React.useEffect(() => {
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
    <div ref={containerRef} className="relative">
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={selectedLabel}
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={cn(
          "flex h-8 w-full items-center justify-between rounded-lg border border-input bg-background px-2.5 py-1 text-left text-sm text-foreground",
          "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring",
          "disabled:opacity-50",
          !value && "text-muted-foreground",
          className
        )}
      >
        <span className="truncate">{selectedLabel}</span>
        <svg
          className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
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
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-lg border border-border bg-popover py-1 text-popover-foreground shadow-md"
          style={{ minWidth: "var(--radix-popper-anchor-width, 100%)" }}
        >
          <li role="option">
            <button
              type="button"
              className={cn(
                "w-full px-2.5 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground",
                !value && "bg-accent/50 text-accent-foreground"
              )}
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
            >
              {placeholder}
            </button>
          </li>
          {options.map((opt) => (
            <li key={opt.value} role="option" aria-selected={value === opt.value}>
              <button
                type="button"
                className={cn(
                  "w-full px-2.5 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground",
                  value === opt.value && "bg-accent text-accent-foreground"
                )}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
      <input
        type="hidden"
        name={id}
        value={value}
        required={required}
        tabIndex={-1}
        aria-hidden
      />
    </div>
  );
}
