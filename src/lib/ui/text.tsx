import { createElement } from "react";
import { cn } from "@/lib/utils";

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: keyof JSX.IntrinsicElements;
}

export function Text({ children, as, className }: TextProps) {
  return createElement(
    as ?? "p",
    { className: cn("text", className) },
    children
  );
}
