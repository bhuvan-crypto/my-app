"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../lib/authStore";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { accessToken, user } = useAuthStore();

  useEffect(() => {
    // Not logged in → go to login
    if (!accessToken) {
      router.replace("/");
      return;
    }

    // Logged in but wrong role → redirect
    if (user.role !== "customer") {
      router.replace("/admin");
    }
  }, [accessToken, user, router]);

  return <>{children}</>;
}
