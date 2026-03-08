"use client";

import { useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { InfoIcon } from "@/components/icons";
import { useTranslation } from "@/contexts/locale-context";

type IMCTooltipProps = {
  children: React.ReactNode;
  className?: string;
  /** Se true, mostra um ícone de info ao lado do children como gatilho do tooltip */
  triggerIcon?: boolean;
};

export function IMCTooltip({ children, className, triggerIcon }: IMCTooltipProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);

  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el || typeof document === "undefined") return;
    const rect = el.getBoundingClientRect();
    setCoords({
      top: rect.top - 8,
      left: rect.left + rect.width / 2,
    });
  }, []);

  const show = useCallback(() => {
    updatePosition();
    setVisible(true);
  }, [updatePosition]);

  const hide = useCallback(() => setVisible(false), []);

  const tooltipContent =
    typeof document !== "undefined" &&
    visible &&
    createPortal(
      <div
        role="tooltip"
        onMouseEnter={show}
        onMouseLeave={hide}
        className={cn(
          "fixed z-[9999] w-[min(300px,85vw)] rounded-lg border border-border bg-popover px-3 py-2.5 text-xs font-normal text-popover-foreground shadow-lg",
          "whitespace-normal overflow-y-auto max-h-[70vh]"
        )}
        style={{
          left: coords.left,
          top: coords.top,
          transform: "translate(-50%, -100%)",
        }}
      >
        <p className="leading-relaxed">{t("imc.tooltip")}</p>
        <span className="mt-2 block">
          <Link href="/imc" className="text-primary underline hover:no-underline">
            {t("imc.seeAboutPage")}
          </Link>
        </span>
      </div>,
      document.body
    );

  const trigger = (
    <span
      ref={triggerRef}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      className={cn(
        "inline-flex cursor-help items-center gap-1",
        className
      )}
    >
      {children}
      {triggerIcon && (
        <InfoIcon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
      )}
    </span>
  );

  return (
    <>
      {trigger}
      {tooltipContent}
    </>
  );
}
