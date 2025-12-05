"use client";
import { useAuthStore } from "@/lib/authStore";
import { Box, Button, Container, Heading, HStack, SimpleGrid, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect } from "react";
import CartPopover from "../../components/CartPopover";
import useProducts from "../../lib/productsStore";
import { ProductCard } from "../admin/components/ProductCard";
import { ProductSkeleton } from "../admin/components/ProductSkeleton";
import { useAppLoading } from "@/api/loadingStore";

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

  return (
    <Box minH="80vh" bg="gray.50" minW={"40vw"} _dark={{ bg: 'gray.900' }} py={12} px={6} display={"flex"} margin={"auto"}>
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

