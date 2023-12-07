import Link, { LinkProps } from "next/link";
import { cn } from "@/lib/utils";

interface TextLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
}

export function TextLink({ children, className, ...rest }: TextLinkProps) {
  return (
    <Link className={cn("underline hover:text-primary", className)} {...rest}>
      {children}
    </Link>
  );
}
