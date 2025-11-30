"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  VStack,
  HStack,
  Text,
} from "@chakra-ui/react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "admin">("customer");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in both email and password");
      return;
    }

    setLoading(true);
    try {
      // reuse the demo /api/login endpoint for a quick mock register
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      if (!res.ok) {
        const body = await res.json();
        setError(body?.message || "Registration failed");
        setLoading(false);
        return;
      }

      const payload = await res.json();
      localStorage.setItem("fakeAuth", JSON.stringify(payload));
      // redirect based on role
      if (payload?.user?.role === "customer") {
        window.location.href = "/customer/dashboard";
      } else {
        window.location.href = "/admin";
      }
    } catch (err) {
      setError("Network error — try again");
      setLoading(false);
    }
  }

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" py={6}>
      <Container maxW="md" w="full">
        <Box
          bg="white"
          rounded="2xl"
          borderWidth="1px"
          borderColor="gray.200"
          p={8}
          boxShadow="lg"
        >
          <VStack gap={6} align="stretch">
            <VStack gap={2} textAlign="center">
              <Heading as="h1" size="lg">
                Create an account
              </Heading>
              <Text fontSize="sm" color="gray.600">
                Enter email, password and choose a role
              </Text>
            </VStack>

            <form onSubmit={handleSubmit}>
              <VStack gap={4}>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Role
                  </Text>
                  <HStack gap={6}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <input
                        type="radio"
                        value="customer"
                        checked={role === "customer"}
                        onChange={() => setRole("customer")}
                      />
                      Customer
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <input
                        type="radio"
                        value="admin"
                        checked={role === "admin"}
                        onChange={() => setRole("admin")}
                      />
                      Admin
                    </label>
                  </HStack>
                </Box>

                <Box w="full">
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Email
                  </Text>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Box>

                <Box w="full">
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Password
                  </Text>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Box>

                {error && (
                  <Box w="full" p={3} bg="red.50" rounded="md" borderLeft="4px solid red">
                    <Text fontSize="sm" color="red.600">
                      {error}
                    </Text>
                  </Box>
                )}

                <HStack w="full" gap={4}>
                  <Button type="submit" colorScheme="blue" loading={loading} flex={1}>
                    {loading ? "Creating…" : "Create account"}
                  </Button>
                  <Link href="/">
                    <Button variant="subtle">Back</Button>
                  </Link>
                </HStack>
              </VStack>
            </form>

            <Box textAlign="center" fontSize="sm" color="gray.600">
              Already have an account? {" "}
              <Link href="/login">
                <Button variant="plain" color="blue.600">
                  Sign in
                </Button>
              </Link>
            </Box>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
