"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "../ui";
import { useMe } from "../providers";

export function PrivatePage({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useMe();
  console.log(isLoading);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/`);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) return <LoadingScreen />;

  return children;
}
