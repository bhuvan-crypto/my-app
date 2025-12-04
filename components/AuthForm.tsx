"use client";

import React, { useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  VStack,
} from "@chakra-ui/react";
import {
  FormProvider,
  useForm,
  FieldValues,
  Resolver,
  DefaultValues,
  SubmitHandler,
  ControllerRenderProps,
  FieldError,
  UseFormSetValue,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodSchema } from "zod";
import FormInput, { IFieldType } from "@/components/FormInput";

interface FieldConfig {
  name: string;
  label: string;
  placeholder?: string;
  type: IFieldType;
  options?: {
    label: string;
    value: string;
  }[];
  renderInput?: (field: ControllerRenderProps<FieldValues, string>, error: FieldError | undefined) => React.ReactNode;
}

interface AuthFormProps<T extends FieldValues> {
  title: string;
  schema: ZodSchema<T>;
  defaultValues: DefaultValues<T>;
  fields: FieldConfig[];
  onSubmit: SubmitHandler<T>;
  onFill?: (setValue: UseFormSetValue<T>) => void;
}

export default function AuthForm<T extends FieldValues>({
  title,
  schema,
  defaultValues,
  fields,
  onSubmit,
  onFill
}: AuthFormProps<T>) {
  const form = useForm<T>({
    resolver: (zodResolver(schema as any) as unknown) as Resolver<T, any>,
    defaultValues: defaultValues as DefaultValues<T>,
    mode: "onBlur",
  });

  const { handleSubmit, formState, setValue } = form;
  useEffect(() => {
    if (onFill) onFill(setValue);
  }, [onFill, setValue]);
  return (
    <FormProvider {...form}>
      <Box as="form" onSubmit={handleSubmit(onSubmit)} w="full">
        <VStack gap={4}>
          {fields.map((field) => (
            <FormInput key={field.name} {...field} />
          ))}
          <Button
            type="submit"
            loading={formState.isSubmitting}
            colorScheme="blue"
            w="full"
          >
            {title}
          </Button>
        </VStack>
      </Box>
    </FormProvider>

  );
}
