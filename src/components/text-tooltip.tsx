"use client";

import { useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { InfoIcon } from "@/components/icons";

type TextTooltipProps = {
  content: string;
  children?: React.ReactNode;
  className?: string;
  /** Se true, mostra ícone de info como gatilho; senão usa children */
  triggerIcon?: boolean;
};

export function TextTooltip({
  content,
  children,
  className,
  triggerIcon = true,
}: TextTooltipProps) {
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

  const tooltipEl =
    typeof document !== "undefined" &&
    visible &&
    createPortal(
      <div
        role="tooltip"
        onMouseEnter={show}
        onMouseLeave={hide}
        className={cn(
          "fixed z-[9999] w-[min(280px,85vw)] rounded-lg border border-border bg-popover px-3 py-2.5 text-xs font-normal text-popover-foreground shadow-lg",
          "whitespace-normal"
        )}
        style={{
          left: coords.left,
          top: coords.top,
          transform: "translate(-50%, -100%)",
        }}
      >
        {content}
      </div>,
      document.body
    );

  return (
    <>
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
        {triggerIcon ? (
          <>
            {children}
            <InfoIcon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
          </>
        ) : (
          children
        )}
      </span>
      {tooltipEl}
    </>
  );
}
