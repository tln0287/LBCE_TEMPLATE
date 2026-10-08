import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SmartLink } from "./SmartLink";
import { isExternal } from "@/lib/format";

export type ButtonVariant = "primary" | "premium" | "outline" | "outline-dark" | "ghost";

export function LinkButton({
  href,
  children,
  variant = "primary",
  size,
  external,
  arrow = true,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant | string;
  size?: "sm";
  external?: boolean;
  arrow?: boolean;
  className?: string;
}) {
  const ext = external || isExternal(href);
  const Arrow = ext ? ArrowUpRight : ArrowRight;
  return (
    <SmartLink href={href} external={ext} className={`btn btn--${variant} ${size ? `btn--${size}` : ""} ${className}`}>
      {children}
      {arrow && <Arrow className="arrow" aria-hidden="true" />}
    </SmartLink>
  );
}
