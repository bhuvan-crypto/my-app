import { z } from "zod";

export const signupSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(6, "Password must be at least 6 chars"),
    confirmPassword: z.string().min(6),
    role: z.enum(["customer", "admin"], {
      message: "Please select a role",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

export type SignupSchema = z.infer<typeof signupSchema>;
