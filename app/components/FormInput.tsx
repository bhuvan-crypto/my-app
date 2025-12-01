"use client";

import {
  Field,
  Input
} from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

interface Props {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
}

export default function FormInput({ name, label, type = "text", placeholder }: Props) {
  const { control } = useFormContext();

  return (
    <Field.Root invalid={false}>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState: { error } }) => (
          <Field.Root invalid={!!error}>
            <Field.Label>{label}</Field.Label>
            <Input  {...field}
              type={type}
              placeholder={placeholder}
              _invalid={{ borderColor: "red.500" }} />
            <Field.ErrorText>{error?.message}</Field.ErrorText>
          </Field.Root>
        )}
      />
    </Field.Root>
  );
}
