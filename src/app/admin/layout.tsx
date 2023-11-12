"use client";

import { useMe } from "@/lib/providers";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { me, loading } = useMe();
  if (loading) return null;
  if (!me?.isAdmin) {
    router.push("/");
  }
  return children;
}
