"use client";

import { ReactNode } from "react";

interface MainProps {
  children: ReactNode;
  privateRoute?: boolean;
}

export function Main({ children }: MainProps) {
  return (
    <main
      className="
      mx-auto
      w-full
      h-full
      min-h-screen
      flex flex-col items-start justify-start
      py-2
      px-4 lg:px-12 xl:px-24 
      max-w-7xl
      "
    >
      {children}
    </main>
  );
}
