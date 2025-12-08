"use client";

import { Product } from "@/lib/products";
import { Box, Heading, HStack, Button, Text, Span } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cartStore";
import { useAuthStore } from "@/lib/authStore";

export function ProductCard({ product }: { product: Product }) {
  const addToCart = useCart((s) => s.add);
  
  const router = useRouter();
  const auth = useAuthStore();

  return (
    <Box
      p={4}
      bg="white"
      _dark={{ bg: "gray.800" }}
      borderRadius="md"
      shadow="sm"
      _hover={{ shadow: "md", transform: "translateY(-2px)", transition: "0.2s" }}
      w={"full"}
      h={"fit"}
    >
      <Box
        h="36"
        bg="gray.100"
        _dark={{ bg: "gray.700" }}
        borderRadius="lg"
        p={4}
        mb={4}
      >
        <Heading fontSize="lg">{product.name}</Heading>
        <Text fontSize="xs" color="gray.500">
          {product.description}
          <Span display="block" mt={2} fontWeight="bold">Qty: {product.stockQuantity}</Span>
        </Text>
        
      </Box>

      <Text fontWeight="bold" mb={2}>
        ${product.price.toFixed(2)}
      </Text>

      <HStack mt={3} gap={3}>
        <Button
          size="sm"
          colorScheme="teal"
          flex={1}
          onClick={() => addToCart(product.id, auth?.user?.id as string)}
        >
          Add
        </Button>

        <Button
          size="sm"
          variant="outline"
          flex={1}
          onClick={() => router.push(`/product/${product.id}`)}
        >
          View
        </Button>
      </HStack>
    </Box>
  );
}
