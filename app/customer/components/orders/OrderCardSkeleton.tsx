"use client";

import { Box, Skeleton, SkeletonText, SimpleGrid, HStack } from "@chakra-ui/react";

export default function OrderCardSkeleton() {
  return (
    <Box
      p={4}
      bg="white"
      _dark={{ bg: "gray.800" }}
      borderRadius="md"
      shadow="sm"
      w={"full"}
    >
      <HStack justify="space-between" mb={3}>
        <Box w="60%">
          <Skeleton height="20px" mb={2} />
          <Skeleton height="14px" width="70%" />
        </Box>
        <Skeleton height="20px" width="50px" />
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
        <Skeleton height="50px" borderRadius="md" />
        <Skeleton height="50px" borderRadius="md" />
      </SimpleGrid>
    </Box>
  );
}
