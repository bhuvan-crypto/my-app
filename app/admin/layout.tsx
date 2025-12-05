"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../lib/authStore";
import { Center, Spinner } from "@chakra-ui/react"; // Import Chakra components

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { accessToken, user, _hasHydrated } = useAuthStore();

  useEffect(() => {
    // 1. If we haven't finished loading from localStorage, do nothing yet.
    if (!_hasHydrated) return;

    // 2. Once hydrated, NOW we check permissions
    if (!accessToken) {
      router.replace("/");
      return;
    }

    if (user.role !== "admin") {
      router.replace("/customer");
    }
  }, [accessToken, user, router, _hasHydrated]);

  // 3. Prevent rendering the protected content until we are sure
  if (!_hasHydrated) {
    return (
      <Center h="100vh" w={"full"}>
        <Spinner size="xl" />
      </Center>
    );
  }

  // If hydrated but no token, the useEffect above will redirect. 
  // To avoid flashing content, we can return null here if unauthorized.
  if (!accessToken || user.role !== "admin") return null;

  return <>{children}</>;
}