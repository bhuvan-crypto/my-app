"use client";

import { useAuthStore } from "@/app/lib/authStore";
import { Box, Button, Container, Heading, HStack, SimpleGrid, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect } from "react";
import CartPopover from "../../components/CartPopover";
import useProducts from "../../lib/productsStore";
import { ProductCard } from "./ProductCard";
import { ProductSkeleton } from "./ProductSkeleton";
import { useAppLoading } from "@/app/api/loadingStore";

export default function CustomerDashboard() {
  const auth = useAuthStore();
  const loading = useAppLoading((s) => s.isActionLoading("getProducts"));
  const { products, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, []);


  function signOut() {
    auth.logout();
  }

  if (!auth || auth.user?.role !== "customer") {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50" _dark={{ bg: 'gray.900' }} px={6}>
        <Box maxW="md" p={8} textAlign="center" bg="white" _dark={{ bg: 'gray.800' }} borderRadius="md" shadow="md">
          <Heading size="lg" mb={4}>Access denied</Heading>
          <Text mb={6} color="gray.600" _dark={{ color: 'gray.400' }}>You must sign in as a customer to view this page.</Text>
          <Link href="/login">
            <Button w="full" colorScheme="teal">Sign in</Button>
          </Link>
        </Box>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50" _dark={{ bg: 'gray.900' }} py={12} px={6} display={"flex"}>
      <Container maxW="5xl" marginX={"auto"}>
        <HStack justify="space-between" mb={8} align="flex-start">
          <Box>
            <Heading size="lg">Hi {auth.user.username ?? 'Customer'}</Heading>
            <Text color="gray.600" _dark={{ color: 'gray.400' }} fontSize="sm" mt={2}>Browse our products and add items to your cart.</Text>
          </Box>

          <HStack gap={3}>
            <CartPopover />
            <Link href="/customer/orders">
              <Button size="sm" p={2}>Order History</Button>
            </Link>
            <Button onClick={signOut} colorScheme="red" size="sm" p={2}>Sign out</Button>
          </HStack>
        </HStack>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={6}>
          {loading
            ? [...Array(6)].map((_, i) => <ProductSkeleton key={i} />)
            : products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </SimpleGrid>

      </Container>
    </Box>
  );
}

