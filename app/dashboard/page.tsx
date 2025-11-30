"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
} from "@chakra-ui/react";

export default function DashboardPage() {
  const [payload, setPayload] = useState<{ token?: string; user?: { name?: string; email?: string } } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("fakeAuth");
      if (raw) setPayload(JSON.parse(raw));
    } catch (e) {
      setPayload(null);
    }
  }, []);

  function logout() {
    localStorage.removeItem("fakeAuth");
    window.location.href = "/login";
  }

  if (!payload) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" py={6}>
        <Container maxW="md">
          <Box
            bg="white"
            rounded="xl"
            borderWidth="1px"
            p={8}
            textAlign="center"
          >
            <Heading as="h2" size="md">
              Not signed in
            </Heading>
            <Text fontSize="sm" color="gray.600" mt={2}>
              You need to sign in to view the dashboard.
            </Text>
            <Box mt={4} display="flex" justifyContent="center">
              <Link href="/login">
                <Button colorScheme="blue">Sign in</Button>
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" py={6}>
      <Container maxW="2xl">
        <Box
          bg="white"
          rounded="2xl"
          borderWidth="1px"
          p={8}
        >
          <HStack justify="space-between" align="flex-start" mb={6}>
            <VStack align="start" gap={1}>
              <Heading as="h1" size="lg">
                Welcome, {payload.user?.name ?? 'User'}
              </Heading>
              <Text fontSize="sm" color="gray.600">
                You are signed in as{" "}
                <Box as="span" fontFamily="mono">
                  {payload.user?.email}
                </Box>
              </Text>
            </VStack>
            <HStack gap={3}>
              <Link href="/">
                <Button variant="subtle" size="sm">
                  Home
                </Button>
              </Link>
              <Button colorScheme="red" size="sm" onClick={logout}>
                Sign out
              </Button>
            </HStack>
          </HStack>

          <Box as="main" mt={6} color="gray.700">
            <Text mb={4}>
              This is a small demo dashboard. In production you'd fetch protected data from your API using the real auth token.
            </Text>

            <Box
              rounded="lg"
              borderWidth="1px"
              p={4}
              bg="gray.50"
            >
              <Text fontSize="sm" fontWeight="medium">
                Demo token (not secure)
              </Text>
              <Box
                as="pre"
                mt={2}
                rounded="md"
                bg="gray.100"
                p={3}
                fontSize="xs"
                fontFamily="mono"
                overflow="auto"
              >
                {JSON.stringify(payload, null, 2)}
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
