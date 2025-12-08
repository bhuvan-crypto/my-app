import { Box, Skeleton, SkeletonText } from "@chakra-ui/react";

export function ProductSkeleton() {
  return (
    <Box p={4} bg="white" borderRadius="md" shadow="sm" width={"100%"} >
      <Skeleton height="120px" borderRadius="lg" mb={4} />
      <SkeletonText noOfLines={2} gap={2} />
      <Skeleton height="32px" mt={4} />
    </Box>
  );
}
