import { cn } from "../utils";

interface FlexRowProps {
  children: React.ReactNode;
  className?: string;
}
export function FlexRow({ children, className }: FlexRowProps) {
  return (
    <div className={cn("flex flex-row items-center justify-start", className)}>
      {children}
    </div>
  );
}
