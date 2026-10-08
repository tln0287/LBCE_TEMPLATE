import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { isExternal } from "@/lib/format";

type Props = Omit<ComponentProps<"a">, "href"> & { href: string; external?: boolean; children: ReactNode };

/** Internal links use next/link; external links open in a new tab with safe rel attributes. */
export function SmartLink({ href, external, children, ...rest }: Props) {
  if (external || isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
