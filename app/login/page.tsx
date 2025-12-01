"use client";

import {
  Box,
  Button,
  Container,
  Heading,
  VStack
} from "@chakra-ui/react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/app/components/FormInput";
import { login } from "../api/user";
import { useRouter } from "next/navigation";
import { loginSchema, LoginSchema } from "@/app/schemas/login.schema";

export default function LoginPage() {
  const router = useRouter();
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
    username: "",
    password: "",
  },
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: LoginSchema) {
    const res = await login(values.username, values.password, setError);
    if (res.success) {
      const user = res.data.user;
      router.push(user.role === "customer" ? "/customer/dashboard" : "/admin");
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
          <VStack gap={6}>
            <Heading>Sign In</Heading>

            <FormProvider {...form}>
              <Box as="form" onSubmit={handleSubmit(onSubmit)} w="full">
                <VStack gap={4}>
                  <FormInput
                    name="username"
                    label="Username"
                    placeholder="admin@example.com"
                  />

                  <FormInput
                    name="password"
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                  />

                  <Button
                    type="submit"
                    loading={isSubmitting}
                    colorScheme="blue"
                    w="full"
                  >
                    Sign In
                  </Button>
                </VStack>
              </Box>
            </FormProvider>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
