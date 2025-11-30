"use client";

import {
  Field,
  FieldLabel,
  FieldErrorText,
  Input,
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
            <FieldLabel>{label}</FieldLabel>

            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              _invalid={{ borderColor: "red.500" }} // Chakra v3 pattern
            />

            {error && (
              <FieldErrorText>{error.message}</FieldErrorText>
            )}
          </Field.Root>
        )}
      />
    </Field.Root>
  );
}
