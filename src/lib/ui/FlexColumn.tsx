import { cn } from "../utils";

interface FlexRowProps {
  children: React.ReactNode;
  className?: string;
}
export function FlexColumn({ children, className }: FlexRowProps) {
  return (
    <div className={cn("flex flex-col justify-start", className)}>
      {children}
    </div>
  );
}
