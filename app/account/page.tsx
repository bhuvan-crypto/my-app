"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Box, Button, Container, Heading, Text, VStack } from "@chakra-ui/react";

export default function AccountPage() {
  const [auth, setAuth] = useState<{ token?: string; user?: { name?: string; email?: string; role?: string } } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("fakeAuth");
      if (raw) setAuth(JSON.parse(raw));
    } catch (e) {
      setAuth(null);
    }
  }, []);

  function signOut() {
    localStorage.removeItem("fakeAuth");
    window.location.href = "/login";
  }

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" py={6}>
      <Container maxW="md" w="full">
        <Box bg="white" rounded="2xl" borderWidth="1px" borderColor="gray.200" p={8} boxShadow="lg">
          <VStack gap={4} align="stretch">
            <Heading size="lg">Account</Heading>

            {auth?.user ? (
              <Box>
                <Text fontSize="sm" color="gray.600">Name</Text>
                <Text mb={2}>{auth.user.name}</Text>
                <Text fontSize="sm" color="gray.600">Email</Text>
                <Text mb={2}>{auth.user.email}</Text>
                <Text fontSize="sm" color="gray.600">Role</Text>
                <Text mb={2}>{auth.user.role}</Text>
              </Box>
            ) : (
              <Text>No account signed in.</Text>
            )}

            <VStack gap={2} align="stretch">
              <Button onClick={signOut} colorScheme="red">Sign out</Button>
              <Link href="/">
                <Button variant="subtle">Home</Button>
              </Link>
            </VStack>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
