import { Box } from "@chakra-ui/react";

export const LoginStyle = ({ children }: { children: React.ReactNode }) => {
    return (
        <Box
            h="100vh"
            // bgGradient='linear(to-r, green.200, pink.500)' 
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={4}
            position="relative"
            overflow="hidden"
  bg="linear-gradient(to bottom, #e0f2ff, #f2f8ff)"
        >
            {/* blurred background shape */}
            <Box
                position="absolute"
                w="600px"
                h="600px"
                opacity={0.5}
                filter="blur(120px)"
                borderRadius="full"
                top="20%"
                left="20%"
                pointerEvents="none"
                zIndex={1}
            />

            {/* content ABOVE the blur layer */}
            <Box zIndex={2}>{children}</Box>
        </Box>
    );
};
