"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "../ui";
import { useMe } from "../providers";

interface PrivatePageProps {
  children: React.ReactNode;
  authorizedRoles?: string[];
}

export function PrivatePage({ children, authorizedRoles }: PrivatePageProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, me } = useMe();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/`);
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && authorizedRoles) {
      if (!authorizedRoles.includes("admin") && !me?.isAdmin) {
        router.push(`/`);
      }
    }
  }, [authorizedRoles, isAuthenticated, isLoading, me?.isAdmin, router]);

  if (isLoading || !isAuthenticated) return <LoadingScreen />;

  return children;
}
