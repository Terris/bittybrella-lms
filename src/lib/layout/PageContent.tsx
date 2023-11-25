import { ReactNode } from "react";

export function PageContent({ children }: { children: ReactNode }) {
  return <div className="w-full py-4 flex flex-col gap-4">{children}</div>;
}
