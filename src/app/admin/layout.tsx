"use client";

import { PrivatePageWrapper } from "@/lib/Authorization";
import { useMe } from "@/lib/providers";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { me, isLoading } = useMe();
  if (isLoading) return null;
  if (!me?.isAdmin) {
    router.push("/");
  }
  return (
    <PrivatePageWrapper authorizedRoles={["admin"]}>
      {children}
    </PrivatePageWrapper>
  );
}
