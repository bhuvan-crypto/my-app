"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginPage from "./login/page";
import { useAuthStore } from "./lib/authStore";

export default function Home() {
  const router = useRouter();
  const { accessToken, user } = useAuthStore();

  useEffect(() => {
    if (accessToken && user?.role) {
      if (user.role === "admin") router.replace("/admin");
      else router.replace("/customer/dashboard");
    }
  }, [accessToken, user, router]);

  return <LoginPage />;
}
