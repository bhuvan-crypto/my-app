"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../lib/authStore";
import { Center, Spinner } from "@chakra-ui/react";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { accessToken, user, _hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!_hasHydrated) return;

    if (!accessToken) {
      router.replace("/");
      return;
    }

    if (user.role !== "customer") {
      router.replace("/admin");
    }
  }, [accessToken, user, router, _hasHydrated]);

  if (!_hasHydrated) {
    return (
      <Center h="100vh" w={"full"}>
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!accessToken || user.role !== "customer") return null;

  return <>{children}</>;
}