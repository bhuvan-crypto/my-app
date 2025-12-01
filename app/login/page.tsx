"use client";

import FormInput from "@/app/components/FormInput";
import { loginSchema, LoginSchema } from "@/app/schemas/login.schema";
import {
  Box,
  Button,
  Container,
  Group,
  Heading,
  Input,
  VStack
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { login } from "../api/user";

export default function LoginPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
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
                    renderInput={(field, error) => (
                      <Group attached w="full" maxW="sm">
                        <Input
                          {...field}
                          type={show ? "text" : "password"}
                          placeholder="••••••••"
                        />
                        <Button bg="bg.subtle" variant="outline" borderColor={!!error ? "red.500" : undefined} onClick={() => setShow(!show)}>
                          {!show ? (
                            <AiFillEyeInvisible size={18} />
                          ) : (
                            <AiFillEye size={18} />
                          )}
                        </Button>
                      </Group>
                    )}
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
