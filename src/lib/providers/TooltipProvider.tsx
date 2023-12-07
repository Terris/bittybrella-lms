import { TooltipProvider as UITooltipProvider } from "@/lib/ui";

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <UITooltipProvider>{children}</UITooltipProvider>;
}
