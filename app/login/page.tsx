"use client";

import { useRouter } from "next/navigation";

import {
  Box,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@chakra-ui/react";

import AuthForm from "@/app/components/AuthForm";

import { loginSchema, LoginSchema } from "@/app/schemas/login.schema";
import { signupSchema, SignupSchema } from "@/app/schemas/signup.schema";

import { login, signup } from "@/app/api/user";
import { useState } from "react";


export default function AuthPage() {
  const router = useRouter();
  const [value, setValue] = useState<"login" | "signup">("login")

  /* ------------------ LOGIN SUBMIT ------------------ */
  async function onLogin(values: LoginSchema) {
    const res = await login(values.username, values.password);

    if (res.success) {
      const user = res.data.user;
      router.push(user.role === "customer" ? "/customer/dashboard" : "/admin");
    }
  }

  /* ------------------ SIGNUP SUBMIT ----------------- */
  async function onSignup(values: SignupSchema) {
    const res = await signup(
      values.username,
      values.password,
      values.role,
    );
    if (res.success) {
    setValue("login");
    }
  }

  return (
    <Box
      h="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Tabs.Root
        defaultValue="login"
        maxW="450px"
        w="100%"
        borderWidth="1px"
        borderRadius="md"
        p={4}
        value={value} onValueChange={(e) => setValue(e.value.toString() as "login" | "signup")}
      >
        <TabsList mb={4}>
          <TabsTrigger value="login" width="50%">
            Login
          </TabsTrigger>
          <TabsTrigger value="signup" width="50%">
            Sign Up
          </TabsTrigger>
        </TabsList>

        {/* ------------------ LOGIN TAB ------------------ */}
        <TabsContent value="login">
          <AuthForm<LoginSchema>
            title="Sign In"
            schema={loginSchema}
            defaultValues={{
              username: "",
              password: "",
            }}
            onSubmit={onLogin}
            fields={[
              {
                name: "username",
                label: "Username",
                placeholder: "admin@example.com",
                type: "text",
              },
              {
                name: "password",
                label: "Password",
                type: "password",
                placeholder: "••••••••",
              },
            ]}
          />
        </TabsContent>

        {/* ------------------ SIGNUP TAB ------------------ */}
        <TabsContent value="signup">
          <AuthForm<SignupSchema>
            title="Sign Up"
            schema={signupSchema}
            defaultValues={{
              username: "",
              password: "",
              confirmPassword: "",
              role: "customer",
            }}
            onSubmit={onSignup}
            fields={[
              {
                name: "role",
                label: "Select Role",
                type: "radio",
                options: [{
                  label: "Customer",
                  value: "customer",
                }, {
                  label: "Admin",
                  value: "admin",
                }],
              },
              {
                name: "username",
                label: "Username",
                placeholder: "admin@example.com",
                type: "text",
              },
              {
                name: "password",
                label: "Password",
                type: "password",
                placeholder: "••••••••",
              },
              {
                name: "confirmPassword",
                label: "Confirm Password",
                type: "password",
                placeholder: "••••••••",
              }
            ]}
          />

        </TabsContent>
      </Tabs.Root>
    </Box>
  );
}
